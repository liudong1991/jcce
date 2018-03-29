package com.qijianke.jcce.entity;

import com.google.gson.Gson;

/**
 * Created by Administrator on 2017/05/16.
 */

public class UpdateEntity {


  /**
   * clientId : gllife.app.android
   * version : 6.1.1
   * lastVersion : 60170
   * forceVersion : 60100
   * downloadUrl : http://wust.ngrok.cc/demo/android-release.apk
   * description : 1.新增变现专区，债权变现更方便；,2.新增私人订制，随心定制，随性理财；,3.资金银行存管，让理财没有顾虑；,4.个人中心全新升级，更好的体验，更多实用优惠；,5.个人中心全新升级，更好的体验，更多实用优惠；
   * upGradeTime : 2017-5-15
   * md5 : ABE9D06137294FBF8F81E5D7128B2BD3
   */

  private String clientId;
  private String version;
  private int lastVersion;
  private int forceVersion;
  private String downloadUrl;
  private String description;
  private String upGradeTime;
  private String md5;

  public static UpdateEntity objectFromData(String str) {

    return new Gson().fromJson(str, UpdateEntity.class);
  }

  public String getClientId() {
    return clientId;
  }

  public void setClientId(String clientId) {
    this.clientId = clientId;
  }

  public String getVersion() {
    return version;
  }

  public void setVersion(String version) {
    this.version = version;
  }

  public int getLastVersion() {
    return lastVersion;
  }

  public void setLastVersion(int lastVersion) {
    this.lastVersion = lastVersion;
  }

  public int getForceVersion() {
    return forceVersion;
  }

  public void setForceVersion(int forceVersion) {
    this.forceVersion = forceVersion;
  }

  public String getDownloadUrl() {
    return downloadUrl;
  }

  public void setDownloadUrl(String downloadUrl) {
    this.downloadUrl = downloadUrl;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getUpGradeTime() {
    return upGradeTime;
  }

  public void setUpGradeTime(String upGradeTime) {
    this.upGradeTime = upGradeTime;
  }

  public String getMd5() {
    return md5;
  }

  public void setMd5(String md5) {
    this.md5 = md5;
  }
}
