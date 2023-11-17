// package com.rnproject;

// import android.util.Log;
// import com.facebook.react.bridge.Promise;
// import com.facebook.react.ReactPackage;
// import com.facebook.react.bridge.NativeModule;
// import com.facebook.react.bridge.ReactApplicationContext;
// import com.facebook.react.bridge.ReactContext;
// import com.facebook.react.bridge.ReactContextBaseJavaModule;
// import com.facebook.react.uimanager.ViewManager;
// import com.facebook.react.bridge.ReactMethod;

// import java.util.ArrayList;
// import java.util.Collections;
// import java.util.List;

// import java.io.BufferedReader;
// import java.io.IOException;
// import java.io.InputStreamReader;
// import java.net.HttpURLConnection;
// import java.net.URL;

// public class LogoutManagerModule extends ReactContextBaseJavaModule implements ReactPackage {
//     public LogoutManagerModule(ReactApplicationContext reactContext) {
//         super(reactContext);
//     }

//     @Override
//     public String getName() {
//         return "LogoutManager";
//     }

//     @Override
//     public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
//         return Collections.emptyList();
//     }

//     @Override
//     public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
//         List<NativeModule> modules = new ArrayList<>();
//         modules.add(this);
//         return modules;
//     }

//     @ReactMethod
//     public void performLogout(boolean isKakaoLogin, boolean isNaverLogin, String userInfo, Promise promise) {
//         String homeIP = "192.168.0.172:5300";
//         String academyIP = "192.168.200.17:5300";

//         if (isKakaoLogin) {
//             fetch("http://" + homeIP + "/kakaologin/logout");
//             isKakaoLogin = false;
//         } else if (isNaverLogin) {
//             fetch("http://" + homeIP + "/naverlogin/logout");
//             fetch("http://nid.naver.com/nidlogin.logout");
//             isNaverLogin = false;
//         }

//         userInfo = null;
//         Log.d("로그아웃 되었습니다", getUser());

//         promise.resolve(null);
//     }

//     private void fetch(String url) {
//         try {
//             URL urlObj = new URL(url);
//             HttpURLConnection connection = (HttpURLConnection) urlObj.openConnection();

//             connection.setRequestMethod("GET");

//             int responseCode = connection.getResponseCode();
//             if (responseCode == HttpURLConnection.HTTP_OK) {
//                 BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
//                 String line;
//                 StringBuilder responseBuilder = new StringBuilder();
//                 while ((line = reader.readLine()) != null) {
//                     responseBuilder.append(line);
//                 }
//                 reader.close();

//                 String response = responseBuilder.toString();
//                 System.out.println("응답 데이터: " + response);
//             } else {
//                 System.out.println("네트워크 요청이 실패했습니다. 응답 코드: " + responseCode);
//             }

//             connection.disconnect();
//         } catch (IOException e) {
//             e.printStackTrace();
//         }
//     }

//     private String getUser() {
//         return null;
//     }
// }
