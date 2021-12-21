# Developer Guide: Twitter API toolkit for Google Cloud (BETA)

## Why Twitter API toolkit for Google Cloud?

- Process, analyze and visualize massive amounts of Tweets (millions of Tweets and the design is scalable to billions of Tweets)
- Automates the data pipeline process to ingest Tweets into Google Cloud
- Use this toolkit to find impactful Tweets to your use case quickly 
- Visualization of Tweets, slicing and dicing with Tweet metadata


## I don’t have a lot of time: 30 mins is all you need

If you can spare 30 mins, please proceed. You will learn the basics about Twitter API and possibly find ways to monetize Twitter data. As a side benefit, you will also learn about Google Cloud, Analytics, and the foundations of data science

## Prerequisites: As a developer what do I need to execute this toolkit?

* Twitter Developer account [Sign up here](https://developer.twitter.com/en/apply-for-access)
* How to get a Twitter API bearer token? [Refer this](https://developer.twitter.com/en/docs/authentication/oauth-2-0/bearer-tokens)
* A Google Cloud Account [Sign up here](https://www.google.com/aclk?sa=l&ai=DChcSEwjq8LzG8c_0AhUXE9QBHUQBC9QYABADGgJvYQ&sig=AOD64_2epUp76ekL53Vngr8B5cAjNAIaCQ&nis=1&ved=2ahUKEwjAubPG8c_0AhX5mGoFHdnPBMcQqyQoAHoECAMQBw&adurl=)

## What Cloud Services this toolkit will leverage and what are the costs?

- This toolkit requires a Twitter API account that is free to signup for an essential access. Essential access allows 500K Tweets/month
- This toolkit leverages Google BigQuery, App Engine and DataStudio. You can do a lot with the $300 credit from Google. For processing 500K Tweets/month anticipated billing cost with this toolkit for Google Cloud would be ~$30/month. However, we recommend to disable the App Engine when not in use or delete the Google project. 

## Give me the big picture

![A Developer's interaction with the toolkit](https://github.com/twitterdev/gcloud-toolkit-recent-search/blob/main/resources/architecture.jpg)

## How should I execute this toolkit? [Video tutorial](https://drive.google.com/file/d/1rLpN_vLXe9csrRSKjIV_LtcKcNuYfPtG/view?usp=sharing)

Ensure you have the Google Cloud account, Twitter developer account, and Twitter API bearer token

### Optional Step: If you prefer to manually load the Tweets with a JSON file and visualize the Tweets, follow the video tutorials
1. [Manually load the Tweets](http://google.com)
2. [Visulaize the Tweets with DataStudio](https://drive.google.com/file/d/1FLVBzGESgPvcE00uY9CGFRxuw5o4XAgN/view?usp=sharing)

### Step One: Install the Tweet loader application

1. Access Google Cloud console and launch the “Cloud Shell”. Ensure you are on the right Google Cloud Project
2. At the command prompt, download the code for the toolkit by executing the command: 

	`git clone https://github.com/twitterdev/gcloud-toolkit-recent-search`
3. Navigate to the source code folder:

	`cd gcloud-toolkit-recent-search/`
4. Make changes to the configuration file. Use your favorite editor, something like vi or emacs

	`vi config.js` 
    
	```Edit line #3 in config.js by inserting the Twitter API bearer token (ensure the word ‘Bearer’ must be prepended before the token with a space```
    
	```Edit line#4 in config.js by inserting the Google Cloud project id```

5. Set the Google Project ID

	`gcloud config set project <<PROJECT_ID>>`
    
6. Deploy the code in AppEngine by executing the below command:

	`gcloud app deploy`
    
        Authorize the command
        Choose a region for deployment like (18 for USEast1)
        Accept the default config with Y
        
7. After the deployment, get the URL endpoint for the deployed application with the command:
    `gcloud app browse`
    
    Enable BigQuery API
    `gcloud services enable bigquery.googleapis.com`

### Step Two: Load the Tweets with the CURL command

1. Get the URL endpoint of the deployed Tweet loader application by executing the below command in the Cloud shell

`gcloud app browse`

![Tweet loader - high level design](https://github.com/twitterdev/gcloud-toolkit-recent-search/blob/main/resources/tweet-loader-design.jpg)

2. Execute the below CURL command with the URL from step #1 and append it with the URL path “/search”

```You might need to change the dates to within recent 7 days```

```
curl -d '{
    "recentSearch" : {
        "query" : "Apple AirTag or AirTag",
        "maxResults" : 100,
        "startTime" : "2021-12-06T17:00:00.00Z",
        "endTime" : "2021-12-07T17:00:00.00Z",
        "category" : "Tracking Devices",
        "subCategory" : "Wireless Gadgets"
    },
    "dataSet" : {
        "newDataSet" : true,
        "dataSetName" : "Gadgets"    
    }
}' -H 'Content-Type: application/json' https://<<Tweet loader URL>>.appspot.com/search
```

* Tweet loader parameters
	- "recentSearch/query" : Twitter [Recent Search](https://developer.twitter.com/en/docs/twitter-api/tweets/search/introduction) compliant query
	- "recentSearch/maxResults" : The maximum number of Tweets per API call. The max limit is 100. If search query results in more than 100 Tweets, the Tweet loader will automatically paginate the API result set and persist the Tweets. If the search result is more than 500K, you will get rate limiting errors. If you have Twitter API elevated access, more than 500K Tweets can be persisted.
	- "recentSearch/startTime" and "recentSearch/endTime" : ISO 8601/RFC3339 YYYY-MM-DDTHH:mm:ssZ. The startTime must be within the recent 7 days. The startTime must not be greater than the endTime.
	-  "recentSearch/category" and "recentSearch/subCategory" : These are discriminators that can be used to tag the Tweet loader queries with a unique name. These tags can be used in the reporting to filter data based on the Tweet loader queries.
	-  "dataSet/newDataSet" : When set to "true", a new dataset is created in BigQuery. If you want to append Tweet loader results to the same dataset set this to "false"
	-  "dataSet/dataSetName" : An unique name for the database. For example "Games_2021"

### Step Three: Visualize the Tweets in Google DataStudio

[Follow this video tutorial](https://drive.google.com/file/d/1FLVBzGESgPvcE00uY9CGFRxuw5o4XAgN/view?usp=sharing)

### Step Four: Optional - Delete the project to avoid any overage costs
`gcloud projects delete <<PROJECT_ID>>`
