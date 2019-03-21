import SecretsManager = require('aws-sdk/clients/secretsmanager');
import { SecretCacheHook } from './SecretCacheHook';

export class SecretCacheConfiguration {

    /** The default cache size. */
    public static DEFAULT_MAX_CACHE_SIZE : number = 1024;

    /** The default TTL for an item stored in cache before access causing a refresh. */
    public static DEFAULT_CACHE_ITEM_TTL : number = 60*60*1000;

    /** The default version stage to use when retrieving secret values. */
    public static DEFAULT_VERSION_STAGE : string = "AWSCURRENT";

    /** The client this cache instance will use for accessing AWS Secrets Manager. */
    private client : SecretsManager = null;

    /** Used to hook in-memory cache updates. */
    private cacheHook : SecretCacheHook = null;

    /**
     * The maximum number of cached secrets to maintain before evicting secrets that
     * have not been accessed recently.
     */
    private maxCacheSize : number = SecretCacheConfiguration.DEFAULT_MAX_CACHE_SIZE;

    /**
     * The number of milliseconds that a cached item is considered valid before
     * requiring a refresh of the secret state.  Items that have exceeded this
     * TTL will be refreshed synchronously when requesting the secret value.  If
     * the synchronous refresh failed, the stale secret will be returned.
     */
    private cacheItemTTL : number = SecretCacheConfiguration.DEFAULT_CACHE_ITEM_TTL;

    /**
     * The version stage that will be used when requesting the secret values for
     * this cache.
     */
    private versionStage : string = SecretCacheConfiguration.DEFAULT_VERSION_STAGE;

    /**
     * Default constructor for the SecretCacheConfiguration object.
     *
     */
    constructor() {
    }

    /**
     * Returns the AWS Secrets Manager client that is used for requesting secret values.
     *
     * @return The AWS Secrets Manager client.
     */
    public getClient() : SecretsManager {
        return this.client;
    }


    /**
     * Sets the AWS Secrets Manager client that should be used by the cache for requesting
     * secrets.
     *
     * @param client
     *            The AWS Secrets Manager client.
     */
    public setClient(client: SecretsManager) : void {
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
    public withClient(client : SecretsManager) : SecretCacheConfiguration  {
        this.setClient(client);
        return this;
    }


    /**
     * Returns the interface used to hook in-memory cache updates.
     *
     * @return The object used to hook in-memory cache updates.
     */
    public getCacheHook() : SecretCacheHook {
        return this.cacheHook;
    }


    /**
     * Sets the interface used to hook the in-memory cache.
     *
     * @param cacheHook
     *            The interface used to hook the in-memory cache.
     */
    public setCacheHook(cacheHook : SecretCacheHook) : void {
        this.cacheHook = cacheHook;
    }


    /**
     * Sets the interface used to hook the in-memory cache.
     *
     * @param cacheHook
     *            The interface used to hook in-memory cache.
     * @return The updated ClientConfiguration object with the new setting.
     */
    public withCacheHook(cacheHook : SecretCacheHook) : SecretCacheConfiguration  {
        this.setCacheHook(cacheHook);
        return this;
    }


    /**
     * Returns the max cache size that should be used for creating the cache.
     *
     * @return The max cache size.
     */
    public getMaxCacheSize() : number {
        return this.maxCacheSize;
    }

    /**
     * Sets the max cache size.
     *
     * @param maxCacheSize
     *            The max cache size.
     */
    public setMaxCacheSize(maxCacheSize: number) : void {
        this.maxCacheSize = maxCacheSize;
    }

    /**
     * Sets the max cache size.
     *
     * @param maxCacheSize
     *            The max cache size.
     * @return The updated ClientConfiguration object with the new max setting.
     */
    public withMaxCacheSize(maxCacheSize: number): SecretCacheConfiguration {
        this.setMaxCacheSize(maxCacheSize);
        return this;
    }

    /**
     * Returns the TTL for the cached items.
     *
     * @return The TTL in milliseconds before refreshing cached items.
     */
    public getCacheItemTTL() : number {
        return this.cacheItemTTL;
    }

    /**
     * Sets the TTL in milliseconds for the cached items.  Once cached items exceed this
     * TTL, the item will be refreshed using the AWS Secrets Manager client.
     *
     * @param cacheItemTTL
     *            The TTL for cached items before requiring a refresh.
     */
    public setCacheItemTTL(cacheItemTTL: number): void {
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
    public withCacheItemTTL(cacheItemTTL: number): SecretCacheConfiguration {
        this.setCacheItemTTL(cacheItemTTL);
        return this;
    }

    /**
     * Returns the version stage that is used for requesting secret values.
     *
     * @return The version stage used in requesting secret values.
     */
    public getVersionStage(): string {
        return this.versionStage;
    }

    /**
     * Sets the version stage that should be used for requesting secret values
     * from AWS Secrets Manager
     *
     * @param versionStage
     *            The version stage used for requesting secret values.
     */
    public setVersionStage(versionStage: string) : void{
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
    public withVersionStage(versionStage: string) : SecretCacheConfiguration {
        this.setVersionStage(versionStage);
        return this;
    }  
}

