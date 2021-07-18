import crypto from 'crypto';

export const AUTH_KEY = process.env.AUTH_KEY;

export const generateKeyPair = () => crypto.generateKeyPairSync('rsa', {
	modulusLength: 2048,
	publicKeyEncoding: {
		type: 'spki',
		format: 'pem'
	},
	privateKeyEncoding: {
		type: 'pkcs8',
		format: 'pem',
	},
});
