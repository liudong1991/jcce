package com.qijianke.jcce.entity;

import com.google.gson.Gson;

import java.util.List;

/**
 * Created by Administrator on 2017/12/28.
 */

public class PrintEntity {

  private String content;

  private String title;
  private String date;
  private String total;
  private String time;

  private List<PrizeCode> list;

  public PrintEntity() {
    super();
  }

  public PrintEntity(String content) {
    this.content = content;
    PrintEntity pe = new Gson().fromJson(content, PrintEntity.class);
    title = pe.getTitle();
    date = pe.getDate();
    total = pe.getTotal();
    time = pe.getTime();
    list = pe.getList();
  }

  public String getContent() {
    return content;
  }

  public void setContent(String content) {
    this.content = content;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getDate() {
    return date;
  }

  public void setDate(String date) {
    this.date = date;
  }

  public String getTotal() {
    return total;
  }

  public void setTotal(String total) {
    this.total = total;
  }

  public String getTime() {
    return time;
  }

  public void setTime(String time) {
    this.time = time;
  }

  public List<PrizeCode> getList() {
    return list;
  }

  public void setList(List<PrizeCode> list) {
    this.list = list;
  }

  public static class PrizeCode {
    private String serial;
    private String code;
    private String money;
    private String odds;

    public String getSerial() {
      return serial;
    }

    public void setSerial(String serial) {
      this.serial = serial;
    }

    public String getCode() {
      return code;
    }

    public void setCode(String code) {
      this.code = code;
    }

    public String getMoney() {
      return money;
    }

    public void setMoney(String money) {
      this.money = money;
    }

    public String getOdds() {
      return odds;
    }

    public void setOdds(String odds) {
      this.odds = odds;
    }
  }

}
