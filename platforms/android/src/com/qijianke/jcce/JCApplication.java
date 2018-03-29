package com.qijianke.jcce;

import android.app.Application;

import com.qijianke.jcce.common.Constants;
import com.qijianke.jcce.util.ScreenUtils;

/**
 * Created by Administrator on 2017/04/13.
 */

public class JCApplication extends Application {

  private static JCApplication instance;

  @Override
  public void onCreate() {
    super.onCreate();
    instance = this;

    init();
  }

  private void init() {

    Constants.SCREEN_WIDTH = ScreenUtils.getScreenWidth(this);
    Constants.SCREEN_HEIGHT = ScreenUtils.getScreenHeight(this);
    Constants.STATUS_BAR_HEIGHT = ScreenUtils.getStatusBarHeight(this);
  }

  public static JCApplication getInstance() {
    return instance;
  }
}
