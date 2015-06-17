angular.module('homeModule', [])
    .config($stateProvider => {
        $stateProvider
            .state('home', {
                url: '/',
                controller: 'homeController',
                templateUrl: 'components/home/home.html'
            })
    });
