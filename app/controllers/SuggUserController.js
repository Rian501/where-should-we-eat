"use strict";

eatsApp.controller("SuggestionsUserController", function(
  $scope,
  $sce,
  $window,
  $routeParams,
  UserFactory,
  SuggestionsFactory,
  GoogleCreds
) {
  let suggestionsArray = [];
  let favesArray = [];
  let userLoc = {};
  $scope.radius = 7500;

  let setRadius = () => {
    if (UserFactory.getUser()) {
      UserFactory.getUserRadius().then(userRadiusData => {
        $scope.radius = Object.values(userRadiusData)[0].userRadius * 1609;
      });
    }
  };
//set the radius to the saved user preference if there is one
  setRadius();

  //to allow the template to test for user
  $scope.ifUser = () => {
    if (UserFactory.getUser()) {
      return true;
    } else {
      return false;
    }
  };

  $scope.defReady = () => {
    if ($scope.currentSuggestion) {
      return true;
    } else {
      return false;
    }
  };

  $scope.getInclude = () => {
    if (UserFactory.getUser()) {
      return "templates/userNav.html";
    } else {
      return "templates/noUserNav.html";
    }
  };

  $scope.initSuggestionsArray = radius => {
    buildBlacklist();
    buildFaveslist();
    UserFactory.locateUser().then(data => {
      console.log("userLoc?", data);
      userLoc.lat = data.lat;
      userLoc.lng = data.lng;
      radius = $scope.radius; //instead, we'll have to get the radius through a provider, maybe even radius factory
      return SuggestionsFactory.fetchAPISuggestions(
        userLoc.lat,
        userLoc.lng,
        radius
      )
        .then(results => {
          suggestionsArray = results;
          checkSuggestions();
          $scope.showNewSuggestion();
        });
    });
  };

  $scope.moreSuggestions = () => {
    //add more suggestions to the possible suggestions array
    if (suggestionsArray.length < 20) {
      SuggestionsFactory.fetchMoreSuggestions().then(data => {
        //concat the next page of results
        suggestionsArray = suggestionsArray.concat(data.data.results);
        suggestionsArray = _.uniqWith(suggestionsArray, _.isEqual);
        checkSuggestions();
      });
    }
  };

  function generateRandom(array) {
    //pick a number between 0 and array length
    let max = Math.floor(array.length - 1);
    return Math.floor(Math.random() * max);
  }

  let today = UserFactory.getDay();

  $scope.showNewSuggestion = () => {
    let faveMatch = false;
    $scope.reviewsOpen = false;
    $scope.detailsOpen = false;
    $scope.radiusOpen = false;
    if (suggestionsArray.length === 0) {
      $window.alert(
        "Picky picky! You have rejected all results. Please try again, or widen your radius."
      );
      $window.location.href = "!#/";
    } else if (checkForFaves()) {
      faveMatch = checkForFaves();
      $scope.currentSuggestion = faveMatch;
      $scope.currentSuggestion.price = dollarSigns();
      // starSymbols();

      //if a suggestion in the array matches something in the save for later array, push it to the current suggestion
    } else {
      checkSuggestions();
      let rando = generateRandom(suggestionsArray);
      $scope.currentSuggestion = suggestionsArray.slice(rando, rando + 1)[0];
      suggestionsArray.splice(rando, 1);
      $scope.currentSuggestion.price = dollarSigns();
      console.log("suggestionsArray", suggestionsArray);
      // console.log("current suggestion", $scope.currentSuggestion);
      if ($scope.currentSuggestion.photos !== undefined) {
        let photoref = $scope.currentSuggestion.photos[0].photo_reference;
        $scope.currentSuggestion.photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=500&photoreference=${photoref}&key=${
          GoogleCreds.PlacesApiKey
        }`;
      } else {
        $scope.currentSuggestion.photoUrl = `../../lib/images/restaurant-1724294_640.png`;
      }
    }
  };

  let dollars = "";
  function dollarSigns() {
    dollars = "";
    for (let j = 0; j < $scope.currentSuggestion.price_level; j++) {
      dollars += `$`;
    }
    return dollars;
  }

  $scope.moreInfo = () => {
    SuggestionsFactory.getPlaceDetails($scope.currentSuggestion.place_id).then(
      details => {
        console.log("details?", details);
        $scope.details = details;
        $scope.today = UserFactory.getDay();
      }
    );
    SuggestionsFactory.getDirections(
      userLoc.lat,
      userLoc.lng,
      $scope.currentSuggestion.place_id
    ).then(distData => {
      $scope.distance = distData.distance;
      $scope.duration = distData.duration;
    });
  };

  // $scope.morePhotos = () => {

  // };

  $scope.reviewsMoreInfo = () => {
    $scope.reviews = $scope.details.reviews;
  };

  let rejectsArray = [];

  function buildFaveslist() {
    let currentUser = UserFactory.getUser();
    SuggestionsFactory.getSavedlist(currentUser).then(listData => {
      favesArray = favesArray.concat(listData);
    });
  }

  function checkForFaves() {
    // buildFaveslist()
    favesArray.forEach(function(item) {
      for (let i = 0; i < suggestionsArray.length; i++) {
        if (item.place_id == suggestionsArray[i].id) {
          console.log("favedetector?", suggestionsArray[i]);
          return suggestionsArray[i];
        } else {
          return false;
        }
      }
    });
  }

  function buildBlacklist() {
    let currentUser = UserFactory.getUser();
    SuggestionsFactory.getBlacklist(currentUser).then(listData => {
      rejectsArray = rejectsArray.concat(listData);
      _.uniqWith(rejectsArray, _.isEqual);
    });
  }

  $scope.rejectSuggestion = () => {
    let newReject = $scope.currentSuggestion.id;
    rejectsArray.push(newReject);
    console.log("rejects ", rejectsArray);
    $scope.details = false;
  };

  $scope.blacklistSuggestion = (place_id, vicinity, locName) => {
    let currentUser = UserFactory.getUser();
    let neverObj = {
      name: locName,
      address: vicinity,
      place_id: place_id,
      uid: currentUser
    };
    SuggestionsFactory.addToBlacklist(neverObj).then(response => {
      $scope.showNewSuggestion();
    });
  };

  function checkSuggestions() {
    rejectsArray.forEach(function(item) {
      for (let i = 0; i < suggestionsArray.length; i++) {
        if (item.place_id == suggestionsArray[i].id) {
          // console.log("what was cut?", suggestionsArray[i]);
          suggestionsArray.splice(i, i + 1);
        }
      }
    });
  }

  $scope.finishSession = place_id => {
    $window.location.href = `#!/done/${place_id}`;
  };

  $scope.saveForLater = (place_id, vicinity, locName) => {
    let currentUser = UserFactory.getUser();
    let laterObj = {
      name: locName,
      address: vicinity,
      place_id: place_id,
      uid: currentUser
    };
    SuggestionsFactory.addToEatLater(laterObj).then(response => {
      $scope.showNewSuggestion();
    });
  };
});
