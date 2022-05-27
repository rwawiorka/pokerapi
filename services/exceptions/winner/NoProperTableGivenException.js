class NoProperTableGivenException extends Error {
    constructor(message) {
        super(message);
        this.message = message || 'Zero or too few cards on table';
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = NoProperTableGivenException;