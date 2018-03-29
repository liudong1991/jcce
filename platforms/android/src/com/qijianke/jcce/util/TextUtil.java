package com.qijianke.jcce.util;

import android.graphics.Rect;
import android.support.v4.media.TransportMediator;
import android.text.TextUtils;
import android.widget.TextView;

import java.text.DecimalFormat;
import java.util.regex.Pattern;

/**
 * Created by Administrator on 2015/11/4.
 */
public class TextUtil {
    public static final String TEXT_EMPTY = "";

    public static final String TEXT_NULL = "null";

    public static String filterNull(String str) {
        return str == null ? TEXT_EMPTY : str;
    }

    public static String filterEmpty(String str, String def) {
        return isEmpty(str) ? def : str;
    }

    public static boolean isEmpty(CharSequence str) {
        if (str == null || str.length() == 0) {
            return true;
        }
        return false;
    }

    public static boolean isEmptyTrim(String str) {
        if (str == null || str.trim().length() == 0 || TEXT_NULL.equals(str)) {
            return true;
        }
        return false;
    }

    public static boolean isNumeric(String str) {
        if (str == null || str.length() == 0) {
            return false;
        }
        return TextUtils.isDigitsOnly(str);
    }

    public static boolean checkMailFormat(String email) {
        return Pattern.compile("\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*").matcher(email).find();
    }

    public static int calculateWeiboLength(CharSequence c) {
        double len = 0.0d;
        for (int i = 0; i < c.length(); i++) {
            int temp = c.charAt(i);
            if (temp <= 0 || temp >= TransportMediator.KEYCODE_MEDIA_PAUSE) {
                len += 1.0d;
            } else {
                len += 0.5d;
            }
        }
        return (int) Math.round(len);
    }

    public static String resetTextBy100(String text) {
        double len = 0.0d;
        for (int i = 0; i < text.length(); i++) {
            int temp = text.charAt(i);
            if (temp <= 0 || temp >= TransportMediator.KEYCODE_MEDIA_PAUSE) {
                len += 1.0d;
            } else {
                len += 0.5d;
            }
            if (((int) Math.round(len)) == 100) {
                return text.substring(0, i) + "...";
            }
        }
        return text;
    }

    public static boolean isMobile(CharSequence str) {
        if (isEmpty(str)) {
            return false;
        }
        return Pattern.compile("^[1][3,4,5,7,8][0-9]{9}$").matcher(str).matches();
    }

    public static String formatFloat(double num){
        return new DecimalFormat("#0.00").format(num);
    }

    public static String formatFloat_1(double num){
        return new DecimalFormat("#0.0").format(num);
    }

    public static String formatMoney(String money, String format, boolean delZero){
        double temp = 0f;
        if( money != null && !"".equals(money)){
            try {
                temp = Double.valueOf(money);
            } catch (NumberFormatException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
                temp = 0f;
            }
        }
        return formatMoney(temp, format, delZero);
    }

    public static String formatMoney(double money, String format, boolean delZero){
        double moneyformat = 0f ;
        DecimalFormat df = new DecimalFormat(format);
        if(delZero){
            moneyformat = Double.valueOf(df.format(money));
            if(moneyformat % 1.0 ==0){
                return String.valueOf((long)moneyformat);
            }
        }else{
            return df.format(money);
        }
        return String.valueOf(moneyformat);
    }

    /**
     * 请选择
     */
    final static String PLEASE_SELECT = "请选择...";

    /**
     * 处理空字符串
     *
     * @param str
     * @return String
     */
    public static String doEmpty(String str) {
        return doEmpty(str, "");
    }

    /**
     * 处理空字符串
     *
     * @param str
     * @param defaultValue
     * @return String
     */
    public static String doEmpty(String str, String defaultValue) {
        if (str == null || str.equalsIgnoreCase("null")
                || str.trim().equals("") || str.trim().equals("－请选择－")) {
            str = defaultValue;
        } else if (str.startsWith("null")) {
            str = str.substring(4, str.length());
        }
        return str.trim();
    }

    public static boolean notEmpty(Object o) {
        return o != null && !"".equals(o.toString().trim())
                && !"null".equalsIgnoreCase(o.toString().trim())
                && !"undefined".equalsIgnoreCase(o.toString().trim())
                && !PLEASE_SELECT.equals(o.toString().trim());
    }

    public static boolean empty(Object o) {
        return o == null || "".equals(o.toString().trim())
                || "null".equalsIgnoreCase(o.toString().trim())
                || "undefined".equalsIgnoreCase(o.toString().trim())
                || PLEASE_SELECT.equals(o.toString().trim());
    }

    /**
     * 给JID返回用户名
     *
     * @param Jid
     * @return
     */
    public static String getUserNameByJid(String Jid) {
        if (empty(Jid)) {
            return null;
        }
        if (!Jid.contains("@")) {
            return Jid;
        }
        return Jid.split("@")[0];
    }

    /**
     * 给用户名返回JID
     *
     * @param jidFor
     *            域名//如wangxc
     * @param userName
     * @return
     */
    public static String getJidByName(String userName, String jidFor) {
        if (empty(jidFor) || empty(jidFor)) {
            return null;
        }
        return userName + "@" + jidFor;
    }

    /**
     * 给用户名返回JID,使用默认域名wangxc
     *
     * @param userName
     * @return
     */
//    public static String getJidByName(String userName) {
//        String domain = XmppConnectionManager.getInstance().getConnection().getServiceName();
//        System.out.println("StringUtil服务器域名是："+domain);
//        String jidFor = domain;
//        return getJidByName(userName, jidFor);
//    }

    public static String formatLimitStr(String str, int len){
        if(str.length() >= len){
            str = str.substring(0, len - 1) + "...";
        }

        return  str;
    }

    /**
     * 判定输入汉字
     *
     * @param c
     * @return
     */
    public static boolean isChinese(char c) {
        if ((c >= '\u4e00' && c <= '\u9fa5') || (c >= '\uf900' && c <= '\ufa2d'))
            return true;
        return false;

    }

    /**
     * 检测String是否全是中文
     *
     * @param name
     * @return
     */
    public static boolean checkNameChese(String name) {
        boolean res = true;
        char[] cTemp = name.toCharArray();
        for (int i = 0; i < name.length(); i++) {
            if (!isChinese(cTemp[i])) {
                res = false;
                break;
            }
        }
        return res;
    }

    public static boolean isTextCrossBorder(TextView dest, String str) {
        Rect rect = new Rect();
        dest.getPaint().getTextBounds(str, 0, str.length(), rect);
        if (rect.width() > dest.getWidth()) {
            return true;
        }
        return false;
    }

    public static int getVisiableTextLength(TextView dest) {
        return (int) (((float) dest.getWidth()) / ((float) ((int) dest.getPaint().measureText("鑫", 0, 1))));
    }

  public static String numFormat(String num) {
    if (!TextUtil.isEmptyTrim(num)) {
      float f = Float.valueOf(num);
      if (f == (int) f) {
        num = (int) f + "";
      } else if (f * 10 == (int) (f * 10)) {
        num = String.format("%.1f", f);
      } else {
        num = String.format("%.2f", f);
      }
    }
    return num;
  }

}
