import { APIGatewayProxyHandler } from "aws-lambda";
import { db, TABLE_NAME } from "../utils/db";
import { toResponse } from "../utils/response";
import { AUTH_KEY, generateKeyPair } from "../utils/key";
import { v4 as uuid } from 'uuid';

/**
 * 
 * id: UUID
 * name: string
 * 
 * publicVey: string
 * privateKey: string
 * 
 * expiredAt: timestamp
 * createdAt: timestamp
 * updatedAt: timestamp
 * 
 */

interface GenerateRequestDTO {
	name: string;
}

export const generate: APIGatewayProxyHandler = async (event) => {
	if (event.headers.Authorization != AUTH_KEY) {
		return toResponse(405, 'fail', 'unauthorized.')
	}

	if (!event.body) {
		return toResponse(400, 'fail', 'missing body.');
	}

	const json: GenerateRequestDTO = JSON.parse(event.body);

	if (!json.name) {
		return toResponse(400, 'fail', 'missing fields.');
	}

	const id = uuid();
	const name = json.name;
	const { privateKey, publicKey } = generateKeyPair();
	const createdAt = Date.now();
	const updatedAt = Date.now();
	const expiredAt = Date.now() + 365 * 24 * 60 * 60 * 1000;

	await db.put({
		TableName: TABLE_NAME,
		Item: {
			id,
			name,
			privateKey,
			publicKey,
			createdAt,
			updatedAt,
			expiredAt,
		}
	}).promise();

	return toResponse(200, 'success', 'OK');
}