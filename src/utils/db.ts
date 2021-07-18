import { DynamoDB } from 'aws-sdk';

export const db = new DynamoDB.DocumentClient({
	region: 'ap-east-1'
});

export const TABLE_NAME = process.env.TABLE_NAME || "";
