export default class NoProperCardsGivenException extends Error {
    constructor(message) {
        super(message);
        this.message = message || 'No proper cards given.';
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}