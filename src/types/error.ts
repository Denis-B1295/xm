export class ConfigurationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ConfigurationError';
    }
}
  
export class YahooApiError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'YahooApiError';
    }
}

export class DataValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'DataValidationError';
    }
}
  