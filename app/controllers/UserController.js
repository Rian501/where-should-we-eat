'use strict';

eatsApp.controller('UserController', function($scope, $window, UserFactory) {
    

//even if you stay logged in, you are not yet logged in on pageload, so this listens for when a user becomes logged in
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log("User is signed in.");
    $window.location.href = '#!/user/suggest';
    } 
});

    $scope.loginUser = () => {
        UserFactory.loginUser()
        .then( (data) => {
            let currentUser = data.user.uid;
            $window.location.href = '#!/user/suggest';
        });
    };

    $scope.guestUser = () => {
        $window.location.href = '#!/guest/suggest';
    };
    
});