const { BigQuery } = require("@google-cloud/bigquery");
const config = require('../config.js');
const bigquery = new BigQuery();
const fs = require('fs');

async function provisionDB(dataSetObj) {
    if (dataSetObj === null)
        return;
    return new Promise(function (resolve, reject) {
        if (dataSetObj.newDataSet === false) {
            resolve('Successfully provisioned DB -- already')
            return;
        }
        createDataSet(dataSetObj.dataSetName).then((dataSetResponse) => {
            console.log('dataSetResponse ', dataSetResponse);
            createTables(dataSetObj.dataSetName).then((tablesResponse) => {
                console.log('tablesResponse ', tablesResponse);
                resolve('Successfully provisioned DB');
            }).catch(function (error) {
                console.log('Error provisioning tables ', error);
                reject({ "error": "Error Provisioning tables " });
            });
        }).catch(function (error) {
            console.log('Error provisioning DB ', error);
            reject({ "error": error.message });
        })
    })

}

async function createDataSet(dataSetName) {

    const options = {
        location: 'US',
    };

    console.log('dataSetName -- ', dataSetName);
    //    Create a new dataset
    const [dataset] = await bigquery.createDataset(dataSetName, options);
    const dataSetId = dataset.id;
    console.log(`Dataset ${dataSetId} created.`);

}

async function createTables(datasetId) {
    //create tables
    const tweets_schema = fs.readFileSync('./schema/tweets.json');
    const [tweets_table] = await bigquery.dataset(datasetId).createTable(config.bq.table.tweets, { schema: JSON.parse(tweets_schema), location: 'US' });
    console.log(`Table ${tweets_table.id} created.`);

    const users_schema = fs.readFileSync('./schema/users.json');
    const [users_table] = await bigquery.dataset(datasetId).createTable(config.bq.table.users, { schema: JSON.parse(users_schema), location: 'US' });
    console.log(`Table ${users_table.id} created.`);

    const media_schema = fs.readFileSync('./schema/media.json');
    const [media_table] = await bigquery.dataset(datasetId).createTable(config.bq.table.media, { schema: JSON.parse(media_schema), location: 'US' });
    console.log(`Table ${media_table.id} created.`);
}

module.exports = { provisionDB };
