import { ComparisionOperatorEnum, LogicalOperatorEnum } from '../enum';
import IBuilder from '../interfaces/IBuilder';

export type FieldType = string|Function;
export type ValueType = string|string[]|null;

export type ComparisionOperatorType = ComparisionOperatorEnum | string;

export type Collection = {
  factory: IBuilder,
  logicalOperator: LogicalOperatorEnum
}

export type ComparisionFunctionParams = {
  logicalOperator: LogicalOperatorEnum, 
  field: FieldType,
  operator?: ComparisionOperatorType,
  value?: ValueType
}

export type ComparisionFunctionReturn = {
  continueDefault: boolean,
  newValue?: any
}