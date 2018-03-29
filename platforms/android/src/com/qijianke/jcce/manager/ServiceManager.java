package com.qijianke.jcce.manager;

import com.qijianke.jcce.service.ActionService;
import com.qijianke.jcce.service.ActionServiceImpl;

/**
 * Created by Administrator on 2017/04/24.
 */

public class ServiceManager {

  public static <T> T getService(Class<T> clazz) {
    T t = null;
    if (clazz == ActionService.class) {
      t = (T) new ActionServiceImpl();
    }
    return t;
  }
}
