
export interface TableModels {
  name: string;
  id?: string;
}

export interface ColumnModel extends TableModels {
  columnParentName?: string;
  columnType?: 'OriginalColumn' | 'CalculateColumn' | 'ConditionalColumn' | 'Measure';
  columnDataType?: DataType;
  columnDataModuleType?: 'Quantity' | 'Quality';
}

export interface SuggestionModel extends ColumnModel {
  optionType: 'column' | 'table' | 'keyword';
  prefix?: string;
  suffix?: string;
}


type DataType = 'WholeNumber' | 'DecimalNumber' | 'Currency' | 'Date' |
  'Boolean' | 'Text' | 'Binary' | 'Variant' | 'Double';