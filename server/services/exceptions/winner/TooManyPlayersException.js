export default class TooManyPlayersException extends Error {
    constructor(message) {
        super(message);
        this.message = message || 'Too many players';
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}