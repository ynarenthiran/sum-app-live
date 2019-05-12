// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "{API_KEY}",
    authDomain: "sum-app-live.firebaseapp.com",
    databaseURL: "https://sum-app-live.firebaseio.com",
    projectId: "sum-app-live",
    storageBucket: "sum-app-live.appspot.com",
    messagingSenderId: "945766745154",
    appId: "1:945766745154:web:051e7227adcc9fb1"
  },
  config: {
    accountId: 'ChDdXhb34LXez9VI1bBN'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
