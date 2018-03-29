package com.qijianke.jcce.manager;

import android.content.Intent;

import com.qijianke.jcce.service.ActionService;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

/**
 * Created by Administrator on 2017/05/17.
 */

public class CordovaPluginManager {

  private static CordovaPluginManager manager;

  private ActionService service;

  private CordovaPluginManager() {
  }

  public static CordovaPluginManager getInstance(CordovaInterface cordova, CordovaPlugin plugin) {
    if (manager == null) {
      synchronized (CordovaPluginManager.class) {
        if (manager == null) {
          manager = new CordovaPluginManager();
          manager.init(cordova, plugin);
        }
      }
    }
    return manager;
  }

  private void init(CordovaInterface cordova, CordovaPlugin plugin) {
    if (service == null) {
      service = ServiceManager.getService(ActionService.class);
      service.init(plugin, cordova);
    }
  }

  private void downloadApk(JSONArray args, CallbackContext callbackContext) throws JSONException {
    service.downloadApk(callbackContext, args.getString(0));
  }

  private void clipScreen(JSONArray args, CallbackContext callbackContext) throws JSONException {
    service.clipScreen(callbackContext, args.getInt(0));
  }

  private void connectBtPrinter(JSONArray args, CallbackContext callbackContext) throws JSONException {
    service.connectBtPrinter(callbackContext);
  }

  private void btPrint(JSONArray args, CallbackContext callbackContext) throws JSONException {
    service.btPrint(callbackContext, args.getString(0));
  }

  public void onActivityResult(int requestCode, int resultCode, Intent intent) {
    service.onActivityResult(requestCode, resultCode, intent);
  }

}
