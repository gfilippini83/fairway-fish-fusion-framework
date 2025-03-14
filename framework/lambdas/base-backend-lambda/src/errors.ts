export class MissingEnvironmentVariableError extends Error {
    constructor(env_var: string) {
        super(env_var)
        this.name = "MissingEnvironmentVariableError"
        this.message = `We are missing the following Env Var: ${env_var}`
    }
}

export class MissingKeyError extends Error {
    constructor() {
        super()
        this.name = "MissingKeyError"
        this.message = `The event is missing the key value in the queryStringParameters field`
    }
}

export class S3PutError extends Error {
    constructor() {
        super()
        this.name = "S3PutError"
        this.message = `There was an error when attempting to put the object in s3`
    }
}

export class UploadBlogError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "UploadBlogError"
        this.message = `There was an error when attempting to upload the blog: ${message}`
    }
}

export class NoAuthTokenError extends Error {
    constructor() {
        super()
        this.name = "NoAuthTokenError"
        this.message = "No auth token provided with request."
    }
}

export class TokenInvalidError extends Error {
    constructor(message: string) {
        super(message)
        this.name = "TokenInvalidError"
        this.message = `Token was provided but it was invalid: ${message}`
    }
}