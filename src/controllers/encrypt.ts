import { APIGatewayProxyHandler } from "aws-lambda";
import { db, TABLE_NAME } from "../utils/db";
import NodeRSA from 'node-rsa';
import { toResponse } from "../utils/response";

/**
 * 
 * id: UUID
 * 
 * public_key:
 * private_key:
 * 
 * expired_at:
 * created_at:
 * updated_at:
 * 
 */

export const encrypt: APIGatewayProxyHandler = async (event) => {
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

	try {
		const json = JSON.parse(event.body);
		const email = json.email;
		const phone = json.phone;

		if (!email || !phone) {
			return toResponse(400, 'fail', 'fields not found.');
		}

		const key = new NodeRSA(record.Item.publicKey);
		const encrypted = key.encrypt(email + ":" + phone, 'base64');

		return {
			...toResponse(200, 'success', {
				hash: encrypted,
			}),
		};
	} catch (e) {
		console.log(event.body)
		return toResponse(400, 'fail', 'invalid json format.');
	}
}