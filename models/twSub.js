/**
 * Created by antonorlov on 18/03/16.
 */
var mongoose = require('mongoose');

var tweetSubSchema = new mongoose.Schema({
    id_str: String,
    name: String,
    screen_name: String
});

module.exports = mongoose.model('TweetSub', tweetSubSchema);