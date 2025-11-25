export interface FiseContext {
	timestampMinutes?: number;
	saltLength?: number;
	randomSeed?: number;
}

export interface FiseRules {
	/** Number of characters used to encode salt length (e.g. 2 for base36 padded). */
	encodedLengthSize: number;

	/** Compute where to insert the encoded length inside the cipher text. */
	offset(cipherText: string, ctx: FiseContext): number;

	/** Encode salt length as an opaque string. */
	encodeLength(len: number, ctx: FiseContext): string;

	/** Decode salt length from encoded metadata. */
	decodeLength(encoded: string, ctx: FiseContext): number;

	/** Extract salt from full envelope (usually from the tail). */
	extractSalt(envelope: string, saltLen: number, ctx: FiseContext): string;

	/** Remove salt from envelope and return the raw cipher+metadata. */
	stripSalt(envelope: string, saltLen: number, ctx: FiseContext): string;

	/**
	 * Core logic to infer saltLength and remove the encodedLength from the
	 * cipher. This is the key part of the rule engine.
	 */
	preExtractLength(
		envelope: string,
		ctxBase: FiseContext
	): {
		saltLength: number;
		encodedLength: string;
		withoutLen: string;
	};

	/**
	 * Optional advanced scanning rule:
	 * given the full envelope, return index+encoded chunk
	 * for the length metadata. If provided, preExtractLength can delegate to it.
	 */
	scanForEncodedLength?(
		envelope: string,
		ctx: FiseContext
	): {
		index: number;
		encoded: string;
	};
}

export interface FiseCipher {
	encrypt(plaintext: string, salt: string): string;
	decrypt(cipherText: string, salt: string): string;
}

export interface EncryptOptions {
	minSaltLength?: number;
	maxSaltLength?: number;
	timestampMinutes?: number;
}

export interface DecryptOptions {
	timestampMinutes?: number;
}
