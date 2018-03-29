package com.qijianke.jcce.service;

import android.content.Intent;
import android.util.Log;

import com.qijianke.jcce.entity.PrintEntity;
import com.qijianke.jcce.entity.UpdateEntity;
import com.qijianke.jcce.event.ClipEvent;
import com.qijianke.jcce.manager.BtPrinterManager;
import com.qijianke.jcce.manager.UpdateManager;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.greenrobot.eventbus.EventBus;

/**
 * Created by Administrator on 2017/04/24.
 */

public class ActionServiceImpl implements ActionService {

  private CallbackContext callbackContext;
  private CordovaInterface cordova;
  private CordovaPlugin plugin;


  @Override
  public void init(CordovaPlugin plugin, CordovaInterface cordova) {
    this.plugin = plugin;
    this.cordova = cordova;
  }

  @Override
  public void downloadApk(CallbackContext callbackContext, String downloadUrl) {
    UpdateEntity ue = new UpdateEntity();
    //downloadUrl = "https://upgrade-oss.365gl.com/upgrade/sapp/android/glSale_v1.2.4_124_1_geile_sign.apk";
    ue.setDownloadUrl(downloadUrl);
    Log.i(getClass().getName(), "=========>downloadApk");
    UpdateManager.download(cordova.getActivity(), ue);
  }

  @Override
  public void clipScreen(CallbackContext callbackContext, int head) {
    ClipEvent ce = new ClipEvent();
    ce.setHead(head);
    EventBus.getDefault().post(ce);
  }

  @Override
  public void connectBtPrinter(CallbackContext callbackContext) {
    BtPrinterManager.printerSetting(cordova.getActivity());
  }

  @Override
  public void btPrint(CallbackContext callbackContext, String content) {
    cordova.getThreadPool().execute(new Runnable() {
      @Override
      public void run() {

      }
    });
    /*content = "{\n" +
      "\t\"title\": \"七星彩17125【2017-12-01】\",\n" +
      "\t\"date\": \"2017-12-01\",\n" +
      "\t\"total\": \"4132\",\n" +
      "\t\"time\": \"2017-12-01 15:25:36\",\n" +
      "\t\"list\": [{\n" +
      "\t\t\t\"serial\": \"1\",\n" +
      "\t\t\t\"code\": \"98\",\n" +
      "\t\t\t\"money\": \"66\",\n" +
      "\t\t\t\"odds\": \"11\"\n" +
      "\t\t},\n" +
      "\t\t{\n" +
      "\t\t\t\"serial\": \"2\",\n" +
      "\t\t\t\"code\": \"85\",\n" +
      "\t\t\t\"money\": \"16\",\n" +
      "\t\t\t\"odds\": \"98\"\n" +
      "\t\t},\n" +
      "\t\t{\n" +
      "\t\t\t\"serial\": \"3\",\n" +
      "\t\t\t\"code\": \"7\",\n" +
      "\t\t\t\"money\": \"23\",\n" +
      "\t\t\t\"odds\": \"88\"\n" +
      "\t\t},\n" +
      "\t\t{\n" +
      "\t\t\t\"serial\": \"4\",\n" +
      "\t\t\t\"code\": \"40\",\n" +
      "\t\t\t\"money\": \"40\",\n" +
      "\t\t\t\"odds\": \"31\"\n" +
      "\t\t},\n" +
      "\t\t{\n" +
      "\t\t\t\"serial\": \"5\",\n" +
      "\t\t\t\"code\": \"32\",\n" +
      "\t\t\t\"money\": \"34\",\n" +
      "\t\t\t\"odds\": \"64\"\n" +
      "\t\t},\n" +
      "\t\t{\n" +
      "\t\t\t\"serial\": \"6\",\n" +
      "\t\t\t\"code\": \"79\",\n" +
      "\t\t\t\"money\": \"39\",\n" +
      "\t\t\t\"odds\": \"73\"\n" +
      "\t\t},\n" +
      "\t\t{\n" +
      "\t\t\t\"serial\": \"7\",\n" +
      "\t\t\t\"code\": \"30\",\n" +
      "\t\t\t\"money\": \"71\",\n" +
      "\t\t\t\"odds\": \"40\"\n" +
      "\t\t}\n" +
      "\t]\n" +
      "}";*/
    BtPrinterManager.print(new PrintEntity(content));
  }

  @Override
  public void onActivityResult(int requestCode, int resultCode, Intent intent) {

  }
}

