import { FiseContext, FiseRules } from "../types";

export const defaultRules: FiseRules = {
	encodedLengthSize: 2,

	offset(cipherText: string, ctx: FiseContext): number {
		const t = ctx.timestampMinutes ?? 0;
		const len = cipherText.length || 1;
		return (len * 7 + (t % 11)) % len;
	},

	encodeLength(len: number, _ctx: FiseContext): string {
		return len.toString(36).padStart(2, "0");
	},

	decodeLength(encoded: string, _ctx: FiseContext): number {
		return parseInt(encoded, 36);
	},

	extractSalt(envelope: string, saltLen: number, _ctx: FiseContext): string {
		return envelope.slice(-saltLen);
	},

	stripSalt(envelope: string, saltLen: number, _ctx: FiseContext): string {
		return envelope.slice(0, envelope.length - saltLen);
	},

	preExtractLength(envelope: string, ctxBase: FiseContext) {
		const MIN_SALT = 10;
		const MAX_SALT = 99;
		const encodedSize = this.encodedLengthSize;

		for (let len = MIN_SALT; len <= MAX_SALT; len++) {
			const withoutSalt = envelope.slice(0, envelope.length - len);

			if (withoutSalt.length < encodedSize) continue;

			for (let i = 0; i <= withoutSalt.length - encodedSize; i++) {
				const encoded = withoutSalt.slice(i, i + encodedSize);
				const decodedLen = this.decodeLength(encoded, ctxBase);
				if (Number.isNaN(decodedLen) || decodedLen !== len) continue;

				const candidate =
					withoutSalt.slice(0, i) + withoutSalt.slice(i + encodedSize);

				const expectedOffset = this.offset(candidate, {
					...ctxBase,
					saltLength: len
				});

				if (expectedOffset !== i) continue;

				return {
					saltLength: len,
					encodedLength: encoded,
					withoutLen: withoutSalt
				};
			}
		}

		throw new Error("FISE: cannot infer salt length from envelope.");
	}
};
