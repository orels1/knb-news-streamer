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
var twStream = {};
var streamState = false;

// DB
var mongoose = require('mongoose');
var Tweet = require('./models/tweet');
var TweetSub = require('./models/twSub');
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
app.set('port', process.env.PORT || 4000);
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

/**
 * POST /api/news/controls
 * Starts a twitter streaming process
 * */
app.post('/api/news/controls', function(req, res, next){

    //Get list of feeds to follow
    TweetSub
        .find({})
        .exec(function(err, twSub){
            if(err) return next(err);

            //If found - start streaming
            if(twSub){
                var follow = _.pluck(twSub, 'id_str');

                twClient.stream('statuses/filter', {follow: follow.toString()}, function(stream) {
                    res.status(200).send('Стриминг начат');
                    //Expose twitter stream
                    twStream = stream;
                    streamState = true;

                    //Send change in stream state to client
                    io.emit('news stream event', true);

                    stream.on('data', function(tweet) {
                        if(tweet.user) {
                            if (_.contains(follow, tweet.user.id_str)) {
                                var tweetItem = new Tweet({
                                    id_str: tweet.id_str,
                                    user: {
                                        id_str: tweet.user.id,
                                        name: tweet.user.name,
                                        screen_name: tweet.user.screen_name
                                    },
                                    entities: tweet.entities,
                                    text: tweet.text,
                                    retweet_count: tweet.retweet_count,
                                    favorite_count: tweet.favorite_count,
                                    added: parseInt(moment().utcOffset(3).format('x'))
                                });

                                tweetItem.save(function (err, tweet) {
                                    if (err) io.emit('news update error', err);

                                    io.emit('news update event', tweet);
                                })
                            }
                        }
                    });

                    stream.on('error', function(error) {
                        next(error);
                        streamState = false;

                        //Send change in stream state to client
                        io.emit('news stream event', false);
                    });
                });
            }else{
                //If not found - send error
                res.status(400).send("Добавьте подписки в настройках");
            }
        });
});

/**
 * DELETE /api/news/controls
 * Destroys (stops) current twitter stream
 * */
app.delete('/api/news/controls', function(req, res, next){
    twStream.destroy();
    streamState = false;

    //Send change in stream state to client
    io.emit('news stream event', false);

    res.status(200).send('Стриминг остановлен');
});

/**
 * GET /api/news/controls
 * Returns current stream state (true, false)
 * For manual check ONLY (!)
 * */
app.get('/api/news/controls', function(req, res, next){
    res.status(200).send(streamState);
});

/**
 * GET /api/news/latest
 * Gets 10 latest news items
 * */
app.get('/api/news/latest', function (req, res, next) {
    Tweet
        .find({})
        .limit(10)
        .sort({added: -1})
        .exec(function(err, news){
            if (err) return next(err);
            res.status(200).send(news);
        })
});

/**
 * GET /api/news/top
 * */
app.get('/api/news/top', function(req, res, next){
    var time = moment().format('x') - parseInt(req.query.time);

    Tweet
        .find({added: {$gt: time}})
        .sort({id_str: -1})
        .limit(100)
        .exec(function(err, tweets){
            if (err) return next(err);

            var reqIds = _.map(tweets, function(tweet){return tweet.id_str}).toString();

            twClient.get('statuses/lookup', {id: reqIds, include_entities: true}, function(err, tweets, response){
                if (err) return next(err);


                if(response.statusCode == 429){
                    console.log('No requests left');
                    res.status(429).send('Слишком много запросов');
                }else{
                    //Update db info
                    tweets.forEach(function(element, i){
                        Tweet
                            .update(
                                {id_str: element.id_str},
                                {
                                    $set:{
                                        favorite_count: element.favorite_count,
                                        retweet_count: element.retweet_count
                                    }
                                },
                                function(err){
                                    if(err) return next(err);
                                }
                            );
                    });
                    //Sort descending by retweets + likes
                    tweets = _.sortBy(tweets, function(tweet){return(-(tweet.retweet_count + tweet.favorite_count))});
                    res.status(200).send(tweets);
                }
            });
        });

});

/**
 * GET /api/subs/twitter
 * Returns list of current twitter feeds
 * */
app.get('/api/subs/twitter', function(req, res, next){
    TweetSub
        .find({})
        .exec(function(err, twSub){
            if (err) return next(err);

            res.status(200).send(twSub);
        });
});

/**
 * POST /api/subs/twitter
 * Adds new subId to collection
 * */
app.post('/api/subs/twitter', function(req, res, next){
    twClient.get('users/show', {screen_name: req.body.name}, function(err, user, response){
        if(response.statusCode == 429){
            console.log('No requests left');
            res.status(429).send('Слишком много запросов');
        }

        var twSub = new TweetSub({
            id_str: user.id_str,
            name: user.name,
            screen_name: user.screen_name
        });
        twSub.save(function(err, twSub){
            if(err) return next(err);
            res.status(200).send(twSub);
        });
    });

});

/**
 * DELETE /api/subs/twitter
 * Removes a sub from twitter feeds list
 * */
app.delete('/api/subs/twitter', function(req, res, next){
    TweetSub
        .findOne({_id: req.body.id})
        .exec(function(err, twSub){
            if(err) return next(err);

            twSub.remove(function(err){
                if(err) return next(err);
                res.status(200).end();
            })
        });
});

/**
 * GET /api/pipe
 * Pipes anything through the server */
app.get('/api/pipe', function(req, res, next){
    res.redirect('oauth2test://foo?access_token='+req.query.code);
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

