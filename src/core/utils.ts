const ALPHABET =
	"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export function randomSalt(len: number): string {
	let out = "";
	const n = ALPHABET.length;
	for (let i = 0; i < len; i++) {
		out += ALPHABET[Math.floor(Math.random() * n)];
	}
	return out;
}

export function toBase64(str: string): string {
	if (typeof btoa === "function") {
		return btoa(str);
	}
	if (typeof Buffer !== "undefined") {
		return Buffer.from(str, "utf8").toString("base64");
	}
	throw new Error("FISE: no base64 encoder available.");
}

export function fromBase64(str: string): string {
	if (typeof atob === "function") {
		return atob(str);
	}
	if (typeof Buffer !== "undefined") {
		return Buffer.from(str, "base64").toString("utf8");
	}
	throw new Error("FISE: no base64 decoder available.");
}
