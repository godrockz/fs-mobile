# fs-mobile
Mobile App

# getting started

    npm install
    bower update 
    grunt serve

# emulate it

* You need to install the Android SDK Manager. [This
link](http://www.webupd8.org/2014/09/canonical-releases-ubuntu-developer.html) explains how to do it best in Ubuntu.

* After this is done you need to create an AVD.
[This page](https://cordova.apache.org/docs/en/4.0.0/guide_platforms_android_index.md.html#Android%20Platform%20Guide)
explains quite well how to accomplish this. An AVD demands libs for a specific api version. One of the sub entries includes the name ABI which also needs to be installed.

* You just have to run `ionic platform add android`, `ionic build android`, `ionic emulate android`, once every thing is installed (which takes quite long). I think in our case we should replace `ionic` with `grunt` which runs some additional tasks.

* You can define a specific AVD with `--target`

* https://developer.android.com/tools/devices/managing-avds-cmdline.html

* easiest way to test the app on your mobile phone
 * pluck in your mobile phone to your computer
 * run `ionic run android` or `grunt run android`

* publishing the app: http://ionicframework.com/docs/guide/publishing.html

* a 'released' apk must be signed even though it is only used for testing purposes! (http://developer.android.com/tools/publishing/app-signing.html)


# jsonizer
run grunt  jsonizer:defaults to fetch data for offline usage from api 

# release it

The following steps will create a realeasable apk

First ensure that cordova-plugin-whitelist was added to te application 
    
    cordova plugin add cordova-plugin-whitelist 
    cordova plugin add cordova-plugin-splashscreen
    cordova plugin add cordova-plugin-keyboard

```
grunt
```

```
cordova plugin rm org.apache.cordova.console
```

```
cordova build --release android
```

```
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore <your-keystore>.keystore /home/johannes/Work/js/fs-mobile/platforms/android/build/outputs/apk/android-release-unsigned.apk <key_alias>
```

```
zipalign -v 4 /home/johannes/Work/js/fs-mobile/platforms/android/build/outputs/apk/android-release-unsigned.apk FreakstockApp.apk
```

# iOS Quirks

iOS has a mechanism called *App Transport Security*. It is enabled by default. App Transport Security blocks cleartext HTTP (http://) resource loads since it is defined as insecure. In this project resources need to be loaded as cleartext HTTP. To disable this mechanism the following code needs to be added to ```Freakstock-Info.plist```

```xml
<key>NSAppTransportSecurity</key>
<dict>
	<key>NSAllowsArbitraryLoads</key>
	<true/>
</dict>
```
