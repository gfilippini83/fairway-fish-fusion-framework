"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PresignerHandler = void 0;
const process_1 = __importDefault(require("process"));
const errors_1 = require("./errors");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const client_s3_1 = require("@aws-sdk/client-s3");
class PresignerHandler {
    constructor() {
        this.bucket = this.getBucket();
        this.region = this.getRegion();
    }
    handle(event) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!((_a = event.queryStringParameters) === null || _a === void 0 ? void 0 : _a.key)) {
                throw new errors_1.MissingKeyError();
            }
            const key = event.queryStringParameters.key;
            return yield this.createPresignedUrlWithClient(key);
            // return await this.put(url, event.body!)
        });
    }
    createPresignedUrlWithClient(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const region = this.region;
            const bucket = this.bucket;
            const client = new client_s3_1.S3Client({ region });
            const command = new client_s3_1.PutObjectCommand({ Bucket: bucket, Key: key });
            return (0, s3_request_presigner_1.getSignedUrl)(client, command, { expiresIn: 3600 });
        });
    }
    ;
    getBucket() {
        if (process_1.default.env.PRIVATE_BUCKET_NAME) {
            return process_1.default.env.PRIVATE_BUCKET_NAME;
        }
        else {
            throw new errors_1.MissingEnvironmentVariableError("PRIVATE_BUCKET_NAME");
        }
    }
    getRegion() {
        if (process_1.default.env.AWS_REGION) {
            return process_1.default.env.AWS_REGION;
        }
        else {
            throw new errors_1.MissingEnvironmentVariableError("AWS_REGION");
        }
    }
}
exports.PresignerHandler = PresignerHandler;
