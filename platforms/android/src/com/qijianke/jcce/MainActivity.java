/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package com.qijianke.jcce;

import android.annotation.TargetApi;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.Rect;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.util.Log;
import android.view.View;
import android.view.ViewTreeObserver;
import android.view.animation.AlphaAnimation;
import android.view.animation.Animation;
import android.webkit.WebView;
import android.widget.ImageView;
import android.widget.Toast;

import com.qijianke.jcce.common.Constants;
import com.qijianke.jcce.event.ClipEvent;
import com.qijianke.jcce.event.ExitEvent;
import com.qijianke.jcce.event.WebLoadOverEvent;
import com.qijianke.jcce.manager.BtPrinterManager;
import com.qijianke.jcce.util.ImgUtils;
import com.qijianke.jcce.util.ScreenUtils;

import org.apache.cordova.CordovaActivity;
import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;


public class MainActivity extends CordovaActivity {

  public static MainActivity instance;

  private ImageView launcher;

  private Handler handler = new Handler();

  private static boolean isFirst = true;

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    instance = this;
    ScreenUtils.statusBarColor(this);


    // enable Cordova apps to be started in the background
    Bundle extras = getIntent().getExtras();
    if (extras != null && extras.getBoolean("cdvStartInBackground", false)) {
      moveTaskToBack(true);
    }

    EventBus.getDefault().register(this);

    jcce();

