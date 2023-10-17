
import { DAXKeywords } from "./keywords/DAXKeywords";
import { SuggestionModel } from "./models/models";
import { DAXTokenizer } from "./tokenizer/DAXTokenizer";


export class DAXAutocomplete {
    private daxKeywords: SuggestionModel[] = DAXKeywords;
    private tables: SuggestionModel[] = [];
    private columns: SuggestionModel[] = [];

    constructor(tableOptions?: SuggestionModel[], columnOptions?: SuggestionModel[]) {
        if (tableOptions) {
            this.setTables(tableOptions);
        }
        if (columnOptions) {
            this.setColumns(columnOptions);
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

    setTables(tableOptions: SuggestionModel[]): void {
        this.tables = tableOptions;
    }

    setColumns(columnOptions: SuggestionModel[]): void {
        this.columns = columnOptions;
    }

    private isPartialName(token: string): boolean {
        return this.daxKeywords.some(func => func.name.startsWith(token)) || this.tables.some(table => table.name.startsWith(token));
    }
}
