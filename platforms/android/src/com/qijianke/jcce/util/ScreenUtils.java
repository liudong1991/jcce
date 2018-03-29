package com.qijianke.jcce.util;

import android.app.Activity;
import android.content.Context;
import android.graphics.Color;
import android.os.Build;
import android.util.DisplayMetrics;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;

import com.qijianke.jcce.common.Constants;


/**
 * Created by Administrator on 2017/04/27.
 */

public class ScreenUtils {

  public static int getScreenWidth(Context context) {
    WindowManager manager = (WindowManager) context.getSystemService(Context.WINDOW_SERVICE);
    DisplayMetrics metrics = new DisplayMetrics();
    manager.getDefaultDisplay().getMetrics(metrics);
    return metrics.widthPixels;
  }

  public static int getScreenHeight(Context context) {
    WindowManager wm = (WindowManager) context.getSystemService(Context.WINDOW_SERVICE);
    DisplayMetrics outMetrics = new DisplayMetrics();
    wm.getDefaultDisplay().getMetrics(outMetrics);
    return outMetrics.heightPixels;
  }

  public static int getStatusBarHeight(Context context) {
    int statusBarHeight = 0;
    try {
      Class<?> clazz = Class.forName("com.android.internal.R$dimen");
      Object object = clazz.newInstance();
      int id = Integer.parseInt(clazz.getField("status_bar_height")
        .get(object).toString());
      statusBarHeight = context.getResources().getDimensionPixelSize(id);
    } catch (Exception e) {
      e.printStackTrace();
    }
    return statusBarHeight;
  }

  public static void statusBarColor(Activity activity) {
    statusBarColor(activity, "#00000000");
  }

  public static void statusBarColor(Activity activity, String color) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
      Window window = activity.getWindow();
      window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS | WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION);
      window.getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN /*| View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION */ | View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
      window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);

      //给状态栏设置颜色。我设置透明。
      window.setStatusBarColor(Color.parseColor(color));
      //window.setNavigationBarColor(Color.TRANSPARENT);
    } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
      Window window = activity.getWindow();
      window.setFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS, WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
    }
  }
  public static void adjustViewHead(Activity activity) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
      View view = activity.getWindow().getDecorView().findViewById(android.R.id.content);
      view.setPadding(view.getPaddingLeft(), view.getPaddingTop() + Constants.STATUS_BAR_HEIGHT, view.getPaddingRight(), view.getPaddingBottom());
    }
  }
}
