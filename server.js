/**
 * Created by orel- on 06/Dec/15.
 */

// Babel ES6/JSX Compiler
require('babel-core/register');

var async = require('async');
var request = require('request');
var xml2js = require('xml2js');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var moment = require('moment');
var CronJob = require('cron').CronJob;
moment.locale('ru');

//News feeds
var Twitter = require('twitter');

// DB
var mongoose = require('mongoose');
var Tweet = require('./models/tweet');
var config = require('./config');

var express = require('express');
var _ = require('underscore');

// APP
var swig  = require('swig');
var React = require('react');
var ReactDOM = require('react-dom/server');
var Router = require('react-router');
var routes = require('./app/routes');

var app = express();

// Connect to DB
mongoose.connect(config.database);
mongoose.connection.on('error', function() {
    console.info('Error: Could not connect to MongoDB. Did you forget to run `mongod`?');
});

// App Middleware
app.set('port', process.env.PORT || 80);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

/**
 * Socket.io stuff.
 */
var server = require('http').createServer(app);
var io = require('socket.io')(server);

io.sockets.on('connection', function(socket) {
    console.log('user connected');
});


server.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

// Create twitter client
var twClient = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

//Streaming test
app.get('/api/news/refresh', function(req, res, next){

    twClient.stream('statuses/filter', {follow: config.twFollow.toString()}, function(stream) {
        res.send('Started streaming');

        stream.on('data', function(tweet) {
            if(
                !tweet.delete &&
                (tweet.lang == 'en' || tweet.lang == 'ru') &&
                _.contains(config.twFollow, tweet.user.id)
            ) {
                io.emit('news update event', tweet);
                var tweet = new Tweet({
                    id_str: tweet.id_str,
                    user: {
                        id_str: tweet.user.id,
                        name: tweet.user.name,
                        screen_name: tweet.user.screen_name
                    },
                    entities: tweet.entities,
                    text: tweet.text,
                    retweet_count:  tweet.retweet_count,
                    favorite_count: tweet.favorite_count
                });

                tweet.save(function(err, tweet){
                    if(err) io.emit('news update error', err);
                })
            }
        });

        stream.on('error', function(error) {
            next(error);
        });
    });

});

/**
 * GET /api/news/latest
 * Gets 10 latest news items
 * */
app.get('/api/news/latest', function (req, res, next) {
    Tweet
        .find({})
        .limit(10)
        .exec(function(err, news){
            if (err) return next(err);
            res.status(200).send(news);
        })
});

/**
 * GET /api/news/top
 * */
app.get('/api/news/top', function(req, res, next){
    var time = moment().format('x') - req.query.time;

    Tweet
        .find({added: {$gt: time}})
        .exec(function(err, tweets){
            if (err) return next(err);

            var reqIds = _.map(tweets, function(tweet){return tweet.id_str}).toString();

            twClient.get('statuses/lookup', {id: reqIds, include_entities: true}, function(err, tweets, response){
                if (err) return next(err);


                if(response.statusCode == 429){
                    console.log('No requests left');
                    res.status(429).send('Слишком много запросов');
                }

                //Sort descending by retweets + likes
                tweets = _.sortBy(tweets, function(tweet){return(-(tweet.retweet_count + tweet.favorite_count))});
                res.status(200).send(tweets);
            });
        });

});


// React Middleware
app.use(function(req, res) {
    Router.match({ routes: routes.default, location: req.url }, function(err, redirectLocation, renderProps) {
        if (err) {
            res.status(500).send(err.message)
        } else if (redirectLocation) {
            res.status(302).redirect(redirectLocation.pathname + redirectLocation.search)
        } else if (renderProps) {
            var html = ReactDOM.renderToString(React.createElement(Router.RoutingContext, renderProps));
            var page = swig.renderFile('views/index.html', { html: html });
            res.status(200).send(page);
        } else {
            res.status(404).send('Page Not Found')
        }
    });
});

