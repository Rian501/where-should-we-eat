'use strict';

eatsApp.controller('UserController', function($scope, $window, UserFactory) {
    $scope.loginUser = () => {
        UserFactory.loginUser()
        .then( (data) => {
            let currentUser = data.user.uid;
            $window.location.href = '#!/startsession';
        });
    };
});