    // Set by <content src="index3.html" /> in config.xml
    loadUrl(launchUrl);
    screenSizeChanged();
  }

  private void screenSizeChanged() {
    ((View) launcher.getParent()).getViewTreeObserver().addOnGlobalLayoutListener(new ViewTreeObserver.OnGlobalLayoutListener() {
      @Override
      public void onGlobalLayout() {
        Log.i(getClass().getName(), "====>Screen Size Changed");
        Log.i(getClass().getName(), "Screen Height:" + ScreenUtils.getScreenHeight(MainActivity.this));
        Constants.SCREEN_HEIGHT = ScreenUtils.getScreenHeight(MainActivity.this);
        if (isFirst) {
          handlerLauncher(launcher);
        } else {
          ((View) launcher.getParent()).setVisibility(View.GONE);
        }
      }
    });
  }

  @TargetApi(Build.VERSION_CODES.LOLLIPOP)
  public void jcce() {
    WebView.enableSlowWholeDocumentDraw();
  }

  @Override
  protected void onRestart() {
    super.onRestart();
    if (launcher != null && !isFirst)
      ((View) launcher.getParent()).setVisibility(View.GONE);
  }

  @Override
  protected void onResume() {
    super.onResume();
  }

  @Override
  protected void onPause() {
    super.onPause();
  }

  @Override
  protected void handlerLauncher(ImageView iv) {
    this.launcher = iv;
    Bitmap bitmap = BitmapFactory.decodeResource(getResources(), R.drawable.launcher);
    int w = bitmap.getWidth();
    int h = bitmap.getHeight();
    if (w * 1.0f / h < Constants.SCREEN_WIDTH * 1.0f / Constants.SCREEN_HEIGHT) {
      int v = (int) (Constants.SCREEN_HEIGHT * 1.0f / Constants.SCREEN_WIDTH * w);
      Bitmap des = Bitmap.createBitmap(bitmap, 0, h - v, w, v);
      iv.setImageBitmap(des);
    } else {
      iv.setScaleType(ImageView.ScaleType.CENTER_CROP);
      iv.setImageBitmap(bitmap);
    }
  }

  private void showMainContent(long time) {

    handler.postDelayed(new Runnable() {
      @Override
      public void run() {
        AlphaAnimation alphaAnimation = new AlphaAnimation(1, 0);
        alphaAnimation.setDuration(1200);
        alphaAnimation.setFillAfter(true);
        final View parent = (View) launcher.getParent();
        alphaAnimation.setAnimationListener(new Animation.AnimationListener() {
          @Override
          public void onAnimationStart(Animation animation) {

          }

          @Override
          public void onAnimationEnd(Animation animation) {
            parent.setVisibility(View.GONE);
            isFirst = false;
          }

          @Override
          public void onAnimationRepeat(Animation animation) {

          }
        });
        parent.startAnimation(alphaAnimation);
      }
    }, time);
  }

  @Subscribe(threadMode = ThreadMode.MAIN)
  public void onMessageEvent(ExitEvent event) {
    finish();
  }

  @Subscribe(threadMode = ThreadMode.MAIN)
  public void onMessageEvent(WebLoadOverEvent event) {
    showMainContent(1000);
  }

  @Subscribe(threadMode = ThreadMode.MAIN)
  public void onMessageEvent(ClipEvent event) {
    clipLongImg(event.getHead());
  }

  @Override
  protected void onNewIntent(Intent intent) {
    super.onNewIntent(intent);
  }

  @Override
  public void onDestroy() {
    super.onDestroy();
    instance = null;
  }

  @Override
  public Object onMessage(String id, Object data) {
    super.onMessage(id, data);
    if ("onPageFinished".equals(id)) {
      WebLoadOverEvent event = new WebLoadOverEvent();
      EventBus.getDefault().post(event);
    }
    return null;
  }

  @Override
  public void onClick(View v) {
    String tag = (String) v.getTag();
    if ("test1".equals(tag)) {
      BtPrinterManager.printerSetting(this);
    } else if ("test2".equals(tag)) {
      clipLongImg(0);
      //testWebview();
    }

  }

  public void clipLongImg(final int head) {
    WebView mWebView = (WebView) appView.getView();
    mWebView.measure(View.MeasureSpec.makeMeasureSpec(View.MeasureSpec.UNSPECIFIED, View.MeasureSpec.UNSPECIFIED), View.MeasureSpec.makeMeasureSpec(0, View.MeasureSpec.UNSPECIFIED));
    mWebView.layout(0, 0, mWebView.getMeasuredWidth(), mWebView.getMeasuredHeight());
    mWebView.setDrawingCacheEnabled(true);
    mWebView.buildDrawingCache();
    final Bitmap longImg = Bitmap.createBitmap(mWebView.getMeasuredWidth(), mWebView.getMeasuredHeight(), Bitmap.Config.ARGB_8888);
    Canvas canvas = new Canvas(longImg);
    Paint paint = new Paint();
    canvas.drawBitmap(longImg, 0, mWebView.getMeasuredHeight(), paint);
    mWebView.draw(canvas);

    Log.i(getClass().getName(), "wust======>" + longImg + " head==>" + head);
    new Thread(new Runnable() {
      @Override
      public void run() {
        File file = new File(Environment.getExternalStorageDirectory(), "temp.jpg");
        try {
          longImg.compress(Bitmap.CompressFormat.JPEG, 20, new FileOutputStream(file));
          Rect rect = new Rect(0, head, longImg.getWidth(), longImg.getHeight() - head);
          longImg.recycle();
          FileInputStream fis = new FileInputStream(file);
          BitmapFactory.Options opt = new BitmapFactory.Options();
          opt.inPreferredConfig = Bitmap.Config.RGB_565;
          Bitmap dest = BitmapFactory.decodeStream(fis, rect, opt);
          if (file.exists()) file.delete();
          final boolean isSuccess = ImgUtils.saveImageToGallery(MainActivity.this, dest);
          runOnUiThread(new Runnable() {
            @Override
            public void run() {
              Toast.makeText(MainActivity.this, isSuccess ? "保存成功" : "保存失败", Toast.LENGTH_SHORT).show();
            }
          });

        } catch (Exception e) {
          e.printStackTrace();
          if (file.exists()) file.delete();
          runOnUiThread(new Runnable() {
            @Override
            public void run() {
              Toast.makeText(MainActivity.this, "保存失败", Toast.LENGTH_SHORT).show();
            }
          });
        }
      }
    }).start();
  }
}
