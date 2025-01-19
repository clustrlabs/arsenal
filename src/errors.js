const { logger } = require("./logger");

class CustomError extends Error {
    constructor(message) {
        super(message);
        logger.fatal(this.name, message);
    }
}

class NetworkError extends CustomError {
    constructor(message) {
        super(message);
        this.name = 'NetworkError';
    }
}

class InvalidResponse extends CustomError {
    constructor(message) {
        super(message);
        this.name = 'InvalidResponse';
    }
}

class InvalidAction extends CustomError {
    constructor(message) {
        super(message);
        this.name = 'InvalidAction';
    }
}

class InvalidSchema extends CustomError {
    constructor(message) {
        super(message);
        this.name = 'InvalidSchema';
    }
}

class InvalidCallback extends CustomError {
    constructor(message) {
        super(message);
        this.name = 'InvalidCallback';
    }
}

class EmptyResponse extends CustomError {
    constructor(message) {
        super(message);
        this.name = 'EmptyResponse';
    }
}

class ContentRefusal extends CustomError {
    constructor(message) {
        super(message);
        this.name = 'ContentRefusal';
    }
}

class InsufficientTokens extends CustomError {
    constructor(message) {
        super(message);
        this.name = 'InsufficientTokens';
    }
}

class ExecutionError extends CustomError {
    constructor(message) {
        super(message);
        this.name = 'ExecutionError';
    }
}

module.exports = {
    NetworkError,
    InvalidResponse,
    InvalidAction,
    InvalidSchema,
    InvalidCallback,
    EmptyResponse,
    ContentRefusal,
    InsufficientTokens,
    ExecutionError
};
