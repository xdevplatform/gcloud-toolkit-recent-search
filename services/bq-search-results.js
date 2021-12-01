const { BigQuery } = require("@google-cloud/bigquery");
const config = require('../config.js');

async function insertRowsAsStream(datasetId, tableId, rows) {
  const bigqueryClient = new BigQuery();
  // Insert data into a table
  try {
    const result = await new Promise((resolve, reject) => {
      bigqueryClient
        .dataset(datasetId)
        .table(tableId)
        .insert(rows)
        .then((results) => {
          console.log(`Inserted ${rows.length} rows into ${tableId} for dataset ${datasetId}`);
          resolve(rows);
        })
        .catch((err) => {
          reject(err);
        });
    });
  } catch (error) {
    console.log("----BQ JSON Error --- \n ", JSON.stringify(error), "\n");
    throw new Error(error);
  }
}

async function insertTweets(data, reqBody) {
  var resultRows = [];
  data.forEach(function (tweet, index) {
    //console.log('FAS Response -- ', tweet);
    if (tweet) {
      var cDate = new Date(tweet.created_at);
      if( tweet.context_annotations === undefined)
        tweet.context_annotations = [];
      if( tweet.referenced_tweets === undefined)
        tweet.referenced_tweets = [];
      let row = {
        id: tweet.id,
        text: tweet.text,
        category: reqBody.recentSearch.category,
        subcategory: reqBody.recentSearch.subCategory,
        source: tweet.source,
        author_id: tweet.author_id,
        conversation_id: tweet.conversation_id,
        created_at: BigQuery.datetime(cDate.toISOString()),
        lang: tweet.lang,
        in_reply_to_user_id: tweet.in_reply_to_user_id,
        possibly_sensitive: tweet.possibly_sensitive,
        entities: tweet.entities,
        public_metrics: tweet.public_metrics,
        referenced_tweets: tweet.referenced_tweets,
        geo: tweet.geo,
        context_annotations: tweet.context_annotations,
        withheld: tweet.withheld,
        tweet_url: 'http://twitter.com/twitter/status/'+tweet.id
      };
      resultRows.push(row);
    }
  });
  // insert Tweets
  insertRowsAsStream(reqBody.dataSet.dataSetName, config.bq.table.tweets, resultRows);

}

async function insertUsers(users, reqBody) {
  var resultRows = [];
  users.forEach(function (user, index) {
    if(user)  {
      var cDate = new Date(user.created_at);
      let row = {
        id: user.id,
        name: user.name,
        username: user.username,
        created_at: BigQuery.datetime(cDate.toISOString()),
        description: user.description,
        entities: user.entities,
        location: user.location,
        pinned_tweet_id: user.pinned_tweet_id,
        profile_image_url: user.profile_image_url,
        protected: user.protected,
        public_metrics: user.public_metrics,
        url: user.url,
        verified: user.verified,
        withheld: user.withheld,
        category: reqBody.recentSearch.category,
        subcategory: reqBody.recentSearch.subCategory
      };
      resultRows.push(row);
    }

  
  });
  insertRowsAsStream(reqBody.dataSet.dataSetName, config.bq.table.users, resultRows);
}

async function insertMedia(medias, reqBody) {
  var resultRows = [];
  medias.forEach(function (media, index) {
    if(media)  {
      let row = {
        media_key: media.media_key,
        type: media.type,
        duration_ms: media.duration_ms,
        public_metrics: media.public_metrics,
        height: media.height,
        preview_image_url: media.preview_image_url,
        width: media.width,
        alt_text: media.alt_text,
        category: reqBody.recentSearch.category,
        subcategory: reqBody.recentSearch.subCategory
      };
      resultRows.push(row);
    }

  
  });
  insertRowsAsStream(reqBody.dataSet.dataSetName, config.bq.table.media, resultRows);
}

async function insertSearchResults(results, reqBody) {
  let data = results.data;
  if( data != undefined)
    insertTweets(data, reqBody);
  let users = results.includes.users;
  if( users != undefined)
    insertUsers(users, reqBody);
  let media = results.includes.media;
  if( media != undefined)
    insertMedia(media, reqBody);
}

module.exports = { insertSearchResults };
