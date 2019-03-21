import { AWSError } from "aws-sdk";
import SecretsManager = require('aws-sdk/clients/secretsmanager');
import { DescribeSecretResponse } from "aws-sdk/clients/secretsmanager";
import { SecretCacheObject } from "./SecretCacheObject";
import { SecretCacheConfiguration } from "../SecretCacheConfiguration";
import { SecretCacheVersion } from "./SecretCacheVersion";
import * as LRUCache from 'lru-cache';
import * as underscore from 'underscore';
import { timingSafeEqual } from "crypto";

export class SecretCacheItem extends SecretCacheObject<DescribeSecretResponse> {

  /**
   * The next scheduled refresh time for this item.  Once the item is accessed
   * after this time, the item will be synchronously refreshed.
   */
  private nextRefreshTime: Number = 0;

  /** The cached secret value versions for this cached secret. */
  private versions : LRUCache<string, SecretCacheVersion> = new LRUCache<string, SecretCacheVersion>(10);

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
  constructor(secretId : string,
                client: SecretsManager,
                config: SecretCacheConfiguration) {
      super(secretId, client, config);
  }

  protected isRefreshNeeded():boolean {
    if (super.isRefreshNeeded()) { return true; }
    if (null != this.exception) { return false; }
    if ((+new Date()) >= this.nextRefreshTime) {
        return true;
    }
    return false;
  }

  protected async executeRefresh(): Promise<DescribeSecretResponse> {

    let params = {
      SecretId: this.secretId
     };

    let result = new Promise<DescribeSecretResponse>((resolve, reject) => {


      this.client.describeSecret(params, (err: AWSError, data: DescribeSecretResponse) => {
        console.log(err);
        
        if(err) reject(err);

        let ttl = this.config.getCacheItemTTL();
        let min = ttl / 2;
        let max = ttl + 1;
        this.nextRefreshTime = (+new Date()) + Math.floor(Math.random() * (max - min)) + min;

        resolve(data);
      });

  
    });

    return result;
  }  
  
  protected async getSecretValueInternal(result: DescribeSecretResponse): Promise<DescribeSecretResponse> {
    let version = await this.getVersion(result);
    if (null == version) { return null; }
    return version.getSecretValue();
  }

    /**
     * Return the secret version based on the current state of the secret.
     *
     * @param describeResult
     *            The result of the Describe Secret request to AWS Secrets Manager.
     * @return The cached secret version.
     */
  private getVersion(describeResult: DescribeSecretResponse): SecretCacheVersion {

    if(null == describeResult) return null;

    let versionIdStages = describeResult.VersionIdsToStages;
    if(null == versionIdStages) return null;

    let versionStage = this.config.getVersionStage();

    // find the version id of the current stage
    let currentVersionId = underscore.findKey(versionIdStages, (value, key) => {
      return value.includes('AWSCURRENT');
    });

    if(currentVersionId !== undefined) {
      let version = this.versions.get(currentVersionId);
      if(null == version) {
        this.versions.set(currentVersionId, new SecretCacheVersion(this.secretId, currentVersionId, this.client, this.config));
        version = this.versions.get(currentVersionId);
      }

      return version;
    }

    return null;
  }    
}