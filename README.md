# How should I execute this toolkit?

Ensure you have the Google Cloud account, Twitter developer account, and Twitter API bearer token

## Step One: Install the Tweet loader application

1. Access Google Cloud console and launch the “Cloud Shell”. Ensure you are on the right Google Cloud Project
2. At the command prompt, download the code for the toolkit by executing the command: 

	`git clone https://github.com/twitterdev/gcloud-toolkit-recent-search`
3. Navigate to the source code folder:

	`cd gcloud-toolkit-recent-search/`
4. Make changes to the configuration file. Use your favorite editor, something like vi or emacs

	`vi config.js` 
    
	```Edit line #3 in config.js by inserting the Twitter API bearer token (ensure the word ‘Bearer’ must be appended before the token with a space```
    
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

## Step Two: Load the Tweets with the CURL command

1. Get the URL endpoint of the deployed Tweet loader application
2. Execute the below CURL command with the URL from step #1 and append it with the URL path “/search”

```You might need to change the dates to within recent 7 days```

```
curl -d '{
    "recentSearch" : {
        "query" : "jack in the box",
        "maxResults" : 100,
        "startTime" : "2021-12-06T17:00:00.00Z",
        "endTime" : "2021-12-07T17:00:00.00Z",
        "category" : "Quick Service Restaurants",
        "subCategory" : "Jack in the box"
    },
    "dataSet" : {
        "newDataSet" : true,
        "dataSetName" : "test10"    
    }
}' -H 'Content-Type: application/json' https://<<Tweet loader URL>>.appspot.com/search
```
