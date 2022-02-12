require("dotenv").config();
const { FIRESTORE_API_KEY } = process.env;

exports.handler = async (event, context) => {
	const body = {
		apiKey: FIRESTORE_API_KEY,
	};

	return {
		statusCode: 200,
		body: JSON.stringify(body),
	};
};
