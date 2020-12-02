"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enum_1 = require("./enum");
class WhereBuilder {
    constructor() {
        this.collections = [];
        this.processRuleLikeOperator = ({ value }) => {
            return { continueDefault: true, newValue: `*${value}*` };
        };
        this.processRuleBetweenOperator = ({ value }) => {
            if (Array.isArray(value) && value.length >= 2) {
                return { continueDefault: true, newValue: `${value[0]} AND ${value[1]}` };
            }
            return { continueDefault: false };
        };
        this.processRuleInOperator = ({ logicalOperator, field, value }) => {
            if (Array.isArray(value)) {
                this.createSubWhere((wbIn) => {
                    if (value !== null && typeof value !== 'string') {
                        value.forEach(item => wbIn.or(field, enum_1.ComparisionOperatorEnum.equal, item));
                    }
                }, logicalOperator);
            }
            return { continueDefault: false };
        };
        this.processRuleNotInOperator = ({ logicalOperator, field, value }) => {
            if (Array.isArray(value)) {
                this.createSubWhere((wbIn) => {
                    if (value !== null && typeof value !== 'string') {
                        value.forEach(item => wbIn.and(field, enum_1.ComparisionOperatorEnum.opposite, item));
                    }
                }, logicalOperator);
            }
            return { continueDefault: false };
        };
    }
    static create() {
        return new WhereBuilder();
    }
    and(field, operator, value) {
        this.addComparision(enum_1.LogicalOperatorEnum.AND, field, operator, value);
        return this;
    }
    or(field, operator, value) {
        this.addComparision(enum_1.LogicalOperatorEnum.OR, field, operator, value);
        return this;
    }
    handle() {
        let where = '';
        this.collections.map(({ factory, logicalOperator }, index) => {
            const result = factory.handle();
            if (index > 0 && result !== '') {
                where += `${logicalOperator} `;
            }
            if (factory instanceof WhereBuilder) {
                where += `(${result}) `;
            }
            else {
                where += `${result} `;
            }
        });
        return where.trim().replace(' ()', '').replace('()', '').trim();
    }
    createSubWhere(callback, logicalOperator) {
        const newWb = WhereBuilder.create();
        callback(newWb);
        this.collections.push({
            logicalOperator: logicalOperator,
            factory: newWb,
        });
        return this;
    }
    addComparision(logicalOperator, field, operator, value) {
        if (typeof field === 'function') {
            this.createSubWhere(field, logicalOperator);
            return;
        }
        else if (operator) {
            const { newValue, continueDefault } = this.alternativeConditionFactory(operator)({ logicalOperator, field, value });
            if (continueDefault) {
                if (newValue) {
                    value = newValue;
                }
                if (value === undefined) {
                    value = operator;
                    operator = enum_1.ComparisionOperatorEnum.equal;
                }
                const object = {
                    logicalOperator: logicalOperator,
                    factory: {
                        handle: () => `${field} ${operator} ${value}`
                    }
                };
                this.collections.push(object);
            }
        }
    }
    alternativeConditionFactory(operator) {
        const fluxs = {
            [enum_1.ComparisionOperatorEnum.in]: this.processRuleInOperator,
            [enum_1.ComparisionOperatorEnum.notIn]: this.processRuleNotInOperator,
            [enum_1.ComparisionOperatorEnum.between]: this.processRuleBetweenOperator,
            [enum_1.ComparisionOperatorEnum.like]: this.processRuleLikeOperator,
        };
        return fluxs[operator] || (() => ({ continueDefault: true }));
    }
}
exports.default = WhereBuilder;
;
