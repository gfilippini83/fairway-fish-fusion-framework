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
