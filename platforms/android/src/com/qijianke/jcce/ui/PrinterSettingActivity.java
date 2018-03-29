package com.qijianke.jcce.ui;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.text.TextUtils;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import com.qijianke.jcce.R;
import com.qijianke.jcce.base.BaseActivity;
import com.qijianke.jcce.common.Constants;
import com.qijianke.jcce.entity.PrintEntity;
import com.qijianke.jcce.manager.BtPrinterManager;
import com.qijianke.jcce.ui.view.GLProgressDialog;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Set;
import java.util.UUID;

import static com.qijianke.jcce.manager.BtPrinterManager.btSocket;

/**
 * Created by Administrator on 2017/12/28.
 */

public class PrinterSettingActivity extends BaseActivity {

  private static final int REQUEST_ENABLE_BT = 101;

  //这条是蓝牙串口通用的UUID
  private static final UUID MY_UUID = UUID.fromString("00001101-0000-1000-8000-00805F9B34FB");

  private ArrayList<BluetoothDevice> bluetoothDevices = new ArrayList<BluetoothDevice>();

  private BluetoothAdapter mBluetoothAdapter;
  private ListView listView;
  private GLProgressDialog pDialog;

  private String content;

  @Override
  protected void onCreate(@Nullable Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.bluetooth_setting_layout);

    init();

    content = getIntent().getStringExtra("content");

    searchBondDevice();
  }

  private void init() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
      View view = findViewById(R.id.header);
      ViewGroup.LayoutParams lp = view.getLayoutParams();
      lp.height = Constants.STATUS_BAR_HEIGHT;
      view.setLayoutParams(lp);
    }

    listView = (ListView) findViewById(R.id.device_list);
    listView.setAdapter(adapter);

    pDialog = new GLProgressDialog(this);
    pDialog.setTips("正在连接...");
  }

  private void searchBondDevice() {
    mBluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
    if (mBluetoothAdapter == null) {
      Toast.makeText(this, "您的手机不支持蓝牙", Toast.LENGTH_SHORT).show();
    } else {
      if (!mBluetoothAdapter.isEnabled()) {
        Intent intent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
        startActivityForResult(intent, REQUEST_ENABLE_BT);
      } else {
        getDevices();
      }
    }
  }

  private void getDevices() {
    Set<BluetoothDevice> bondedDevices = mBluetoothAdapter.getBondedDevices();
    if (bondedDevices != null && bondedDevices.size() > 0) {
      bluetoothDevices.clear();
      bluetoothDevices.addAll(bondedDevices);
      adapter.notifyDataSetChanged();
    }
  }

  @Override
  protected void onActivityResult(int requestCode, int resultCode, Intent data) {
    if (requestCode == REQUEST_ENABLE_BT) {
      if (resultCode == RESULT_OK) {
        getDevices();
      } else if (resultCode == RESULT_CANCELED) {
        finish();
      }
    }
  }

  private BaseAdapter adapter = new BaseAdapter() {
    @Override
    public int getCount() {
      return bluetoothDevices.size();
    }

    @Override
    public BluetoothDevice getItem(int position) {
      return bluetoothDevices.get(position);
    }

    @Override
    public long getItemId(int position) {
      return position;
    }

    @Override
    public View getView(final int position, View convertView, ViewGroup parent) {
      View view = LayoutInflater.from(PrinterSettingActivity.this).inflate(R.layout.device_item, null);
      TextView name = (TextView) view.findViewById(R.id.tv_name);
      TextView address = (TextView) view.findViewById(R.id.tv_address);
      name.setText(getItem(position).getName());
      address.setText(getItem(position).getAddress());

      TextView bt = (TextView) view.findViewById(R.id.tv_connect);
      bt.setOnClickListener(new View.OnClickListener() {
        @Override
        public void onClick(View v) {
          showDialog();
          new Thread(new Runnable() {
            @Override
            public void run() {
              try {
                BluetoothDevice item = getItem(position);
                btSocket = item.createRfcommSocketToServiceRecord(MY_UUID);
                btSocket.connect();
                BtPrinterManager.os = btSocket.getOutputStream();
                toast("连接成功");
                if (!TextUtils.isEmpty(content))
                  BtPrinterManager.print(new PrintEntity(content));
                finish();
              } catch (IOException e) {
                try {
                  if (btSocket != null)
                    btSocket.close();
                  toast("连接失败");
                } catch (IOException e1) {
                  e1.printStackTrace();
                }
              } finally {
                dismissDialog();
              }
            }
          }).start();
        }
      });

      return view;
    }
  };

  private void toast(final String content) {
    runOnUiThread(new Runnable() {
      @Override
      public void run() {
        Toast.makeText(PrinterSettingActivity.this, content, Toast.LENGTH_SHORT).show();
      }
    });
  }

  private void showDialog() {
    pDialog.show();
  }

  private void dismissDialog() {
    runOnUiThread(new Runnable() {
      @Override
      public void run() {
        pDialog.dismiss();
      }
    });
  }


}
