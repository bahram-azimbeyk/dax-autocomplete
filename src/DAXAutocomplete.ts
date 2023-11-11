
import { DAXKeywords } from "./keywords/DAXKeywords";
import { ColumnModel, SuggestionModel, TableModels } from "./models/models";
import { DAXTokenizer } from "./tokenizer/DAXTokenizer";


export class DAXAutocomplete {
  private daxKeywords: SuggestionModel[] = DAXKeywords;
  private tables: SuggestionModel[] = [];
  private columns: SuggestionModel[] = [];

  constructor(tableOptions?: TableModels[], columnOptions?: ColumnModel[]) {
    if (tableOptions) {
      this.setTables(this.tablesMapToSuggestionModel(tableOptions));
    }
    if (columnOptions) {
      this.setColumns(this.columnsMapToSuggestionModel(columnOptions));
    }
  }

  autocomplete(daxFormula: string, atIndex?: number): SuggestionModel[] {
    const tokenizer = new DAXTokenizer(daxFormula, atIndex);
    const tokens: string[] = [];
    let token: string | null;
    while (token = tokenizer.nextToken()) {
      tokens.push(token);
    }

    if (tokens.length === 0 || !tokens[tokens.length - 1].trim()) {
      return [];
    }

    const lastToken = tokens[tokens.length - 1];

    // If the last token is a function or table name prefix
    if (this.isPartialName(lastToken)) {
      return [
        ...this.daxKeywords.filter(func => func.name.toLowerCase().startsWith(lastToken.toLowerCase())),
        ...this.tables.filter(table => table.name.toLowerCase().startsWith(lastToken.toLowerCase()))
      ];
    }

    if (lastToken.startsWith("'")) {
      let partialTableName = lastToken.slice(1);
      if (partialTableName.endsWith("'")) {
        partialTableName = partialTableName.slice(0, -1);
      }
      return this.tables.filter(table => table.name.toLowerCase().startsWith(partialTableName.toLowerCase()));
    }

    // If the last token is a column name prefix
    if (lastToken.startsWith('[')) {
      let partialColumnName = lastToken.slice(1);
      if (partialColumnName.endsWith(']')) {
        partialColumnName = partialColumnName.slice(0, -1);
      }
      return this.columns.filter(column => column.name.toLowerCase().startsWith(partialColumnName.toLowerCase()));
    }

    return [];
  }

  setTables(tableOptions: TableModels[]): void {
    this.tables = this.tablesMapToSuggestionModel(tableOptions);
  }

  setColumns(columnOptions: ColumnModel[]): void {
    this.columns = this.columnsMapToSuggestionModel(columnOptions);
  }

  insertSuggestion(daxFormula: string, selectedSuggestion: SuggestionModel, atIndex?: number): string {
    // Extract prefix and suffix from the suggestion model or default to empty string
    const prefix = selectedSuggestion.prefix || '';
    const suffix = selectedSuggestion.suffix || '';

    // If atIndex is not provided, insert at the end of the formula
    if (atIndex === undefined) {
      return daxFormula + prefix + selectedSuggestion.name + suffix;
    }

    // Find the start of the partial word to be replaced
    let startIdx = atIndex;
    while (startIdx > 0 && /[\u0600-\u06FFa-zA-Z0-9_ ]/.test(daxFormula[startIdx - 1])) {
      startIdx--;
    }

    // Find the end of the partial word to be replaced
    let endIdx = atIndex;
    while (endIdx < daxFormula.length && /[\u0600-\u06FFa-zA-Z0-9_ ]/.test(daxFormula[endIdx])) {
      endIdx++;
    }

    // Check if the prefix and suffix already exist in the formula
    if (daxFormula[startIdx - 1] === prefix) {
      startIdx--;
    }
    if (daxFormula[endIdx] === suffix) {
      endIdx++;
    }

    // Construct the new formula by replacing the partial word with the suggestion
    const newDaxFormula = daxFormula.substring(0, startIdx) +
      prefix +
      selectedSuggestion.name +
      suffix +
      daxFormula.substring(endIdx);

    return newDaxFormula;
  }

  private tablesMapToSuggestionModel(tables: TableModels[]): SuggestionModel[] {
    return tables.map(table => {
      return {
        name: table.name,
        id: table.id,
        optionType: 'table',
        prefix: "'",
        suffix: "'",
      } as SuggestionModel;
    });
  }

  private columnsMapToSuggestionModel(columns: ColumnModel[]): SuggestionModel[] {
    return columns.map(column => {
      return {
        name: column.name,
        id: column.id,
        columnParentName: column.columnParentName,
        columnType: column.columnType,
        columnDataType: column.columnDataType,
        columnDataModuleType: column.columnDataModuleType,
        optionType: 'column',
        prefix: '[',
        suffix: ']',
      } as SuggestionModel;
    });
  }

  private isPartialName(token: string): boolean {
    return this.daxKeywords.some(func => func.name.toLowerCase().startsWith(token.toLowerCase())) ||
      this.tables.some(table => table.name.toLowerCase().startsWith(token.toLowerCase()));
  }
}
