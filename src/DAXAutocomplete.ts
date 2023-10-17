
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
      return [...this.daxKeywords, ...this.tables];
    }

    const lastToken = tokens[tokens.length - 1];

    // If the last token is a function or table name prefix
    if (this.isPartialName(lastToken)) {
      return [
        ...this.daxKeywords.filter(func => func.name.startsWith(lastToken)),
        ...this.tables.filter(table => table.name.startsWith(lastToken))
      ];
    }

    // If the last token is a column name prefix
    if (lastToken.startsWith('[')) {
      const partialColumnName = lastToken.slice(1);
      return this.columns.filter(column => column.name.startsWith(partialColumnName));
    }

    return [];
  }

  setTables(tableOptions: TableModels[]): void {
    this.tables = this.tablesMapToSuggestionModel(tableOptions);
  }

  setColumns(columnOptions: ColumnModel[]): void {
    this.columns = this.columnsMapToSuggestionModel(columnOptions);
  }

  private tablesMapToSuggestionModel(tables: TableModels[]): SuggestionModel[] {
    return tables.map(table => {
      return {
        name: table.name,
        id: table.id,
        optionType: 'table'
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
        optionType: 'column'
      } as SuggestionModel;
    });
  }

  private isPartialName(token: string): boolean {
    return this.daxKeywords.some(func => func.name.startsWith(token)) || this.tables.some(table => table.name.startsWith(token));
  }
}
