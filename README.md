# HANGRR

This is a front-end capstone project for Nashville Software School, to demonstrate understanding of the basic principles of front-end technologies and skills after 3 months of training.  
Since I frequently suffer from indecision coupled with too many choices at hungry times, I decided to make an app that would give me suggestions at random which I could reject one by one until I reached something I would like.  
Built with AngularJS and styled with Bootstrap 4, Hangrr geolocates the user with HTML5, then leverages the Google Places API to find and suggest nearby, currently-open restaurants at random. If the user is logged in, the app filters out a Firebase-saved list of user blacklisted items and pushes user's "try-later" saved locations to the top of the suggestion array.
The app is deployed here: https://whereshouldweeat-369b9.firebaseapp.com

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

I use http-server (https://www.npmjs.com/package/http-server) to run front-end code.  I suggest a global install if you haven't already. Otherwise, you can server it as you prefer.

To run this code on your own machine, you will need to create a Firebase account and save your own authentication specs. Mine are not pushed up. Go to `https://console.firebase.google.com` and create a project, then click 'Add firebase to your web app'  

You should also get an API key from Google Dashboard to use with the API, as my API keys are not pushed up. 
- Go to `https://console.cloud.google.com/home/dashboard` and create a project there, where you can generate API keys

 - to plug directly in to the existing code, you can create the file `/app/values/googleCreds.js`
and insert the following code:
```
eatsApp.constant("GoogleCreds", {
    PlacesApiKey: "YOUR-GOOGGLE-API-KEY-FOR-PLACES",
    DirectionsApiKey: "YOUR-GOOGLE-API-KEY-FOR-DIRECTIONS"
});
```
- then do the same with `/app/values/FBCreds.js`
and insert
```
eatsApp.constant("FBCreds", {
    apiKey: "YOUR-FB-API-KEY",
    authDomain: "YOUR-AUTHDOMAIN"
});
```
  

### Installing

Once you have pulled down the repo, running `npm install` will get you:
 - Grunt (compiles the sass into css)
 - JShint (will keep your js on point)
 - Angular and Angular-Route (will allow the ng-stuff to run)
 - Bootstrap 4 (and font-awesome, will support the design)
 - jQuery (drives some of the functionality)
 - Lodash (some key js methods)
 - Firebase (helps with authentication)
 
 ## Run the tests
 Once you have a copy of the project environment, run http-server in your terminal and navigate to localhost:8080.
  - Try the app as a 'guest' user
  - Try the app as a logged in user. 
  - Try saving a place "for later"
  - Try rejecting a place for "never"
  - Look at your blacklist and saved lists
  - Try changing your search radius (note that the search radius is an actual circle, and does not account for the winding of roads)
  

## Built With

* [AngularJS](https://angularjs.org/) - The framework used
* [Google Places API](https://developers.google.com/places/) - Data source
* [Bootstrap 4](https://v4-alpha.getbootstrap.com/) - For layout and styling
* [Firebase](https://firebase.google.com/) - For data storage

## Authors

* Emily Lemmon

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Thank you to Joe, Greg, and Steven for their help, as well as Cohort 20 students for feedback and input
* Grateful also for all the resources at stackoverflow
