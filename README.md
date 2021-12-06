Developer Guide: Twitter API toolkit for Google Cloud

FAQ

I don’t have a lot of time: 15 mins is all you need

If you can spare 15 mins, please proceed. You will learn the basics about Twitter API and possibly find ways to monetize Twitter data. As a side benefit, you will also learn about Google Cloud, Analytics, and the foundations of data science
Prerequisites: As a developer what do I need to execute this toolkit?

How should I execute this toolkit?

Ensure you have the Google Cloud service account JSON key and Twitter API bearer token
Access Google Cloud console and launch the “Cloud Shell”
At the command prompt, download the code for the toolkit by executing the command: 
git clone https://github.com/twitterdev/gcloud-toolkit-recent-search
Navigate to the source code folder:
cd gcloud-toolkit-recent-search/
 
Make changes to the configuration file. Use your favorite editor, something like vi or emacs
		vi config.js 
Edit line #3 in config.js by inserting the Twitter API bearer token (ensure the word ‘Bearer’ must be appended before the token with a space
Edit line#4 in config.js by inserting the Google Cloud project id
Deploy the code in AppEngine by executing the below command

		gcloud app deploy
Authorize the command
Choose a region for deployment like (18 for USEast1)
Accept the default config with Y
