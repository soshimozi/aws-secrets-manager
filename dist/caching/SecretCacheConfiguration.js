"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SecretCacheConfiguration {
    /**
     * Default constructor for the SecretCacheConfiguration object.
     *
     */
    constructor() {
        /** The client this cache instance will use for accessing AWS Secrets Manager. */
        this.client = null;
        /** Used to hook in-memory cache updates. */
        this.cacheHook = null;
        /**
         * The maximum number of cached secrets to maintain before evicting secrets that
         * have not been accessed recently.
         */
        this.maxCacheSize = SecretCacheConfiguration.DEFAULT_MAX_CACHE_SIZE;
        /**
         * The number of milliseconds that a cached item is considered valid before
         * requiring a refresh of the secret state.  Items that have exceeded this
         * TTL will be refreshed synchronously when requesting the secret value.  If
         * the synchronous refresh failed, the stale secret will be returned.
         */
        this.cacheItemTTL = SecretCacheConfiguration.DEFAULT_CACHE_ITEM_TTL;
        /**
         * The version stage that will be used when requesting the secret values for
         * this cache.
         */
        this.versionStage = SecretCacheConfiguration.DEFAULT_VERSION_STAGE;
    }
    /**
     * Returns the AWS Secrets Manager client that is used for requesting secret values.
     *
     * @return The AWS Secrets Manager client.
     */
    getClient() {
        return this.client;
    }
    /**
     * Sets the AWS Secrets Manager client that should be used by the cache for requesting
     * secrets.
     *
     * @param client
     *            The AWS Secrets Manager client.
     */
    setClient(client) {
        this.client = client;
    }
    /**
     * Sets the AWS Secrets Manager client that should be used by the cache for requesting
     * secrets.
     *
     * @param client
     *            The AWS Secrets Manager client.
     * @return The updated ClientConfiguration object with the new client setting.
     */
    withClient(client) {
        this.setClient(client);
        return this;
    }
    /**
     * Returns the interface used to hook in-memory cache updates.
     *
     * @return The object used to hook in-memory cache updates.
     */
    getCacheHook() {
        return this.cacheHook;
    }
    /**
     * Sets the interface used to hook the in-memory cache.
     *
     * @param cacheHook
     *            The interface used to hook the in-memory cache.
     */
    setCacheHook(cacheHook) {
        this.cacheHook = cacheHook;
    }
    /**
     * Sets the interface used to hook the in-memory cache.
     *
     * @param cacheHook
     *            The interface used to hook in-memory cache.
     * @return The updated ClientConfiguration object with the new setting.
     */
    withCacheHook(cacheHook) {
        this.setCacheHook(cacheHook);
        return this;
    }
    /**
     * Returns the max cache size that should be used for creating the cache.
     *
     * @return The max cache size.
     */
    getMaxCacheSize() {
        return this.maxCacheSize;
    }
    /**
     * Sets the max cache size.
     *
     * @param maxCacheSize
     *            The max cache size.
     */
    setMaxCacheSize(maxCacheSize) {
        this.maxCacheSize = maxCacheSize;
    }
    /**
     * Sets the max cache size.
     *
     * @param maxCacheSize
     *            The max cache size.
     * @return The updated ClientConfiguration object with the new max setting.
     */
    withMaxCacheSize(maxCacheSize) {
        this.setMaxCacheSize(maxCacheSize);
        return this;
    }
    /**
     * Returns the TTL for the cached items.
     *
     * @return The TTL in milliseconds before refreshing cached items.
     */
    getCacheItemTTL() {
        return this.cacheItemTTL;
    }
    /**
     * Sets the TTL in milliseconds for the cached items.  Once cached items exceed this
     * TTL, the item will be refreshed using the AWS Secrets Manager client.
     *
     * @param cacheItemTTL
     *            The TTL for cached items before requiring a refresh.
     */
    setCacheItemTTL(cacheItemTTL) {
        this.cacheItemTTL = cacheItemTTL;
    }
    /**
     * Sets the TTL in milliseconds for the cached items.  Once cached items exceed this
     * TTL, the item will be refreshed using the AWS Secrets Manager client.
     *
     * @param cacheItemTTL
     *            The TTL for cached items before requiring a refresh.
     * @return The updated ClientConfiguration object with the new TTL setting.
     */
    withCacheItemTTL(cacheItemTTL) {
        this.setCacheItemTTL(cacheItemTTL);
        return this;
    }
    /**
     * Returns the version stage that is used for requesting secret values.
     *
     * @return The version stage used in requesting secret values.
     */
    getVersionStage() {
        return this.versionStage;
    }
    /**
     * Sets the version stage that should be used for requesting secret values
     * from AWS Secrets Manager
     *
     * @param versionStage
     *            The version stage used for requesting secret values.
     */
    setVersionStage(versionStage) {
        this.versionStage = versionStage;
    }
    /**
     * Sets the version stage that should be used for requesting secret values
     * from AWS Secrets Manager
     *
     * @param versionStage
     *            The version stage used for requesting secret values.
     * @return The updated ClientConfiguration object with the new version stage setting.
     */
    withVersionStage(versionStage) {
        this.setVersionStage(versionStage);
        return this;
    }
}
/** The default cache size. */
SecretCacheConfiguration.DEFAULT_MAX_CACHE_SIZE = 1024;
/** The default TTL for an item stored in cache before access causing a refresh. */
SecretCacheConfiguration.DEFAULT_CACHE_ITEM_TTL = 60 * 60 * 1000;
/** The default version stage to use when retrieving secret values. */
SecretCacheConfiguration.DEFAULT_VERSION_STAGE = "AWSCURRENT";
exports.SecretCacheConfiguration = SecretCacheConfiguration;
//# sourceMappingURL=SecretCacheConfiguration.js.map