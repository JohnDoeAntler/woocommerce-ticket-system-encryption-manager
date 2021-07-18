import { APIGatewayProxyHandler } from 'aws-lambda';
import NodeRSA from 'node-rsa';
import { db, TABLE_NAME } from '../utils/db';
import { toResponse } from '../utils/response';

export const decrypt: APIGatewayProxyHandler = async (event) => {
	const id = event.pathParameters?.id;

	const record = await db.get({
		TableName: TABLE_NAME,
		Key: {
			id,
		}
	}).promise();

	if (!event.body) {
		return toResponse(400, 'fail', 'missing body.');
	}

	if (!record.Item) {
		return toResponse(400, 'fail', 'record not found.');
	}

	const json = JSON.parse(event.body);
	const encrypted = json.hash;

	if (!encrypted) {
		return toResponse(400, 'fail', 'fields not found.');
	}

	const key = new NodeRSA(record.Item.privateKey);
	const args = key.decrypt(encrypted, 'utf8').split(':');


	return {
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'POST',
			'Access-Control-Allow-Credentials': true,
		},
		...toResponse(200, 'success', {
			email: args.shift(),
			phone: args.join(':'),
		}),
	};
}