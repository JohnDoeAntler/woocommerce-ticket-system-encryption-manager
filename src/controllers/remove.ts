import { APIGatewayProxyHandler } from "aws-lambda";
import { db, TABLE_NAME } from "../utils/db";
import { AUTH_KEY } from "../utils/key";
import { toResponse } from "../utils/response";

export const remove: APIGatewayProxyHandler = async (event) => {
	if (event.headers.Authorization != AUTH_KEY) {
		return toResponse(405, 'fail', 'unauthorized.')
	}

	const id = event.pathParameters?.id;

	try {
		await db.delete({
			TableName: TABLE_NAME,
			Key: {
				id,
			}
		}).promise();

		return toResponse(200, 'success', 'OK');
	} catch(e) {
		return toResponse(400, 'fail', e)
	}
}