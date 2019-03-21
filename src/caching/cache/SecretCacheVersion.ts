import { SecretsManager } from "aws-sdk";
import { SecretCacheConfiguration } from "../SecretCacheConfiguration";
import { GetSecretValueResponse } from "aws-sdk/clients/secretsmanager";
import { SecretCacheObject } from "./SecretCacheObject";


export class SecretCacheVersion extends SecretCacheObject<GetSecretValueResponse> {

  /** The version identifier to use when requesting the secret value. */
  private versionId: string;
  private hash: number;

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
  constructor(secretId: string,
                versionId: string,
                client: SecretsManager,
                config: SecretCacheConfiguration) {
      super(secretId, client, config);
      this.versionId = versionId;
      this.hash = this.calcHash(`${secretId} ${versionId}`);
  }

  private calcHash(str: string): number {
    var hash = 0, i, chr;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
      chr   = str.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }

  public hashCode(): number {
      return this.hash;
  }

  /**
   * Execute the logic to perform the actual refresh of the item.
   *
   * @return The result from AWS Secrets Manager for the refresh.
   */
  protected async executeRefresh(): Promise<GetSecretValueResponse> {
    

    return new Promise<GetSecretValueResponse>((resolve, reject) => {
      
      let parms = {
        SecretId: this.secretId,
        VersionId: this.versionId
      };

      this.client.getSecretValue(parms, (err, data) => {
        if(err) reject(err);
        resolve(data);
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
  protected async getSecretValueInternal(gsvResult: GetSecretValueResponse) : Promise<GetSecretValueResponse> {
    return gsvResult;
  }

}