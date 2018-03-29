package com.qijianke.jcce.service;

import android.content.Intent;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;

/**
 * Created by Administrator on 2017/04/24.
 */

public interface ActionService {

  void init(CordovaPlugin plugin, CordovaInterface cordova);

  void downloadApk(CallbackContext callbackContext, String downloadUrl);

  void clipScreen(CallbackContext callbackContext, int head);

  void connectBtPrinter(CallbackContext callbackContext);

  void btPrint(CallbackContext callbackContext, String content);

  void onActivityResult(int requestCode, int resultCode, Intent intent);

}
