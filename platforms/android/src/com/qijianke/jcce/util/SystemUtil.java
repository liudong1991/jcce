package com.qijianke.jcce.util;

import android.content.Context;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;

/**
 * Created by Administrator on 2017/05/16.
 */

public class SystemUtil {

  public static String getVersionCode(Context context) {
    PackageManager packageManager = context.getPackageManager();
    PackageInfo packageInfo;
    String versionCode = "";
    try {
      packageInfo = packageManager.getPackageInfo(context.getPackageName(), 0);
      versionCode = packageInfo.versionCode + "";
    } catch (PackageManager.NameNotFoundException e) {
      e.printStackTrace();
    }
    return versionCode;
  }

  /**
   * get App versionName
   *
   * @param context
   * @return
   */
  public static String getVersionName(Context context) {
    PackageManager packageManager = context.getPackageManager();
    PackageInfo packageInfo;
    String versionName = "";
    try {
      packageInfo = packageManager.getPackageInfo(context.getPackageName(), 0);
      versionName = packageInfo.versionName;
    } catch (PackageManager.NameNotFoundException e) {
      e.printStackTrace();
    }
    return versionName;
  }

  //判断是否有网络连接
  public static boolean isNetworkConnected(Context context) {
    if (context != null) {
      ConnectivityManager mConnectivityManager = (ConnectivityManager) context
        .getSystemService(Context.CONNECTIVITY_SERVICE);
      NetworkInfo mNetworkInfo = mConnectivityManager.getActiveNetworkInfo();
      if (mNetworkInfo != null) {
        return mNetworkInfo.isAvailable();
      }
    }
    return false;
  }

  //判断MOBILE网络是否可用
  public static boolean isWifiConnected(Context context) {
    if (context != null) {
      ConnectivityManager mConnectivityManager = (ConnectivityManager) context
        .getSystemService(Context.CONNECTIVITY_SERVICE);
      NetworkInfo mWiFiNetworkInfo = mConnectivityManager
        .getNetworkInfo(ConnectivityManager.TYPE_WIFI);
      if (mWiFiNetworkInfo != null) {
        return mWiFiNetworkInfo.isAvailable();
      }
    }
    return false;
  }

  //判断WIFI网络是否可用
  public static boolean isMobileConnected(Context context) {
    if (context != null) {
      ConnectivityManager mConnectivityManager = (ConnectivityManager) context
        .getSystemService(Context.CONNECTIVITY_SERVICE);
      NetworkInfo mMobileNetworkInfo = mConnectivityManager
        .getNetworkInfo(ConnectivityManager.TYPE_MOBILE);
      if (mMobileNetworkInfo != null) {
        return mMobileNetworkInfo.isAvailable();
      }
    }
    return false;
  }

  //返回值 -1：没有网络  1：WIFI网络2：wap网络3：net网络
  public static int GetNetype(Context context) {
    int netType = -1;
    ConnectivityManager connMgr = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
    NetworkInfo networkInfo = connMgr.getActiveNetworkInfo();
    if (networkInfo == null) {
      return netType;
    }
    int nType = networkInfo.getType();
    if (nType == ConnectivityManager.TYPE_MOBILE) {
      if (networkInfo.getExtraInfo().toLowerCase().equals("cmnet")) {
        netType = 3;
      } else {
        netType = 2;
      }
    } else if (nType == ConnectivityManager.TYPE_WIFI) {
      netType = 1;
    }
    return netType;
  }


}
