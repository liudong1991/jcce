package com.qijianke.jcce.cache.base;

/**
 * Created by Administrator on 2016/12/22.
 */

public class HandleCache {

    public static <T>T readCache(Cache<T> cache) {
        return cache.read();
    }

    public static void storeCache(Cache cache, String content) {
        cache.store(content);
    }

    public static <T>T parse(SPCache<T> cache, String content) {
        return cache.parse(content);
    }
}
