declare namespace FB {
  function init(params: {
    appId: string;
    cookie: boolean;
    xfbml: boolean;
    version: string;
  }): void;

  namespace AppEvents {
    function logPageView(): void;
  }
}
