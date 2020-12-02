import { ComparisionOperatorType, Collection, FieldType, ValueType, ComparisionFunctionReturn, ComparisionFunctionParams } from './types';
import { ComparisionOperatorEnum, LogicalOperatorEnum } from './enum';
import IBuilder from './interfaces/IBuilder';

export default class WhereBuilder implements IBuilder {

  private collections: Collection[] = []

  public static create(): WhereBuilder {
    return new WhereBuilder();
  }

  public and(field: FieldType, operator?: ComparisionOperatorType, value?: ValueType): WhereBuilder {
    this.addComparision(LogicalOperatorEnum.AND, field, operator, value);
    return this;
  }

  public or(field: FieldType, operator?: ComparisionOperatorType, value?: ValueType): WhereBuilder {
    this.addComparision(LogicalOperatorEnum.OR, field, operator, value);
    return this;
  }

  public handle(): string {

    let where: string = '';

    this.collections.map(({ factory, logicalOperator }, index) => {

      const result = factory.handle();

      if (index > 0 && result !== '') {
        where += `${logicalOperator} `;
      }

      if (factory instanceof WhereBuilder) {
        where += `(${result}) `; 
      } else {
        where += `${result} `;
      }
    });
    
    return where.trim().replace(' ()', '').replace('()', '').trim();
  }

  private createSubWhere(callback: Function, logicalOperator: LogicalOperatorEnum): WhereBuilder {
    const newWb = WhereBuilder.create();
    callback(newWb);
    this.collections.push({
      logicalOperator: logicalOperator,
      factory: newWb,
    });
    return this;
  }

  private addComparision(logicalOperator: LogicalOperatorEnum, field: FieldType, operator?: ComparisionOperatorType, value?: ValueType): void {
    if (typeof field === 'function') {
      this.createSubWhere(field, logicalOperator);
      return;
    } else if(operator) {

      const { newValue, continueDefault } = this.alternativeConditionFactory(operator)({ logicalOperator, field, value });

      if (continueDefault) {
        if(newValue) {
          value = newValue;
        }

        if(value === undefined) {
          value = operator;
          operator = ComparisionOperatorEnum.equal;
        }
  
        const object: Collection = {
          logicalOperator: logicalOperator,
          factory: {
            handle: () => `${field} ${operator} ${value}`
          }
        };
  
        this.collections.push(object);
      }
    }
  }

  private alternativeConditionFactory(operator: ComparisionOperatorType): Function {
    const fluxs = {
      [ComparisionOperatorEnum.in]: this.processRuleInOperator,
      [ComparisionOperatorEnum.notIn]: this.processRuleNotInOperator,
      [ComparisionOperatorEnum.between]: this.processRuleBetweenOperator,
      [ComparisionOperatorEnum.like]: this.processRuleLikeOperator,
    };
    return fluxs[operator] || (() => ({ continueDefault: true }));
  }

  private processRuleLikeOperator = ({ value } : ComparisionFunctionParams): ComparisionFunctionReturn => {
    return { continueDefault: true, newValue: `*${value}*`};
  }

  private processRuleBetweenOperator = ({ value } : ComparisionFunctionParams): ComparisionFunctionReturn => {
    if(Array.isArray(value) && value.length >= 2) {
      return { continueDefault: true, newValue: `${value[0]} AND ${value[1]}` };
    }
    return { continueDefault: false };
  }

  private processRuleInOperator = ({ logicalOperator, field, value }: ComparisionFunctionParams): ComparisionFunctionReturn => {
    if (Array.isArray(value)) {
      this.createSubWhere((wbIn: WhereBuilder) => {
        if (value !== null && typeof value !== 'string') {
          value.forEach(item => wbIn.or(field, ComparisionOperatorEnum.equal, item));
        }
      }, logicalOperator);
    }
    return { continueDefault: false };
  }

  private processRuleNotInOperator = ({ logicalOperator, field, value }: ComparisionFunctionParams): ComparisionFunctionReturn => {
    if (Array.isArray(value)) {
      this.createSubWhere((wbIn: WhereBuilder) => {
        if (value !== null && typeof value !== 'string') {
          value.forEach(item => wbIn.and(field, ComparisionOperatorEnum.opposite, item));
        }
      }, logicalOperator);
    }
    return { continueDefault: false };
  }
};