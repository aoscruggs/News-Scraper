var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
// Requiring our Note and Article models
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");
// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

//initialize express
 var app = express();

 //use morgan and body parser with the app

app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));


// Make public a static dir
app.use(express.static("public"));

// Database configuration with mongoose
mongoose.connect("mongodb://localhost/newsscraper");
var db = mongoose.connection;
// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});
// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});



//Tell the console log what server.js does
console.log("\n************************\n" +
	"Grabbing every major story\n" +
	"from Cleveland Scene's site:" + 
	"\n************************\n");

//making a request call for Cleveland Scenes site
request("https://www.clevescene.com/", function(error, response, html) {
	/* load the HTML into cheerio and save to a variable 
	with $ as shorthand for a seclector*/
	var $ = cheerio.load(html);

	//create an empty array to hold the data
	var result = [];

	//With cheerio, find each H3 with class headline
	$("h3.headline").each(function(i, element) {
		// save the title
		var title = $(this).text();

		/* in the element, look for and 
		save any child elements and their href values*/
		var link = $(element).children().attr("href");

		//Push the results into the array above
		result.push({
			title:title,
			link:link
		});
	});
	// log the result
	console.log(result);
});