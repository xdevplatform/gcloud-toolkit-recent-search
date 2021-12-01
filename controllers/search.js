const express = require("express");
const fs = require('fs');
const axios = require("axios").default;
const axiosRetry = require("axios-retry");
const config = require('../config.js');
const bq_persist = require('.././services/bq-search-results.js');
const bq_dataset = require('.././services/bq-dataset.js');
// const utils = require('.././services/utils.js');

var ruleCategory;
axiosRetry(axios, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  shouldResetTimeout: true,
  retryCondition: (axiosError) => {
    return true;
  },
});

const router = express.Router();

router.get("/", function (req, res) {
  res.send("Twitter V2 API Recent Search Application");
});

router.post("/", function (req, res) {
  bq_dataset.provisionDB(req.body.dataSet).then(function (status) {
    console.log('DB provisioning status ', status);
    if (status != null && status.includes('Successfully provisioned')) {
      recentSearch(req.body);
      res.send("Twitter V2 API Recent Search Application");
    } 
  })
  .catch(function(error)  {
    console.log('ERROR ',error);
    res.send(error);
  })
});

async function recentSearch(reqBody, nextToken) {
  // validate requestBody before Search
  var rcntSearch = reqBody.recentSearch;
  let query = config.recent_search_url + '&query=' + rcntSearch.query + '&max_results=' + rcntSearch.maxResults;
  if (nextToken != undefined && nextToken != null)
    query = query + '&next_token=' + nextToken;
  if (rcntSearch.startTime != undefined && rcntSearch.startTime != null)
    query = query + '&start_time=' + rcntSearch.startTime;
  if (rcntSearch.endTime != undefined && rcntSearch.endTime != null)
    query = query + '&end_time=' + rcntSearch.endTime;
  console.log('Recent search query : ', query);
  return new Promise(function (resolve, reject) {
    let userConfig = {
      method: 'get',
      url: query,
      headers: { 'Authorization': config.twitter_bearer_token }
    };
    axios(userConfig)
      .then(function (response) {
        if (response.data.data != null) {
          //console.log('response --',response.data);
          bq_persist.insertSearchResults(response.data, reqBody);
        }
        if (response.data.meta != undefined && response.data.meta.next_token != undefined) {
          recentSearch(reqBody, response.data.meta.next_token);
        }
        resolve('Recent Search results are persisted in database');
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

module.exports = router;
