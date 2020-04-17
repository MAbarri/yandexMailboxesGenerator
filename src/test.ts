// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/dist/zone-testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

declare const require: any;

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);

// ,
// "/v1/*": {
//     "target": "https://api.godaddy.com",
//     "secure": false,
//     "changeOrigin": true,
//     "logLevel": "debug"
// },
// "/v6/*": {
//     "target": "https://api.directory.yandex.net",
//     "secure": false,
//     "changeOrigin": true,
//     "logLevel": "debug"
// },
// "/api2/*": {
//     "target": "https://pddimp.yandex.ru",
//     "secure": false,
//     "changeOrigin": true,
//     "logLevel": "debug"
// }
