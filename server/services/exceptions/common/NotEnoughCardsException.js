export default class NotEnoughCardsException extends Error {
    constructor(message) {
        super(message);
        this.message = message || 'The player has too few cards';
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}