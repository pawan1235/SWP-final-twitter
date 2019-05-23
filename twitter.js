const Twit = require("twit");
const moment = require("moment");
const db = require("./database");

var T = new Twit({
  consumer_key: process.env.API_KEY,
  consumer_secret: process.env.API_SECRET_KEY,
  access_token: process.env.TOKEN_KEY,
  access_token_secret: process.env.TOKEN_SECRET_KEY
});

/**
 * Filter twiiter track, count number of tweet with the interesting track in each time
 * 
 * @param {String} track => name of the interesting track
 */
const status_filter = track => {
  try {
    var stream = T.stream("statuses/filter", { track: track });
    stream.on("tweet", async function(tweet) {
      await addFilterCount();
    });
  } catch (err) {
    console.log(err);
  }
};

/**
 * Add number of track that tweeted to json database
 */
const addFilterCount = async () => {
  const currentDB = await db.read();
  const currenttime = moment()
    .startOf("minute")
    .toISOString();
  const time = currentDB[currenttime] || 0;
  const output = await db.write(currenttime, time + 1);
  return output;
};


const location_trend = localtion_id => {
   var stream = T.stream("trends/place", { id: localtion_id });
   stream.on("tweet", async function(tweet) {
     console.log(tweet); 
   });
} 

module.exports = {
  status_filter,
  location_trend
};
