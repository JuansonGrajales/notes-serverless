import * as uuid from "uuid";
import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

// Dynamo Table is in different region from lambda
// AWS.config.update({ region: "us-west-2"});

// DocumentClent will automatically unmarshal the DynamoDB data-type model into a more native-feeling javascript object
// Eliminating Data Type Descriptors like "S" and "N"
// const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const main = handler(async (event, context) => {
    const data = JSON.parse(event.body);
    const params = {
      TableName: process.env.tableName,
      Item: {
        // The attributes of the item to be created

        userId: event.requestContext.identity.cognitoIdentityId, // The id of the author
        noteId: uuid.v1(), // A unique uuid
        content: data.content, // Parsed from request body
        attachment: data.attachment, // Parsed from request body
        createdAt: Date.now(), // Current Unix timestamp
      },
    };

    await dynamoDb.put(params);
    return params.Item;
  });