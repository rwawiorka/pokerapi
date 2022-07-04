class NoCardsRepeatException extends Error {
    constructor(message) {
        super(message);
        this.message = message || 'Cards cannot be repeated';
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = NoCardsRepeatException;