'use strict';

eatsApp.controller('NavController', function ($scope, $window, $routeParams, UserFactory, SuggestionsFactory, GoogleCreds) {


	
//want to hide "log out button unless a user is logged in!"
  $scope.logout = () => {
      UserFactory.logoutUser()
      .then( (data) => {
          $window.location.href = "#!/";
          alert('successfully logged out');
      });
  };


});
