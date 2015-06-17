require('angular');
;

let uiRouter = require('angular-ui-router');

angular.module('app', [uiRouter, require('angular-material'), 'homeModule'])
    .config($urlRouterProvider => $urlRouterProvider.otherwise('/'));