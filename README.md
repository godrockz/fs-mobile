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

* You just have to run `ionic platform add android`, `ionic build android`, `ionic emulate android`, once every thing is installed (which takes quite long) and configured.
