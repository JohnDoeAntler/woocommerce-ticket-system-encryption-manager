import { APIGatewayProxyHandler } from "aws-lambda";
import { db, TABLE_NAME } from "../utils/db";
import { AUTH_KEY } from "../utils/key";
import { toResponse } from "../utils/response";

export const list: APIGatewayProxyHandler = async (event) => {
	if (event.headers.Authorization != AUTH_KEY) {
		return toResponse(405, 'fail', 'unauthorized.')
	}

	const list = await db.scan({
		TableName: TABLE_NAME,
	}).promise();

	const filtered = list.Items?.map(e => {
		const { privateKey, publicKey, ...rest } = e;
		return rest;
	}) || [];

	return toResponse(200, 'success', filtered);
}