package com.glsh.CommonPL;


import android.content.Intent;
import android.util.Log;


import com.qijianke.jcce.manager.CordovaPluginManager;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;

import java.lang.reflect.Method;

/**
 * This class echoes a string called from JavaScript.
 */
public class CommonPL extends CordovaPlugin {

  private CordovaPluginManager manager;

  @Override
  protected void pluginInitialize() {
    if (manager == null) {
      manager = CordovaPluginManager.getInstance(cordova, this);
    }
  }

  @Override
  public boolean execute(String action, JSONArray args, CallbackContext callbackContext) {

    Class<CordovaPluginManager> clazz = CordovaPluginManager.class;
    try {
      Method m = clazz.getDeclaredMethod(action, JSONArray.class, CallbackContext.class);
      m.setAccessible(true);

      m.invoke(manager, args, callbackContext);
      return true;
    } catch (NoSuchMethodException e) {
      return false;
    } catch (Exception e) {
      e.printStackTrace();
      return true;
    }
  }

  @Override
  public void onActivityResult(int requestCode, int resultCode, Intent intent) {
    manager.onActivityResult(requestCode, resultCode, intent);
  }

  @Override
  public Object onMessage(String id, Object data) {
    return super.onMessage(id, data);
  }
}
