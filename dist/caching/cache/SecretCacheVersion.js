"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const SecretCacheObject_1 = require("./SecretCacheObject");
class SecretCacheVersion extends SecretCacheObject_1.SecretCacheObject {
    /**
     * Construct a new cached version for the secret.
     *
     * @param secretId
     *            The secret identifier.  This identifier could be the full ARN
     *            or the friendly name for the secret.
     * @param versionId
     *            The version identifier that should be used when requesting the
     *            secret value from AWS Secrets Manager.
     * @param client
     *            The AWS Secrets Manager client to use for requesting the secret.
     * @param config
     *            The secret cache configuration.
     */
    constructor(secretId, versionId, client, config) {
        super(secretId, client, config);
        this.versionId = versionId;
        this.hash = this.calcHash(`${secretId} ${versionId}`);
    }
    calcHash(str) {
        var hash = 0, i, chr;
        if (str.length === 0)
            return hash;
        for (i = 0; i < str.length; i++) {
            chr = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }
    hashCode() {
        return this.hash;
    }
    /**
     * Execute the logic to perform the actual refresh of the item.
     *
     * @return The result from AWS Secrets Manager for the refresh.
     */
    executeRefresh() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let parms = {
                    SecretId: this.secretId,
                    VersionId: this.versionId
                };
                this.client.getSecretValue(parms, (err, data) => {
                    if (err)
                        reject(err);
                    resolve(data);
                });
            });
        });
    }
    /**
     * Return the cached result from AWS Secrets Manager for GetSecretValue.
     *
     * @param gsvResult
     *            The result of the Get Secret Value request to AWS Secrets Manager.
     * @return The cached GetSecretValue result.
     */
    getSecretValueInternal(gsvResult) {
        return __awaiter(this, void 0, void 0, function* () {
            return gsvResult;
        });
    }
}
exports.SecretCacheVersion = SecretCacheVersion;
//# sourceMappingURL=SecretCacheVersion.js.map