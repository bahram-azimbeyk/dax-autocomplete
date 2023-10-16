export interface SuggestionModel {
    name: string;
    optionType: 'column' | 'table' | 'keyword';
    id?: string;
    columnParentName?: string;
    columnType?: 'OriginalColumn' | 'CalculateColumn' | 'ConditionalColumn' | 'Measure';
    columnDataType?: 'wholeNumber' | 'decimalNumber' | 'date' | 'boolean' | 'text';
    columnDataModuleType?: 'Quantity' | 'Quality';
}
