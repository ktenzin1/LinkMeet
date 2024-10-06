// models/User.js
const AWS = require('aws-sdk');

AWS.config.update({
    region: 'us-east-1', // Choose your desired region
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const docClient = new AWS.DynamoDB.DocumentClient();


// Create a new user
const createUser = async (username, email, hashedPassword, skills) => {
    const params = {
        TableName: 'Users',
        Item: {
            username: username,
            email: email,
            password: hashedPassword,
            skills: skills.split(',').map(skill => skill.trim()),
            isLive: false // Default is not live when signing up
        }
    };
    await docClient.put(params).promise();
};

const getUser = async (email) => {
    const params = {
        TableName: 'Users',
        Key: { email: email } // Adjust this to use the email field
    };
    const data = await docClient.get(params).promise();
    return data.Item || null;
};

// Function to search professionals by skill
const searchProfessionalsBySkill = async (skill) => {
    const params = {
        TableName: 'Users',
        FilterExpression: 'contains (skills, :skill) AND isLive = :live',
        ExpressionAttributeValues: { ':skill': skill, ':live': true }
    };
    const data = await docClient.scan(params).promise();
    return data.Items;
};

module.exports = { createUser, getUser, searchProfessionalsBySkill };
