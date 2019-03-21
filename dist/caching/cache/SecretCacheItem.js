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
const SecretCacheVersion_1 = require("./SecretCacheVersion");
const LRUCache = require("lru-cache");
const underscore = require("underscore");
class SecretCacheItem extends SecretCacheObject_1.SecretCacheObject {
    /**
     * Construct a new cached item for the secret.
     *
     * @param secretId
     *            The secret identifier.  This identifier could be the full ARN
     *            or the friendly name for the secret.
     * @param client
     *            The AWS Secrets Manager client to use for requesting the secret.
     * @param config
     *            Cache configuration.
     */
    constructor(secretId, client, config) {
        super(secretId, client, config);
        /**
         * The next scheduled refresh time for this item.  Once the item is accessed
         * after this time, the item will be synchronously refreshed.
         */
        this.nextRefreshTime = 0;
        /** The cached secret value versions for this cached secret. */
        this.versions = new LRUCache(10);
    }
    isRefreshNeeded() {
        if (super.isRefreshNeeded()) {
            return true;
        }
        if (null != this.exception) {
            return false;
        }
        if ((+new Date()) >= this.nextRefreshTime) {
            return true;
        }
        return false;
    }
    executeRefresh() {
        return __awaiter(this, void 0, void 0, function* () {
            let params = {
                SecretId: this.secretId
            };
            let result = new Promise((resolve, reject) => {
                this.client.describeSecret(params, (err, data) => {
                    console.log(err);
                    if (err)
                        reject(err);
                    let ttl = this.config.getCacheItemTTL();
                    let min = ttl / 2;
                    let max = ttl + 1;
                    this.nextRefreshTime = (+new Date()) + Math.floor(Math.random() * (max - min)) + min;
                    resolve(data);
                });
            });
            return result;
        });
    }
    getSecretValueInternal(result) {
        return __awaiter(this, void 0, void 0, function* () {
            let version = yield this.getVersion(result);
            if (null == version) {
                return null;
            }
            return version.getSecretValue();
        });
    }
    /**
     * Return the secret version based on the current state of the secret.
     *
     * @param describeResult
     *            The result of the Describe Secret request to AWS Secrets Manager.
     * @return The cached secret version.
     */
    getVersion(describeResult) {
        if (null == describeResult)
            return null;
        let versionIdStages = describeResult.VersionIdsToStages;
        if (null == versionIdStages)
            return null;
        let versionStage = this.config.getVersionStage();
        // find the version id of the current stage
        let currentVersionId = underscore.findKey(versionIdStages, (value, key) => {
            return value.includes('AWSCURRENT');
        });
        if (currentVersionId !== undefined) {
            let version = this.versions.get(currentVersionId);
            if (null == version) {
                this.versions.set(currentVersionId, new SecretCacheVersion_1.SecretCacheVersion(this.secretId, currentVersionId, this.client, this.config));
                version = this.versions.get(currentVersionId);
            }
            return version;
        }
        return null;
    }
}
exports.SecretCacheItem = SecretCacheItem;
//# sourceMappingURL=SecretCacheItem.js.map