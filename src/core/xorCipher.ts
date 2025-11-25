import { FiseCipher } from "../types";
import { toBase64, fromBase64 } from "./utils";

export const xorCipher: FiseCipher = {
	encrypt(plaintext, salt) {
		const sLen = salt.length;
		let out = "";
		for (let i = 0; i < plaintext.length; i++) {
			const c = plaintext.charCodeAt(i);
			const k = salt.charCodeAt(i % sLen);
			out += String.fromCharCode(c ^ k);
		}
		return toBase64(out);
	},

	decrypt(cipherText, salt) {
		const decoded = fromBase64(cipherText);
		const sLen = salt.length;
		let out = "";
		for (let i = 0; i < decoded.length; i++) {
			const c = decoded.charCodeAt(i);
			const k = salt.charCodeAt(i % sLen);
			out += String.fromCharCode(c ^ k);
		}
		return out;
	}
};
