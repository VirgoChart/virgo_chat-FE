"use client";

import { useEffect } from "react";

const FacebookScript = () => {
  useEffect(() => {
    window.fbAsyncInit = function () {
      FB.init({
        appId: "630810836307426",
        cookie: true,
        xfbml: true,
        version: "v20.0",
      });
      FB.AppEvents.logPageView();
    };

    // Load the Facebook SDK script
    (function (d, s, id) {
      var js: HTMLScriptElement,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s) as HTMLScriptElement;
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode?.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }, []);

  return null;
};

export default FacebookScript;
