class NotEnoughPlayersException extends Error {
    constructor(message) {
        super(message);
        this.message = message || 'Not enough players';
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = NotEnoughPlayersException;