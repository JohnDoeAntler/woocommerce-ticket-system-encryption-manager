import { APIGatewayProxyHandler } from 'aws-lambda';
import { db, TABLE_NAME } from '../utils/db';
import { toResponse } from '../utils/response';

export const auth: APIGatewayProxyHandler = async (event) => {
	if (!event.body) {
		return toResponse(400, 'fail', 'body not found.');
	}

	const json = JSON.parse(event.body);

	if (!json.id) {
		return toResponse(400, 'fail', 'missing api key.');
	}

	const record = await db.get({
		TableName: TABLE_NAME,
		Key: {
			id: json.id,
		}
	}).promise();

	if (!record.Item) {
		return toResponse(400, 'fail', 'unauthorized.');
	}

	const { privateKey, publicKey, ...result } = record.Item;

	return toResponse(200, 'success', result);
}