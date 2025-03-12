"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadBlogError = exports.S3PutError = exports.MissingKeyError = exports.MissingEnvironmentVariableError = void 0;
class MissingEnvironmentVariableError extends Error {
    constructor(env_var) {
        super(env_var);
        this.name = "MissingEnvironmentVariableError";
        this.message = `We are missing the following Env Var: ${env_var}`;
    }
}
exports.MissingEnvironmentVariableError = MissingEnvironmentVariableError;
class MissingKeyError extends Error {
    constructor() {
        super();
        this.name = "MissingKeyError";
        this.message = `The event is missing the key value in the queryStringParameters field`;
    }
}
exports.MissingKeyError = MissingKeyError;
class S3PutError extends Error {
    constructor() {
        super();
        this.name = "S3PutError";
        this.message = `There was an error when attempting to put the object in s3`;
    }
}
exports.S3PutError = S3PutError;
class UploadBlogError extends Error {
    constructor(message) {
        super(message);
        this.name = "UploadBlogError";
        this.message = `There was an error when attempting to upload the blog: ${message}`;
    }
}
exports.UploadBlogError = UploadBlogError;
