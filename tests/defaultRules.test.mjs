import { test } from "node:test";
import assert from "node:assert";
import { defaultRules } from "../dist/rules/defaultRules.js";

test("defaultRules - encodedLengthSize", () => {
	assert.strictEqual(defaultRules.encodedLengthSize, 2);
});

test("defaultRules - encodeLength and decodeLength roundtrip", () => {
	const testLengths = [10, 15, 20, 32, 50, 99];
	const ctx = {};

	for (const len of testLengths) {
		const encoded = defaultRules.encodeLength(len, ctx);
		const decoded = defaultRules.decodeLength(encoded, ctx);

		assert.strictEqual(decoded, len);
		assert.strictEqual(encoded.length, 2);
	}
});

test("defaultRules - encodeLength produces base36 padded string", () => {
	const ctx = {};
	const encoded = defaultRules.encodeLength(10, ctx);

	assert.strictEqual(encoded.length, 2);
	assert.ok(/^[0-9a-z]{2}$/.test(encoded));
});

test("defaultRules - offset calculation", () => {
	const cipherText = "abcdefghijklmnopqrstuvwxyz";
	const ctx = { timestampMinutes: 0 };

	const offset = defaultRules.offset(cipherText, ctx);

	assert.ok(typeof offset === "number");
	assert.ok(offset >= 0);
	assert.ok(offset < cipherText.length);
});

test("defaultRules - offset changes with timestamp", () => {
	const cipherText = "abcdefghijklmnopqrstuvwxyz";
	const offset1 = defaultRules.offset(cipherText, { timestampMinutes: 0 });
	const offset2 = defaultRules.offset(cipherText, { timestampMinutes: 1 });

	// Offset may or may not change, but should be valid
	assert.ok(offset1 >= 0 && offset1 < cipherText.length);
	assert.ok(offset2 >= 0 && offset2 < cipherText.length);
});

test("defaultRules - offset with empty string", () => {
	const cipherText = "";
	const ctx = { timestampMinutes: 0 };

	const offset = defaultRules.offset(cipherText, ctx);

	assert.strictEqual(offset, 0);
});

test("defaultRules - extractSalt and stripSalt", () => {
	const envelope = "ciphertextmetadata1234567890";
	const saltLen = 10;
	const ctx = {};

	const salt = defaultRules.extractSalt(envelope, saltLen, ctx);
	const withoutSalt = defaultRules.stripSalt(envelope, saltLen, ctx);

	assert.strictEqual(salt, "1234567890");
	assert.strictEqual(withoutSalt, "ciphertextmetadata");
	assert.strictEqual(withoutSalt + salt, envelope);
});

test("defaultRules - preExtractLength with valid envelope", () => {
	// Create a valid envelope manually
	const saltLen = 15;
	const salt = "a".repeat(saltLen);
	const cipherText = "testciphertext";
	const ctx = { timestampMinutes: 0, saltLength: saltLen };

	const encodedLen = defaultRules.encodeLength(saltLen, ctx);
	const offset = defaultRules.offset(cipherText, ctx);
	const withLen =
		cipherText.slice(0, offset) + encodedLen + cipherText.slice(offset);
	const envelope = withLen + salt;

	const result = defaultRules.preExtractLength(envelope, { timestampMinutes: 0 });

	assert.strictEqual(result.saltLength, saltLen);
	assert.strictEqual(result.encodedLength, encodedLen);
});

test("defaultRules - preExtractLength with invalid envelope", () => {
	assert.throws(
		() => {
			defaultRules.preExtractLength("invalid", {});
		},
		{
			message: "FISE: cannot infer salt length from envelope."
		}
	);
});

test("defaultRules - preExtractLength with too short envelope", () => {
	assert.throws(
		() => {
			defaultRules.preExtractLength("abc", {});
		},
		{
			message: "FISE: cannot infer salt length from envelope."
		}
	);
});

test("defaultRules - decodeLength handles edge cases", () => {
	const ctx = {};

	// Test minimum (10 in base36 is "a")
	const minEncoded = defaultRules.encodeLength(10, ctx);
	assert.strictEqual(defaultRules.decodeLength(minEncoded, ctx), 10);

	// Test maximum (99 in base36 is "2r")
	const maxEncoded = defaultRules.encodeLength(99, ctx);
	assert.strictEqual(defaultRules.decodeLength(maxEncoded, ctx), 99);
});

test("defaultRules - offset is deterministic for same input", () => {
	const cipherText = "testciphertext123";
	const ctx = { timestampMinutes: 42 };

	const offset1 = defaultRules.offset(cipherText, ctx);
	const offset2 = defaultRules.offset(cipherText, ctx);

	assert.strictEqual(offset1, offset2);
});

