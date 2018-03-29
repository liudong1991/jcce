package com.qijianke.jcce.manager;

import android.app.Activity;
import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.net.Uri;
import android.os.Environment;
import android.os.Handler;
import android.os.Message;
import android.support.annotation.NonNull;
import android.support.annotation.StyleRes;
import android.text.SpannableString;
import android.text.Spanned;
import android.text.TextUtils;
import android.text.style.AbsoluteSizeSpan;
import android.util.Log;
import android.view.Gravity;
import android.view.KeyEvent;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import com.google.gson.Gson;
import com.qijianke.jcce.JCApplication;
import com.qijianke.jcce.MainActivity;
import com.qijianke.jcce.R;
import com.qijianke.jcce.common.Constants;
import com.qijianke.jcce.entity.UpdateEntity;
import com.qijianke.jcce.util.SystemUtil;
import com.qijianke.jcce.util.TextUtil;

import org.apache.cordova.CordovaInterface;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

/**
 * Created by Administrator on 2017/05/16.
 */

public class UpdateManager {

  private static boolean flag;
  private static boolean isLoading;

  private static void loadApk(final Activity activity, final UpdateEntity entity) {
    final Handler handler = new Handler(activity.getMainLooper()) {
      ProgressDialog dialog;

      @Override
      public void handleMessage(Message msg) {
        switch (msg.what) {
          case 1:
            if (dialog == null) {
              dialog = new ProgressDialog(activity, R.style.dialog_custom);
            }
            break;
          case 2:
            if (dialog != null) {
              dialog.setProgress(msg.arg1, msg.arg2);
            }
            break;
          case 3:
            if (dialog != null) {
              dialog.dismiss();
            }
            break;
        }
      }
    };
    new Thread(new Runnable() {
      @Override
      public void run() {
        int length;
        int current = 0;
        flag = true;
        isLoading = false;
        handler.sendEmptyMessage(1);
        String error = null;
        try {
          String downloadUrl = entity.getDownloadUrl();
          String apkName = downloadUrl.substring(downloadUrl.lastIndexOf('/') + 1, downloadUrl.length());

          File temp = getTempApkPath(apkName + ".wcl.tmp");
          if (temp.exists()) {
            current = (int) temp.length();
          }
          URL url = new URL(downloadUrl);
          Log.i(UpdateManager.class.getName(), "wust-->DownloadUrl=" + downloadUrl);
          HttpURLConnection connection = (HttpURLConnection) url.openConnection();
          connection.setConnectTimeout(20000);
          connection.setReadTimeout(20000);
          connection.setRequestProperty("Range", "bytes=" + current + "-");
          int responseCode = connection.getResponseCode();
          Log.i(UpdateManager.class.getName(), "wust-->responseCode=" + responseCode);
          isLoading = true;
          if (responseCode == 200 || responseCode == 206) {
            Log.i(UpdateManager.class.getName(), "wust-->response:" + connection.getContent());
            InputStream in = connection.getInputStream();
            length = connection.getContentLength() + current;
            FileOutputStream fos = new FileOutputStream(temp, true);
            byte[] b = new byte[1024];
            int len;
            while (flag && (len = in.read(b)) != -1) {
              current += len;
              send(handler, length, current);
              fos.write(b, 0, len);
            }
            fos.close();
            in.close();

            if (flag) {
              final File file = getApkPath(apkName.endsWith(".apk") ? apkName : apkName + ".apk");
              temp.renameTo(file);
              openApk(file);
              temp.delete();
            }
          } else {
            Log.i(UpdateManager.class.getName(), "wust-->找不到资源或服务器异常");
            error = "找不到资源或服务器异常";
          }
        } catch (final IOException e) {
          e.printStackTrace();
          Log.i(UpdateManager.class.getName(), "wust-->" + e.getMessage());
          error = "当前网络连接断开或连接超时，请检查网络";
        } finally {
          final String err = error;
          isLoading = false;
          activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
              handler.sendEmptyMessage(3);
              if (!TextUtils.isEmpty(err)) {
                Toast.makeText(activity, err, Toast.LENGTH_SHORT).show();
              }
            }
          });
        }
      }
    }).start();
  }

  private static File getApkPath(String name) {
    String apkPath = Environment.getExternalStorageDirectory() + File.separator + JCApplication.getInstance().getApplicationInfo().packageName + File.separator + "update" + File.separator + name;
    File file = new File(apkPath);
    if (!file.getParentFile().exists())
      file.getParentFile().mkdirs();
    return new File(apkPath);
  }

  private static File getTempApkPath(String tempName) {
    String apkPath = Environment.getExternalStorageDirectory() + File.separator + JCApplication.getInstance().getApplicationInfo().packageName + File.separator + "update" + File.separator + tempName;
    File file = new File(apkPath);
    if (!file.getParentFile().exists())
      file.getParentFile().mkdirs();
    return new File(apkPath);
  }

  private static void send(Handler handler, final int length, final int current) {
    Message message = handler.obtainMessage();
    message.what = 2;
    message.arg1 = current;
    message.arg2 = length;
    handler.sendMessage(message);
  }

  private static void openApk(File file) {
    Intent intent = new Intent();
    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
    intent.setAction(android.content.Intent.ACTION_VIEW);
    intent.setDataAndType(Uri.fromFile(file),
      "application/vnd.android.package-archive");
    JCApplication.getInstance().startActivity(intent);
  }

  public static void download(final Activity activity, final UpdateEntity entity) {
    String downloadUrl = entity.getDownloadUrl();
    String apkName = downloadUrl.substring(downloadUrl.lastIndexOf('/') + 1, downloadUrl.length());
    File file = getApkPath(apkName.endsWith(".apk") ? apkName : apkName + ".apk");
    if (file.exists()) {
      openApk(file);
    } else {
      int type = SystemUtil.GetNetype(JCApplication.getInstance());
      if (type == -1) {
        Toast.makeText(activity, "网络未链接", Toast.LENGTH_SHORT).show();
      } else if (type == 1) {
        loadApk(activity, entity);
      } else {
        show(activity, entity);
      }
    }
  }

  private static void show(final Activity activity, final UpdateEntity entity) {

    final Dialog dialog1 = new Dialog(activity, R.style.dialog_custom);
    dialog1.setContentView(R.layout.notice_dialog_layout);
    dialog1.show();
    dialog1.setCancelable(false);
    dialog1.setOnKeyListener(new DialogInterface.OnKeyListener() {
      @Override
      public boolean onKey(DialogInterface dialog, int keyCode, KeyEvent event) {
        return (keyCode == KeyEvent.KEYCODE_BACK && event.getRepeatCount() == 0);
      }
    });

    Window window = dialog1.getWindow();
    assert window != null;
    WindowManager.LayoutParams lp = window.getAttributes();
    lp.gravity = Gravity.CENTER;
    lp.y = -50;
    window.setAttributes(lp);

    View.OnClickListener listener1 = new View.OnClickListener() {
      @Override
      public void onClick(View v) {
        switch (v.getId()) {
          case R.id.yes:
            loadApk(activity, entity);
            break;
          case R.id.no:

            break;
        }
        dialog1.dismiss();
      }
    };
    dialog1.findViewById(R.id.yes).setOnClickListener(listener1);
    dialog1.findViewById(R.id.no).setOnClickListener(listener1);
  }

  private static class ProgressDialog extends Dialog {
    private ProgressBar bar;
    private TextView cur;
    private TextView total;
    private TextView rate;
    private Dialog dialog1;

    ProgressDialog(@NonNull Context context, @StyleRes int themeResId) {
      super(context, themeResId);
      setContentView(R.layout.update_progress_layout);
      bar = (ProgressBar) findViewById(R.id.progress);
      cur = (TextView) findViewById(R.id.curTxt);
      total = (TextView) findViewById(R.id.totalTxt);
      rate = (TextView) findViewById(R.id.progress_rate);
      show();
      setCancelable(false);
      setOnKeyListener(new OnKeyListener() {
        @Override
        public boolean onKey(DialogInterface dialog, int keyCode, KeyEvent event) {
          if (keyCode == KeyEvent.KEYCODE_BACK && event.getRepeatCount() == 0) {
            if (isLoading)
              if (dialog1 == null) {
                dialog1 = new Dialog(getContext(), R.style.dialog_custom);
                dialog1.setContentView(R.layout.notice_dialog_layout);
                dialog1.show();
                ((TextView) dialog1.findViewById(R.id.content)).setText("是否取消下载？");
                dialog1.setCancelable(false);

                Window window = dialog1.getWindow();
                assert window != null;
                WindowManager.LayoutParams lp = window.getAttributes();
                lp.gravity = Gravity.CENTER;
                lp.width = Constants.SCREEN_WIDTH * 3 / 4;
                lp.y = -50;
                window.setAttributes(lp);

                View.OnClickListener listener1 = new View.OnClickListener() {
                  @Override
                  public void onClick(View v) {
                    switch (v.getId()) {
                      case R.id.yes:
                        flag = false;
                        break;

                    }
                    dialog1.dismiss();
                  }
                };
                dialog1.findViewById(R.id.yes).setOnClickListener(listener1);
                dialog1.findViewById(R.id.no).setOnClickListener(listener1);
              } else {
                dialog1.show();
              }
            return true;
          }
          return false;
        }
      });

      Window window = getWindow();
      assert window != null;
      WindowManager.LayoutParams lp = window.getAttributes();
      lp.width = Constants.SCREEN_WIDTH * 13 / 16;
      lp.gravity = Gravity.CENTER;
      lp.y = -50;
      window.setAttributes(lp);
    }

    @Override
    public void dismiss() {
      super.dismiss();
      if (dialog1 != null) {
        dialog1.dismiss();
      }
    }

    void setProgress(int cur, int total) {
      bar.setMax(total);
      bar.setProgress(cur);
      this.cur.setText(TextUtil.numFormat(cur / (1024 * 1024f) + "") + "M");
      this.total.setText("/" + TextUtil.numFormat(total / (1024 * 1024f) + "") + "M");
      String rate = (int) (cur / (float) total * 100) + "%";
      if (!"100%".equals(rate)) {
        SpannableString ss = new SpannableString(rate);
        ss.setSpan(new AbsoluteSizeSpan(16, true), rate.length() - 1, rate.length(), Spanned.SPAN_INCLUSIVE_INCLUSIVE);
        this.rate.setText(ss);
      }
    }

  }

}
