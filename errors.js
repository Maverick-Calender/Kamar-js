class AuthenticationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'AuthenticationError';
        Error.captureStackTrace(this, AuthenticationError)
    }
}

class AccessDenied extends Error {
    constructor(message) {
        super(message);
        this.name = 'AccessDenied';
        Error.captureStackTrace(this, AccessDenied)
    }
}

class UnknownCommand extends Error {
    constructor(message) {
        super(message);
        this.name = 'UnknownCommand';
        Error.captureStackTrace(this, UnknownCommand)
    }
}

module.exports = {
    AuthenticationError,
    AccessDenied,
    UnknownCommand
  }