import SecretsManager = require('aws-sdk/clients/secretsmanager');
import { SecretCacheConfiguration } from '../SecretCacheConfiguration';
import { DescribeSecretResponse } from 'aws-sdk/clients/secretsmanager';

export abstract class SecretCacheObject<T> {

      /** The number of milliseconds to wait after an exception. */
  private static EXCEPTION_BACKOFF : number = 1000;

      /** The growth factor of the backoff duration. */
  private static EXCEPTION_BACKOFF_GROWTH_FACTOR : number = 2;

    /**
     * The maximum number of milliseconds to wait before retrying a failed
     * request.
     */
  private static BACKOFF_PLATEAU : number = 128 * SecretCacheObject.EXCEPTION_BACKOFF;  

    /**
     * When forcing a refresh using the refreshNow method, a random sleep
     * will be performed using this value.  This helps prevent code from
     * executing a refreshNow in a continuous loop without waiting.
     */
  private static FORCE_REFRESH_JITTER_SLEEP : number = 5000;  

      /** The secret identifier for this cached object. */
  protected secretId : string;

    /** The AWS Secrets Manager client to use for requesting secrets. */
  protected client : SecretsManager;

    /** The Secret Cache Configuration. */
  protected config : SecretCacheConfiguration;

    /** The result of the last AWS Secrets Manager request for this item. */
  private data : Object = null;

    /** A flag to indicate a refresh is needed. */
  private refreshNeeded : boolean = true;

    /**
     * If the last request to AWS Secrets Manager resulted in an exception,
     * that exception will be thrown back to the caller when requesting
     * secret data.
     */
  protected exception : any = null;

    /**
     * The number of exceptions encountered since the last successfully
     * AWS Secrets Manager request.  This is used to calculate an exponential
     * backoff.
     */
  private exceptionCount : number = 0;

    /**
     * The time to wait before retrying a failed AWS Secrets Manager request.
     */
  private nextRetryTime : number = 0;  

    /**
     * Construct a new cached item for the secret.
     *
     * @param secretId
     *            The secret identifier.  This identifier could be the full ARN
     *            or the friendly name for the secret.
     * @param client
     *            The AWS Secrets Manager client to use for requesting the secret.
     * @param config
     *            The secret cache configuration.
     */
  constructor(secretId: string,
      client : SecretsManager,
      config: SecretCacheConfiguration) {

    this.secretId = secretId;
    this.client = client;
    this.config = config;
  }
  
    /**
     * Execute the actual refresh of the cached secret state.
     *
     * @return The result of the refresh
     */  
  protected abstract async executeRefresh(): Promise<T>;  

    /**
     * Execute the actual refresh of the cached secret state.
     *
     * @param result
     *            The AWS Secrets Manager result for the secret state.
     * @return The cached GetSecretValue result based on the current
     *         cached state.
     */
  protected abstract async getSecretValueInternal(result: T) : Promise<DescribeSecretResponse>;

    /**
     * Return the typed result object
     *
     * @return the result object
     */  
  private getResult() : T {
    if (null != this.config.getCacheHook()) {
        return this.config.getCacheHook().get(this.data) as T;
    }
    return this.data as T;  
  }

    /**
     * Store the result data.
     */
  private setResult(result: T) : void {
      console.log('result: ', result);

      if (null != this.config.getCacheHook()) {
          this.data = this.config.getCacheHook().put(result);
      } else {
          this.data = result;
      }
  }

    /**
     * Determine if the secret object should be refreshed.
     *
     * @return True if the secret item should be refreshed.
     */
  protected isRefreshNeeded() : boolean {
      if (this.refreshNeeded) { return true; }
      if (null != this.exception) {
          // If we encountered an exception on the last attempt
          // we do not want to keep retrying without a pause between
          // the refresh attempts.
          //
          // If we have exceeded our backoff time we will refresh
          // the secret now.
          if ((+new Date()) >= this.nextRetryTime) {
              return true;
          }
          // Don't keep trying to refresh a secret that previously threw
          // an exception.
          return false;
      }
      return false;
  }

  /**
   * Refresh the cached secret state only when needed.
   */
  private async refresh(): Promise<void> {
      if (!this.isRefreshNeeded()) { return; }

      console.log('we are refreshing');
      this.refreshNeeded = false;
      try {
          this.setResult(await this.executeRefresh());
          this.exception = null;
          this.exceptionCount = 0;
      } catch (ex) {
          this.exception = ex;
          // Determine the amount of growth in exception backoff time based on the growth
          // factor and default backoff duration.
          let growth : number = 1;
          if (this.exceptionCount > 0) {
              growth = Math.pow(SecretCacheObject.EXCEPTION_BACKOFF_GROWTH_FACTOR, this.exceptionCount);
          }
          this.exceptionCount += 1;
          growth *= SecretCacheObject.EXCEPTION_BACKOFF;
          // Add in EXCEPTION_BACKOFF time to make sure the random jitter will not reduce
          // the wait time too low.
          let retryWait = Math.min(SecretCacheObject.EXCEPTION_BACKOFF + growth, SecretCacheObject.BACKOFF_PLATEAU);

          let min = retryWait / 2;
          let max = retryWait + 1;

          // Use random jitter with the wait time
          retryWait = Math.floor(Math.random() * (max - min)) + min;
          this.nextRetryTime = (+new Date()) + retryWait;
      }
  }
  
    /**
     * Method to force the refresh of a cached secret state.
     *
     * @return True if the refresh completed without error.
     * @throws InterruptedException
     *             If the thread is interrupted while waiting for the refresh.
     */
  public async refreshNow() : Promise<boolean> {
      this.refreshNeeded = true;
      // When forcing a refresh, always sleep with a random jitter
      // to prevent coding errors that could be calling refreshNow
      // in a loop.

      let max =  SecretCacheObject.FORCE_REFRESH_JITTER_SLEEP + 1;
      let min = SecretCacheObject.FORCE_REFRESH_JITTER_SLEEP / 2;

      let sleep = Math.floor(Math.random() * (max - min)) + min;

      // Make sure we are not waiting for the next refresh after an
      // exception.  If we are, sleep based on the retry delay of
      // the refresh to prevent a hard loop in attempting to refresh a
      // secret that continues to throw an exception such as AccessDenied.
      if (null != this.exception) {
          let wait = this.nextRetryTime - (+new Date());
          sleep = Math.max(wait, sleep);
      }


      setTimeout(async () => {
        await this.refresh();
      }, sleep);

      return (null == this.exception);
  }

  /**
   * Return the cached result from AWS Secrets Manager for GetSecretValue.
   *
   * @return The cached GetSecretValue result.
   */
  public async getSecretValue() : Promise<SecretsManager.GetSecretValueResponse> {
          await this.refresh();
          if (null == this.data) {
              if (null != this.exception) { throw this.exception; }
          }
          
          let gsv = await this.getSecretValueInternal(this.getResult());

          // If there is no cached result, return null.
          if (null == gsv) { return null; }
          return gsv;
  }  
}