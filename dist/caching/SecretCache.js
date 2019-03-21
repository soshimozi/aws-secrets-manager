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
const LRUCache = require("lru-cache");
const SecretCacheItem_1 = require("./cache/SecretCacheItem");
const SecretCacheConfiguration_1 = require("./SecretCacheConfiguration");
const aws_sdk_1 = require("aws-sdk");
class SecretCache {
    /**
     * Constructs a new secret cache using the standard AWS Secrets Manager client with default options.
     */
    constructor(client, config) {
        if (null == config) {
            config = new SecretCacheConfiguration_1.SecretCacheConfiguration();
        }
        if (null == client) {
            client = new aws_sdk_1.SecretsManager();
            client = config.getClient() != null ? config.getClient() : new aws_sdk_1.SecretsManager();
        }
        this.cache = new LRUCache(config.getMaxCacheSize());
        this.config = config;
        this.client = client;
    }
    /**
     * Method to retrieve the cached secret item.
     *
     * @param secretId
     *        The identifier for the secret being requested.
     * @return The cached secret item
     */
    getCachedSecret(secretId) {
        console.log('secretId', secretId);
        let secret = this.cache.get(secretId);
        console.log('getCachedSecret:', secret);
        if (undefined === secret) {
            this.cache.set(secretId, new SecretCacheItem_1.SecretCacheItem(secretId, this.client, this.config));
            secret = this.cache.get(secretId);
        }
        //console.log('getCachedSecret:', secret);
        return secret;
    }
    /**
     * Method to retrieve a string secret from AWS Secrets Manager.
     *
     * @param secretId
     *        The identifier for the secret being requested.
     * @return The string secret
     */
    getSecretString(secretId) {
        return __awaiter(this, void 0, void 0, function* () {
            let secret = this.getCachedSecret(secretId);
            console.log('getSecretString [secret]:', secret);
            let gsv = yield secret.getSecretValue();
            if (null == gsv) {
                return null;
            }
            return gsv.SecretString;
        });
    }
    /**
     * Method to retrieve a binary secret from AWS Secrets Manager.
     *
     * @param secretId
     *        The identifier for the secret being requested.
     * @return The binary secret
     */
    getSecretBinary(secretId) {
        return __awaiter(this, void 0, void 0, function* () {
            let secret = this.getCachedSecret(secretId);
            let gsv = yield secret.getSecretValue();
            if (null == gsv) {
                return null;
            }
            return gsv.SecretBinary;
        });
    }
    /**
     * Method to force the refresh of a cached secret state.
     *
     * @param secretId
     *        The identifier for the secret being refreshed.
     * @return True if the refresh completed without error.
     * @throws InterruptedException
     *             If the thread is interrupted while waiting for the refresh.
     */
    refreshNow(secretId) {
        return __awaiter(this, void 0, void 0, function* () {
            let secret = this.getCachedSecret(secretId);
            return yield secret.refreshNow();
        });
    }
    /**
     * Method to close the cache.
     */
    close() {
        this.cache.reset();
    }
}
exports.SecretCache = SecretCache;
//# sourceMappingURL=SecretCache.js.map