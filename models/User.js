// models/User.js
const AWS = require('aws-sdk');

AWS.config.update({
    region: 'us-east-1', // Choose your desired region
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const docClient = new AWS.DynamoDB.DocumentClient();

const createUser = async (username, passwordHash) => {
    const params = {
        TableName: 'Users',
        Item: {
            username: username,
            password: passwordHash,
        }
    };
    await docClient.put(params).promise();
};

const getUser = async (username) => {
    const params = {
        TableName: 'Users',
        Key: { username: username }
    };
    const data = await docClient.get(params).promise();
    return data.Item || null;
};

module.exports = { createUser, getUser };
