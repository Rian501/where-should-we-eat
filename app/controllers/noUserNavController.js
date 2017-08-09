'use strict';

eatsApp.controller('UserlessNavController', function ($scope, $window, $routeParams, UserFactory, SuggestionsFactory, GoogleCreds) {

    $scope.loginUser = () => {
        UserFactory.loginUser()
        .then( (data) => {
            let currentUser = data.user.uid;
            $window.location.href = '#!/user/suggest';
        });
    };


});