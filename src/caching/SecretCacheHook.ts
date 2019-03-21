export interface SecretCacheHook {
    /**
     * Prepare the object for storing in the cache
     *
     * @param o The object being stored in the cache
     * @return The object that should be stored in the cached
     */
    put(o: Object) : Object;

    /**
     * Derive the object from the cached object.
     *
     * @param cachedObject The object stored in the cache
     * @return The object that should be returned from the cache
     */
    get(cachedObject: Object): Object;  
}
