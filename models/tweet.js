/**
 * Created by orel- on 31/Jan/16.
 */
var mongoose = require('mongoose');
var moment = require('moment');

var tweetSchema = new mongoose.Schema({
    id_str: String,
    user: {
        id_str: {type: String, default: ''},
        name: {type: String, default: 'Tweet Author'},
        screen_name: {type: String, default: 'tweetAuthor'}
    },
    entities: mongoose.Schema.Types.Mixed,
    text: {type: String, default: 'tweet text'},
    retweet_count:  {type: Number, default: '0'},
    favorite_count: {type: Number, default: '0'},
    added: {type: Number, default: '145825842781'}
});

module.exports = mongoose.model('Tweet', tweetSchema);