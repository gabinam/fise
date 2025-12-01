import { test } from "node:test";
import assert from "node:assert";
import { randomSalt, toBase64, fromBase64 } from "../dist/core/utils.js";

test("randomSalt - generates string of correct length", () => {
	const len = 20;
	const salt = randomSalt(len);

	assert.strictEqual(salt.length, len);
	assert.ok(typeof salt === "string");
});

test("randomSalt - different calls produce different results", () => {
	const len = 20;
	const salts = Array.from({ length: 5 }, () => randomSalt(len));

	for (const salt of salts) {
		assert.strictEqual(salt.length, len);
	}
	assert.ok(
		new Set(salts).size > 1,
		"Random salts should not all be identical"
	);
});

test("randomSalt - uses alphanumeric characters", () => {
	const len = 100;
	const salt = randomSalt(len);

	// Should only contain a-z, A-Z, 0-9
	const alphanumericRegex = /^[a-zA-Z0-9]+$/;
	assert.ok(alphanumericRegex.test(salt), "Salt should only contain alphanumeric characters");
});

test("randomSalt - various lengths", () => {
	const lengths = [1, 10, 20, 50, 100];

	for (const len of lengths) {
		const salt = randomSalt(len);
		assert.strictEqual(salt.length, len);
	}
});

test("toBase64 and fromBase64 - roundtrip", () => {
	const original = "Hello, world!";
	const encoded = toBase64(original);
	const decoded = fromBase64(encoded);

	assert.strictEqual(decoded, original);
});

test("toBase64 and fromBase64 - empty string", () => {
	const original = "";
	const encoded = toBase64(original);
	const decoded = fromBase64(encoded);

	assert.strictEqual(decoded, original);
});

test("toBase64 and fromBase64 - unicode characters", () => {
	const original = "Hello 世界 🌍";
	const encoded = toBase64(original);
	const decoded = fromBase64(encoded);

	// Note: btoa/atob in browser may not handle unicode perfectly
	// but Buffer-based implementation should work
	assert.strictEqual(decoded, original);
});

test("toBase64 and fromBase64 - special characters", () => {
	const original = "!@#$%^&*()_+-=[]{}|;':\",./<>?";
	const encoded = toBase64(original);
	const decoded = fromBase64(encoded);

	assert.strictEqual(decoded, original);
});

test("toBase64 and fromBase64 - multiline string", () => {
	const original = "Line 1\nLine 2\nLine 3";
	const encoded = toBase64(original);
	const decoded = fromBase64(encoded);

	assert.strictEqual(decoded, original);
});

test("toBase64 and fromBase64 - long string", () => {
	const original = "A".repeat(1000);
	const encoded = toBase64(original);
	const decoded = fromBase64(encoded);

	assert.strictEqual(decoded, original);
});

test("toBase64 - produces valid base64", () => {
	const original = "Hello, world!";
	const encoded = toBase64(original);

	// Base64 strings should only contain A-Z, a-z, 0-9, +, /, and = for padding
	const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
	assert.ok(base64Regex.test(encoded), "Encoded output should be valid base64");
});

test("toBase64 and fromBase64 - JSON data", () => {
	const original = JSON.stringify({ name: "FISE", version: "0.1.0", data: [1, 2, 3] });
	const encoded = toBase64(original);
	const decoded = fromBase64(encoded);

	assert.strictEqual(decoded, original);
	const parsed = JSON.parse(decoded);
	assert.strictEqual(parsed.name, "FISE");
});
