class HttpError extends Error{
    constructor(message,errorMESSAGE){
        super(message);
        this.code = errorMESSAGE;

    }
}

module.exports = HttpError;