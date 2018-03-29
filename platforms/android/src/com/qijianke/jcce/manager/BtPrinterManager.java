package com.qijianke.jcce.manager;

import android.app.Activity;
import android.bluetooth.BluetoothSocket;
import android.content.Intent;
import android.widget.Toast;

import com.qijianke.jcce.JCApplication;
import com.qijianke.jcce.entity.PrintEntity;
import com.qijianke.jcce.ui.PrinterSettingActivity;

import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Created by Administrator on 2017/12/28.
 */

public class BtPrinterManager {

  private static ExecutorService singleThreadExecutor = Executors.newSingleThreadExecutor();

  public static BluetoothSocket btSocket;
  public static OutputStream os;


  public static void print(final PrintEntity entity) {
    if (btSocket != null && btSocket.isConnected()) {
      singleThreadExecutor.execute(new Runnable() {
        @Override
        public void run() {
          try {
            OutputStreamWriter writer = new OutputStreamWriter(os, "GBK");
            initPrinter();

            setAlignPosition(1);
            writer.write(entity.getTitle() + "\n\n");
            writer.flush();

            initPrinter();

            int n;

            n = 0;
            setLeftMargin(n % 256, n / 256);
            writer.write("序号");
            writer.flush();

            n = 100;
            setLeftMargin(n % 256, n / 256);
            writer.write("号码");
            writer.flush();

            n = 200;
            setLeftMargin(n % 256, n / 256);
            writer.write("金额");
            writer.flush();

            n = 300;
            setLeftMargin(n % 256, n / 256);
            writer.write("赔率");
            writer.flush();

            writer.write("\n");
            writer.flush();

            writer.write("--------------------------------\n");
            writer.flush();

            setVerticalSpacing(25);

            for (int i = 0; i < entity.getList().size(); i++) {

              n = 0;
              setLeftMargin(n % 256, n / 256);
              writer.write(" " + (i + 1));
              writer.flush();

              n = 100;
              setLeftMargin(n % 256, n / 256);
              writer.write(entity.getList().get(i).getCode());
              writer.flush();

              n = 200;
              setLeftMargin(n % 256, n / 256);
              writer.write(entity.getList().get(i).getMoney());
              writer.flush();

              n = 300;
              setLeftMargin(n % 256, n / 256);
              writer.write(entity.getList().get(i).getOdds());
              writer.flush();


              writer.write("\n");
              writer.flush();
            }

            initPrinter();

            writer.write("--------------------------------\n");
            writer.flush();

            n = 0;
            setLeftMargin(n % 256, n / 256);
            writer.write("合计");
            writer.flush();

            n = 200;
            setLeftMargin(n % 256, n / 256);
            writer.write(entity.getTotal());
            writer.flush();

            writer.write("\n\n");
            writer.flush();

            setAlignPosition(1);
            writer.write("请核对注单，如无异议视为确认。\n");
            writer.write("开奖后三天内有效！\n");
            writer.write(entity.getTime() + "\n\n\n\n");
            writer.flush();

          } catch (Exception e) {
            e.printStackTrace();
          }
        }
      });
    } else {
      Toast.makeText(JCApplication.getInstance(), "未连接打印机", Toast.LENGTH_SHORT).show();
      Intent intent = new Intent(JCApplication.getInstance(), PrinterSettingActivity.class);
      intent.putExtra("content", entity.getContent());
      intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
      JCApplication.getInstance().startActivity(intent);
    }
  }

  /**
   * 初始化打印机
   *
   * @throws IOException
   */
  private static void initPrinter() throws IOException {
    os.write(0x1B);
    os.write(0x40);
    os.flush();
  }

  /**
   * 设置文本对齐方式
   *
   * @param align 0：居左（默认） 1：居中 2：居右
   * @throws IOException
   */
  private static void setAlignPosition(int align) throws IOException {
    os.write(0x1B);
    os.write(0x61);
    os.write(align);
    os.flush();
  }

  private static void setTextSize(int size) throws IOException {
    os.write(0x1B);
    os.write(0x21);
    os.write(size);
    os.flush();
  }

  private static void setLeftMargin(int l, int h) throws IOException {
    os.write(0x1B);
    os.write(0x24);
    os.write(l);
    os.write(h);
    os.flush();
  }

  private static void setVerticalSpacing(int n) throws IOException {
    os.write(0x1B);
    os.write(0x33);
    os.write(n);
    os.flush();
  }

  public static void printerSetting(Activity activity) {
    activity.startActivity(new Intent(activity, PrinterSettingActivity.class));
  }


}
