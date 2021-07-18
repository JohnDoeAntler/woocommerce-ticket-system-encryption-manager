export const toResponse = (statusCode: number, status: string, message: any) => {
	return {
		statusCode,
		body: JSON.stringify({
			status,
			message,
		}),
	};
}