import { randomSalt } from "./core/utils";
import { EncryptOptions, FiseCipher, FiseContext, FiseRules } from "./types";

export function encryptFise(
	plaintext: string,
	cipher: FiseCipher,
	rules: FiseRules,
	options: EncryptOptions = {}
): string {
	const {
		minSaltLength = 10,
		maxSaltLength = 32,
		timestampMinutes
	} = options;

	if (maxSaltLength < minSaltLength) {
		throw new Error("FISE: maxSaltLength must be >= minSaltLength.");
	}

	const range = maxSaltLength - minSaltLength + 1;
	const saltLen =
		minSaltLength + Math.floor(Math.random() * Math.max(range, 1));

	const salt = randomSalt(saltLen);
	const ctx: FiseContext = { timestampMinutes, saltLength: saltLen };

	const cipherText = cipher.encrypt(plaintext, salt);
	const encodedLen = rules.encodeLength(saltLen, ctx);
	const offsetRaw = rules.offset(cipherText, ctx);

	const offset = Math.max(0, Math.min(offsetRaw, cipherText.length));

	const withLen =
		cipherText.slice(0, offset) + encodedLen + cipherText.slice(offset);

	return withLen + salt;
}
