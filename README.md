# DAX Autocomplete

A TypeScript library for providing autocomplete suggestions for DAX (Data Analysis Expressions) formulas.

## Features

- Tokenizes DAX formulas to understand the context.
- Provides suggestions for DAX functions, table names, and column names.
- Allows customization by setting specific table and column names.

## Installation

```bash
npm install dax-autocomplete
```

## Usage

```typescript
import { DAXAutocomplete } from 'dax-autocomplete';

const autocomplete = new DAXAutocomplete();

// Set custom tables and columns
autocomplete.setTables([{ name: 'Sales', optionType: 'table' }]);
autocomplete.setColumns([{ name: 'ProductName', optionType: 'column' }]);

// Get suggestions
const suggestions = autocomplete.autocomplete('SUM(');
console.log(suggestions); // Outputs an array of suggestions
```

## API

### `DAXAutocomplete`

#### Methods

- `autocomplete(daxFormula: string, atIndex?: number)`: Provides autocomplete suggestions based on the DAX formula and the cursor position (optional).
- `setTables(tableOptions: SuggestionModel[])`: Sets the available table names for suggestions.
- `setColumns(columnOptions: SuggestionModel[])`: Sets the available column names for suggestions.

### `SuggestionModel`

A model representing a suggestion. Properties include:

- `name`: The name of the suggestion (e.g., function name, table name, column name).
- `optionType`: The type of suggestion (`'keyword'`, `'table'`, or `'column'`).
- Additional properties for columns like `columnType`, `columnDataType`, etc.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

