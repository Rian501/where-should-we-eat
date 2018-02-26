"use strict";

let eatsApp = angular.module("EatsApp", ["ngRoute"])
.constant('FirebaseUrl', 'https://whereshouldweeat-369b9.firebaseio.com/');

let isAuth = (UserFactory)  => {
    return new Promise( (resolve, reject) => {
        UserFactory.isAuthenticated()
        .then( (userExistence) => {
            if (userExistence) {
                resolve();
            } else {
                reject();
            }
        });
    });
};

eatsApp.config(($routeProvider)=>{
    $routeProvider
      .when("/", {
        templateUrl: "templates/login.html",
        controller: "UserController"
      })
      .when("/guest/suggest", {
        templateUrl: "templates/suggest.html",
        controller: "SuggestionsUserController"
      })
      .when("/user/suggest", {
        templateUrl: "templates/suggest.html",
        controller: "SuggestionsUserController",
        resolve: { isAuth }
      })
      .when("/user/edit", {
        templateUrl: "templates/editBlacklist.html",
        controller: "BlacklistEditController",
        resolve: { isAuth }
      })
      .when("/user/faves", {
        templateUrl: "templates/editFaves.html",
        controller: "SuggestionsFavesController",
        resolve: { isAuth }
      })
      .when("/done/:place_id", {
        templateUrl: "templates/finished.html",
        controller: "FinishedController"
      })
      .when("/radius", {
        templateUrl: "templates/radius.html",
        controller: "RadiusController"
      })
      .when("/:radius", {
        templateUrl: "templates/suggest.html",
        controller: "SuggestionsUserController"
      })

      .otherwise("/");
});