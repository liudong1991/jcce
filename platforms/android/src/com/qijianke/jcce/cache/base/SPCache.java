package com.qijianke.jcce.cache.base;

import android.content.Context;
import android.content.SharedPreferences;
import android.text.TextUtils;

import com.qijianke.jcce.JCApplication;

/**
 * Created by Administrator on 2016/12/13.
 */

public abstract class SPCache<T> extends BaseCache<T> {

    private static SharedPreferences mSharedPreferences;

    private static SharedPreferences getPreference() {
        if (mSharedPreferences == null) {
            mSharedPreferences = JCApplication.getInstance().getSharedPreferences(GL_CACHE, Context.MODE_PRIVATE);
        }
        return mSharedPreferences;
    }

    @Override
    public void store(String content) {
        SharedPreferences preferences = getPreference();
        preferences.edit().putString(getKey(), content).commit();
    }

    @Override
    public T read() {
        SharedPreferences preferences = getPreference();
        String content = preferences.getString(getKey(), "");
        if (!TextUtils.isEmpty(content)) {
            return parse(content);
        }
        return null;
    }

    protected abstract String getKey();

    public abstract T parse(String content);
}
