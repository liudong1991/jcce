package com.qijianke.jcce.cache.base;

/**
 * Created by Administrator on 2016/12/12.
 */

public interface Cache<T> {

    String GL_CACHE = "gl_shared_cache";

    void store(String content);

    T read();

    void update();

}
