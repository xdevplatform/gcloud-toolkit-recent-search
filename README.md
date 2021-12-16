# Developer Guide: Twitter API toolkit for Google Cloud (BETA)

## Why Twitter API toolkit for Google Cloud?

- Process, analyze and visualize massive amounts of Tweets (millions of Tweets and the design is scalable to billions of Tweets)
- Automates the data pipeline process to ingest Tweets into Google Cloud
- Use this toolkit to find impactful Tweets to your use case quickly (~15 minutes)
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
    
4. Deploy the code in AppEngine by executing the below command:

	`gcloud app deploy`
    
        Authorize the command
        Choose a region for deployment like (18 for USEast1)
        Accept the default config with Y
        
5. After the deployment, get the URL endpoint for the deployed application with the command:
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

### Step Three: Visualize the Tweets in Google DataStudio

[Follow this video tutorial](https://drive.google.com/file/d/1FLVBzGESgPvcE00uY9CGFRxuw5o4XAgN/view?usp=sharing)

### Step Four: Optional - Delete the project to avoid any overage costs
`gcloud projects delete <<PROJECT_ID>>`
