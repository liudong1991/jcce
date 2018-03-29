package com.qijianke.jcce.manager;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by Administrator on 2017/04/18.
 */

public class JSONManager {

  private JSONObject json;
  private JSONObject content;

  private final static String STATUS = "status";
  private final static String DATA = "data";

  private JSONManager(int status) throws JSONException {
    json = new JSONObject();
    content = new JSONObject();
    init(json, status, content);
  }

  private void init(JSONObject json, int status, Object content) throws JSONException {
    json.put(STATUS, status);
    json.put(DATA, content);
  }

  public JSONManager setData(JSONObject content) throws JSONException {
    this.content = content;
    json.put(DATA, content);
    return this;
  }

  public JSONManager put(String key, Object value) throws JSONException {
    content.put(key, value);
    return this;
  }

  public JSONObject getJson() {
    return json;
  }

  public static JSONManager create(int status) throws JSONException {
    return new JSONManager(status);
  }

  public static JSONObject createJOB(int status) throws JSONException {
    JSONObject json = new JSONObject();
    json.put(STATUS, status);
    return json;
  }

}
