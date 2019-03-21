import * as LRUCache from 'lru-cache';
import { SecretCacheItem } from './cache/SecretCacheItem';
import { SecretCacheConfiguration } from './SecretCacheConfiguration';
import { SecretsManager } from 'aws-sdk';

interface Blob {}

export class SecretCache {
  /** The cached secret items. */
  private cache : LRUCache<string, SecretCacheItem>; // <string, SecretCacheItem> ;

  /** The cache configuration. */
  private config: SecretCacheConfiguration;

  /** The AWS Secrets Manager client to use when requesting secrets. */
  private client: SecretsManager;

  /**
   * Constructs a new secret cache using the standard AWS Secrets Manager client with default options.
   */
  constructor(client?: SecretsManager, config?: SecretCacheConfiguration) {

    if (null == config) { config = new SecretCacheConfiguration(); }

    if(null == client) { 
      client = new SecretsManager(); 
      client = config.getClient() != null ? config.getClient() : new SecretsManager();
    }
    
    this.cache = new LRUCache<string, SecretCacheItem>(config.getMaxCacheSize());
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
  private getCachedSecret(secretId: string) : SecretCacheItem  {
      console.log('secretId', secretId);

      let secret : SecretCacheItem = this.cache.get(secretId);

      console.log('getCachedSecret:', secret);
      if (undefined === secret) {
          this.cache.set(secretId,
                  new SecretCacheItem(secretId, this.client, this.config));
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
  public async getSecretString(secretId: string): Promise<string> {
      let secret : SecretCacheItem = this.getCachedSecret(secretId);

      console.log('getSecretString [secret]:', secret);
      let gsv = await secret.getSecretValue();
      if (null == gsv) { return null; }
      
      return gsv.SecretString;
  }

  /**
   * Method to retrieve a binary secret from AWS Secrets Manager.
   *
   * @param secretId
   *        The identifier for the secret being requested.
   * @return The binary secret
   */
  public async getSecretBinary(secretId: string): Promise<Buffer|Uint8Array|Blob|string> {
      let secret = this.getCachedSecret(secretId);
      let gsv = await secret.getSecretValue();
      if (null == gsv) { return null; }
      return gsv.SecretBinary;
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
  public async refreshNow(secretId: string): Promise<boolean> {
      let secret = this.getCachedSecret(secretId);
      return await secret.refreshNow();
  }

  /**
   * Method to close the cache.
   */
  public close() : void {
      this.cache.reset();
  }  

}