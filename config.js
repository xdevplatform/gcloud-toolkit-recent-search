var config = {};

config.twitter_bearer_token = 'Bearer <<INSERT YOUR BEARER TOKEN>>'
config.gcp_projectId = '<<GCP PROJECT ID>>'
config.PORT = 4050;
config.recent_search_url = 'https://api.twitter.com/2/tweets/search/recent?tweet.fields=id,text,attachments,author_id,context_annotations,conversation_id,created_at,entities,geo,in_reply_to_user_id,lang,possibly_sensitive,public_metrics,referenced_tweets,reply_settings,source,withheld&expansions=author_id,referenced_tweets.id,in_reply_to_user_id,attachments.media_keys,attachments.poll_ids,geo.place_id,entities.mentions.username,referenced_tweets.id.author_id&media.fields=media_key,type,duration_ms,height,preview_image_url,public_metrics,width,alt_text&place.fields=contained_within,country,country_code,full_name,geo,id,name,place_type&poll.fields=duration_minutes,end_datetime,id,options,voting_status&user.fields=created_at,description,entities,id,location,name,pinned_tweet_id,profile_image_url,protected,public_metrics,url,username,verified,withheld'

config.bq = {}
config.bq.table = {
  "tweets" : "tweets",
  "users" : "users",
  "media" : "media"
}

module.exports = config;
