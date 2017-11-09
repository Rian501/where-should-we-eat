# HANGRR

This is a front-end capstone project for Nashville Software School, to demonstrate understanding of the basic principles of front-end technologies and skills after 3 months of training.  
Since I frequently suffer from indecision coupled with too many choices at hungry times, I decided to make an app that would give me suggestions at random which I could reject one by one until I reached something I would like.  
Built with AngularJS and styled with Bootstrap 4, Hangrr geolocates the user with HTML5, then leverages the Google Places API to find and suggest nearby, currently-open restaurants at random. If the user is logged in, the app filters out a Firebase-saved list of user blacklisted items and pushes user's "try-later" saved locations to the top of the suggestion array.
The app is deployed here: https://whereshouldweeat-369b9.firebaseapp.com

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

To run this code on your own machine, you will need to create a Firebase account and save your own authentication specs. Mine are not pushed up.

Once you have pulled down the repo, running `npm install` will get you:
 - Grunt
 - JShint
 - Angular and Angular-Route
 - Bootstrap 4 (with font-awesome)
 - jQuery
 - Lodash
 - Firebase

## Built With

* [AngularJS](https://angularjs.org/) - The framework used
* [Google Places API](https://developers.google.com/places/) - Data source
* [Bootstrap 4](https://v4-alpha.getbootstrap.com/) - For layout and styling
* [Firebase] (https://firebase.google.com/) - For data storage

## Authors

* **Emily Lemmon** - *Initial work* - [PurpleBooth](https://github.com/PurpleBooth)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Thank you to Joe, Greg, and Steven for their help, as well as Cohort 20 students for feedback and input
* Grateful also for all the resources at stackoverflow
