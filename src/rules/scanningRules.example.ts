import { FiseContext, FiseRules } from "../types";

/**
 * Example of a rule that uses scanForEncodedLength.
 * You don't need to export this from the library by default,
 * but it's useful as a template for end-users.
 */
export const scanningRulesExample: FiseRules = {
	encodedLengthSize: 2,

	offset(cipherText: string, ctx: FiseContext): number {
		const t = ctx.timestampMinutes ?? 0;
		const len = cipherText.length || 1;
		return (len * 3 + (t % 7)) % len;
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

	scanForEncodedLength(envelope: string, ctx: FiseContext) {
		const size = this.encodedLengthSize;
		const t = ctx.timestampMinutes ?? 0;

		for (let i = 0; i <= envelope.length - size; i++) {
			const code = envelope.charCodeAt(i);
			const sig = (code ^ t) % 9;
			if (sig === 4) {
				const encoded = envelope.slice(i, i + size);
				return { index: i, encoded };
			}
		}

		throw new Error("FISE scanningRulesExample: encoded length not found.");
	},

	preExtractLength(envelope: string, ctxBase: FiseContext) {
		// Use scanForEncodedLength if present:
		if (this.scanForEncodedLength) {
			const { index, encoded } = this.scanForEncodedLength(envelope, ctxBase);
			const saltLength = this.decodeLength(encoded, ctxBase);
			const size = this.encodedLengthSize;

			const withoutLen =
				envelope.slice(0, index) + envelope.slice(index + size);

			return {
				saltLength,
				encodedLength: encoded,
				withoutLen
			};
		}

		// fallback to default strategy if needed
		throw new Error(
			"FISE scanningRulesExample: scanForEncodedLength must be used here."
		);
	}
};
