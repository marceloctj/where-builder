"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogicalOperatorEnum = exports.ComparisionOperatorEnum = void 0;
var ComparisionOperatorEnum;
(function (ComparisionOperatorEnum) {
    ComparisionOperatorEnum["equal"] = "=";
    ComparisionOperatorEnum["opposite"] = "<>";
    ComparisionOperatorEnum["in"] = "in";
    ComparisionOperatorEnum["between"] = "between";
    ComparisionOperatorEnum["notIn"] = "not in";
    ComparisionOperatorEnum["gt"] = ">";
    ComparisionOperatorEnum["gte"] = ">=";
    ComparisionOperatorEnum["lt"] = "<";
    ComparisionOperatorEnum["lte"] = "<=";
    ComparisionOperatorEnum["like"] = "like";
})(ComparisionOperatorEnum = exports.ComparisionOperatorEnum || (exports.ComparisionOperatorEnum = {}));
var LogicalOperatorEnum;
(function (LogicalOperatorEnum) {
    LogicalOperatorEnum["AND"] = "AND";
    LogicalOperatorEnum["OR"] = "OR";
})(LogicalOperatorEnum = exports.LogicalOperatorEnum || (exports.LogicalOperatorEnum = {}));
