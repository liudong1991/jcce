package com.qijianke.jcce.manager;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.support.v4.app.NotificationCompat;

import com.qijianke.jcce.JCApplication;
import com.qijianke.jcce.MainActivity;
import com.qijianke.jcce.R;


/**
 * Created by Administrator on 2017/07/03.
 */

public class NotiManager {
  private static NotificationManager manager = (NotificationManager) JCApplication.getInstance().getSystemService(Context.NOTIFICATION_SERVICE);
  public static String ACTION = "notification_action";
  private static int id;

  public static void sendNotification(Context context, String content, String type) {
    Intent intent = new Intent(context, MainActivity.class);
    intent.putExtra("type", type);
    intent.setAction(ACTION);
    PendingIntent contentIntent = PendingIntent.getActivity(context, id, intent, PendingIntent.FLAG_UPDATE_CURRENT);
    NotificationCompat.Builder builder = new NotificationCompat.Builder(context);


    builder.setSmallIcon(R.mipmap.icon)
      .setContentTitle(context.getString(R.string.app_name))
      .setContentText(content)
      .setContentIntent(contentIntent)
      .setDefaults(Notification.DEFAULT_ALL)
      .setAutoCancel(true);

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
      builder.setVisibility(Notification.VISIBILITY_PUBLIC);
      PendingIntent pendingIntent = PendingIntent.getActivity(context, id, new Intent(), PendingIntent.FLAG_UPDATE_CURRENT);
      builder.setFullScreenIntent(pendingIntent, false);
    }

    Notification notification = builder.build();
    notification.contentIntent = contentIntent;
    manager.notify(id++, notification);
  }

}
