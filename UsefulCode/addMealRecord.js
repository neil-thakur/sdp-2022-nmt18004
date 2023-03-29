import AWS from 'aws-sdk';
import { DynamoDB } from 'aws-sdk';
const docClient = new DynamoDB.DocumentClient();


exports.handler = async function (event) {
    console.log('Received event:', JSON.stringify(event, null, 2));

    const { username, date, mealDetails } = JSON.parse(event.body);
    console.log('Parsed event:', username, date, mealDetails);

    const params = {
        TableName: 'MealTracker',
        Item: AWS.DynamoDB.Converter.marshall({
            username,
            date,
            mealDetails
        })
    };

    try {
        await docClient.put(params).promise();
        const responseBody = { message: 'Record added successfully' };
        const response = {
            statusCode: 200,
            headers: {
                "x-custom-header": "my custom header value"
            },
            body: JSON.stringify(responseBody)
        };
        console.log('Response:', JSON.stringify(response));
        return response;
    } catch (err) {
        const responseBody = { message: 'Error adding record: ' + err };
        const response = {
            statusCode: 500,
            headers: {
                "x-custom-header": "my custom header value"
            },
            body: JSON.stringify(responseBody)
        };
        console.error('Error:', JSON.stringify(response));
        return response;
    }
}