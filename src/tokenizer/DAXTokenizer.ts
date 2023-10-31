export class DAXTokenizer {
    private formula: string;
    private currentIndex: number;
    private endIndex: number;

    constructor(formula: string, endIndex?: number) {
        this.formula = formula;
        this.currentIndex = 0;
        this.endIndex = endIndex ?? formula.length;
    }

    nextToken(): string | null {
        if (this.currentIndex >= this.endIndex) {
            return null;
        }
        // Skip whitespace
        while (this.currentIndex < this.formula.length && this.isWhitespace(this.formula[this.currentIndex])) {
            this.currentIndex++;
        }

        if (this.currentIndex >= this.formula.length) {
            return null;  // End of formula
        }

        const currentChar = this.formula[this.currentIndex];

        // Handle different token types
        if (this.isLetter(currentChar)) {
            return this.readFunctionOrTableName();
        } else if (currentChar === '[') {
            return this.readColumnName();
        } else if (this.isOperator(currentChar)) {
            this.currentIndex++;
            return currentChar;
        } else if (this.isDigit(currentChar)) {
            return this.readNumber();
        } else if (currentChar === '"') {
            return this.readString();
        } else {
            this.currentIndex++;
            return currentChar;
        }
    }

    // Helper methods to identify character types and read tokens
    private isWhitespace(char: string): boolean {
        return /\s/.test(char);
    }

    private isLetter(char: string): boolean {
        return /[a-zA-Z]/.test(char);
    }

    private isDigit(char: string): boolean {
        return /[0-9]/.test(char);
    }

    private isOperator(char: string): boolean {
        return /[+\-*/&]/.test(char);
    }

    private readFunctionOrTableName(): string {
        let start = this.currentIndex;
        while (this.currentIndex < this.formula.length && /[a-zA-Z0-9_]/.test(this.formula[this.currentIndex])) {
            this.currentIndex++;
        }
        return this.formula.substring(start, this.currentIndex);
    }

    private readColumnName(): string {
        let start = this.currentIndex;
        while (this.currentIndex < this.formula.length &&
            (/[a-zA-Z0-9_]/.test(this.formula[this.currentIndex]) || this.formula[this.currentIndex] === '[')) {
            this.currentIndex++;
        }
        // If the current character is a closing bracket, skip it
        if (this.formula[this.currentIndex] === ']') {
            this.currentIndex++;
        }
        return this.formula.substring(start, this.currentIndex);
    }

    private readNumber(): string {
        let start = this.currentIndex;
        while (this.currentIndex < this.formula.length && /[0-9.]/.test(this.formula[this.currentIndex])) {
            this.currentIndex++;
        }
        return this.formula.substring(start, this.currentIndex);
    }

    private readString(): string {
        let start = this.currentIndex;
        this.currentIndex++;  // Skip opening "
        while (this.currentIndex < this.formula.length && this.formula[this.currentIndex] !== '"') {
            this.currentIndex++;
        }
        this.currentIndex++;  // Skip closing "
        return this.formula.substring(start, this.currentIndex);
    }
}
