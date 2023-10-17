import { DAXAutocomplete } from '../DAXAutocomplete';

describe('DAXAutocomplete', () => {
    let autocomplete: DAXAutocomplete;

    beforeEach(() => {
        autocomplete = new DAXAutocomplete();
    });

    test('should provide function suggestions for empty formula', () => {
        const suggestions = autocomplete.autocomplete('');
        const functionNames = suggestions.filter(s => s.optionType === 'keyword').map(s => s.name);
        expect(functionNames).toContain('SUM');
        expect(functionNames).toContain('SUMX');
    });

    test('should provide table suggestions when tables are set', () => {
        autocomplete.setTables([{ name: 'Sales', id: 'test' }]);
        const suggestions = autocomplete.autocomplete('Sal');
        const tableNames = suggestions.filter(s => s.optionType === 'table').map(s => s.name);
        expect(tableNames).toContain('Sales');
    });

    test('should provide column suggestions when columns are set', () => {
        autocomplete.setColumns([{ name: 'ProductName', id: 'test' }]);
        const suggestions = autocomplete.autocomplete('[Product');
        const columnNames = suggestions.map(s => s.name);
        expect(columnNames).toContain("ProductName");
    });

    test('should not provide suggestions for unrecognized tokens', () => {
        const suggestions = autocomplete.autocomplete('UnrecognizedToken');
        expect(suggestions).toHaveLength(0);
    });

    test('should provide suggestions based on cursor position', () => {
        autocomplete.setTables([{ name: 'Sales', id: 'test' }, { name: 'Products', id: 'test2' }]);
        const suggestions = autocomplete.autocomplete('Sales + Prod', 13); // Cursor after "Prod"
        const tableNames = suggestions.filter(s => s.optionType === 'table').map(s => s.name);
        expect(tableNames).toContain('Products');
        expect(tableNames).not.toContain('Sales');
    });
});
