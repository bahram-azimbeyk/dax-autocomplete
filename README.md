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

// Set custom tables
autocomplete.setTables([{ name: 'Sales' }]);

// Set custom columns
autocomplete.setColumns([{ 
    name: 'ProductName', 
    columnParentName: 'Sales', 
    columnType: 'OriginalColumn', 
    columnDataType: 'Text', 
    columnDataModuleType: 'Quantity' 
}]);

// Get suggestions
const suggestions = autocomplete.autocomplete('SUM(');
console.log(suggestions); // Outputs an array of suggestions
```

## Models

### `TableModels`

- `name`: Name of the table.
- `id`: Optional ID for the table.

### `ColumnModel`

- `name`: Name of the column.
- `id`: Optional ID for the column.
- `columnParentName`: Parent table of the column.
- `columnType`: Type of the column ('OriginalColumn', 'CalculateColumn', 'ConditionalColumn', 'Measure').
- `columnDataType`: Data type of the column ('WholeNumber', 'DecimalNumber', etc.).
- `columnDataModuleType`: Module type of the column data ('Quantity' or 'Quality').

### `SuggestionModel`

A model representing a suggestion. Properties include:

- `name`: The name of the suggestion (e.g., function name, table name, column name).
- `optionType`: The type of suggestion (`'keyword'`, `'table'`, or `'column'`).
- Additional properties for columns like `columnType`, `columnDataType`, `id` , etc.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
