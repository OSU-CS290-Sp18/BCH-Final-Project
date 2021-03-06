var path = require('path');
var express = require('express');
var exphbs  = require('express-handlebars');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;

var mongoHost = process.env.MONGO_HOST;
var mongoPort = process.env.MONGO_PORT || '27017';
var mongoUsername = process.env.MONGO_USERNAME;
var mongoPassword = process.env.MONGO_PASSWORD;
var mongoDBName = process.env.MONGO_DB_NAME;

var mongoURL = "mongodb://" + mongoUsername + ":" + mongoPassword + "@" + mongoHost + ":" + mongoPort + "/" + mongoDBName;
console.log(mongoURL);
var mongoDB = null;
 
var app = express();
var port = process.env.PORT || 4721;
app.engine('handlebars', exphbs({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(express.static('public'));


app.get('/', function(req, res, next) {
  res.status(200).render('home');

});

app.get('/:designator', function (req, res, next) {
    var designator = req.params.designator.toLowerCase();
    var collections = ['ships', 'subs', 'planes'];
    var a = collections.indexOf(designator);
        if (a == -1) {
            //res.status(500).send("Error fetching designator from DB.");
            next();
        }
        else {
            var itemCollection = mongoDB.collection(designator);
            itemCollection.find().toArray(function (err, items) {
                if (err) {
                    //res.status(500).send("Error fetching designator from DB.");
                } else {
                    res.status(200).render('singlePage', {
                        designator: designator,
                        items: items
                    });
                }
            });
        }
});


app.post('/:designator/addItem', function (req, res, next) {

    var designator = req.params.designator.toLowerCase();
    if (req.body && req.body.description && req.body.photoURL && req.body.tags) {
        var item = {
            description: req.body.description,
            photoURL: req.body.photoURL,
            tags: req.body.tags.split(" ")
        };

        var itemCollection = mongoDB.collection(designator);
        itemCollection.insertOne({
		photoURL: req.body.photoURL, 
		description: req.body.description, 
		tags: req.body.tags.split(" ")
	});
        console.log("== mongo insert result:");
        res.status(200).end();
    }
    else {
        res.status(400).send("Request needs a JSON body with photoURL, description, and caption.");
    }
});


app.get('*', function (req, res) {
  res.status(404).render('404');
});


MongoClient.connect(mongoURL, function (err, client) {
    if (err) {
        throw err;
    }
    mongoDB = client.db(mongoDBName);
    app.listen(port, function () {

        console.log("== Server listening on port", port);

    });

});
