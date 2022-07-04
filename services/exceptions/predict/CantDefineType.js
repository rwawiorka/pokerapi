class CantDefineType extends Error {
    constructor(message) {
        super(message);
        this.message = message || 'Cant define type (preflop, etc.)';
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = CantDefineType;