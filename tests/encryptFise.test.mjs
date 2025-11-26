import { test } from "node:test";
import assert from "node:assert";
import { encryptFise, decryptFise } from "../dist/encryptFise.js";
import { xorCipher } from "../dist/core/xorCipher.js";
import { defaultRules } from "../dist/rules/defaultRules.js";

test("encryptFise - basic encryption", () => {
    const plaintext = "Hello, world!";
    const encrypted = encryptFise(plaintext, xorCipher, defaultRules);

    assert.ok(typeof encrypted === "string");
    assert.ok(encrypted.length > plaintext.length);
    assert.ok(encrypted !== plaintext);
});

test("encryptFise - roundtrip encryption/decryption", () => {
    const plaintext = "Hello, world!";
    const encrypted = encryptFise(plaintext, xorCipher, defaultRules);
    const decrypted = decryptFise(encrypted, xorCipher, defaultRules);

    assert.strictEqual(decrypted, plaintext);
});

test("encryptFise - different inputs produce different outputs", () => {
    const plaintext = "Hello, world!";
    const encrypted1 = encryptFise(plaintext, xorCipher, defaultRules);
    const encrypted2 = encryptFise(plaintext, xorCipher, defaultRules);

    // Due to random salt, outputs should be different
    assert.ok(encrypted1 !== encrypted2);
});

test("encryptFise - empty string", () => {
    const plaintext = "";
    const encrypted = encryptFise(plaintext, xorCipher, defaultRules);
    const decrypted = decryptFise(encrypted, xorCipher, defaultRules);

    assert.strictEqual(decrypted, plaintext);
});

test("encryptFise - long string", () => {
    const plaintext = "A".repeat(1000);
    const encrypted = encryptFise(plaintext, xorCipher, defaultRules);
    const decrypted = decryptFise(encrypted, xorCipher, defaultRules);

    assert.strictEqual(decrypted, plaintext);
});

test("encryptFise - JSON data", () => {
    const plaintext = JSON.stringify({ name: "FISE", version: "0.1.0" });
    const encrypted = encryptFise(plaintext, xorCipher, defaultRules);
    const decrypted = decryptFise(encrypted, xorCipher, defaultRules);

    assert.strictEqual(decrypted, plaintext);
    const parsed = JSON.parse(decrypted);
    assert.strictEqual(parsed.name, "FISE");
});

test("encryptFise - unicode characters", () => {
    const plaintext = "Hello 世界 🌍";
    const encrypted = encryptFise(plaintext, xorCipher, defaultRules);
    const decrypted = decryptFise(encrypted, xorCipher, defaultRules);

    assert.strictEqual(decrypted, plaintext);
});

test("encryptFise - with timestampMinutes option", () => {
    const plaintext = "Hello, world!";
    const timestampMinutes = 12345;
    const encrypted = encryptFise(plaintext, xorCipher, defaultRules, {
        timestampMinutes
    });
    const decrypted = decryptFise(encrypted, xorCipher, defaultRules, {
        timestampMinutes
    });

    assert.strictEqual(decrypted, plaintext);
});

test("encryptFise - with custom salt length range", () => {
    const plaintext = "Hello, world!";
    const encrypted = encryptFise(plaintext, xorCipher, defaultRules, {
        minSaltLength: 15,
        maxSaltLength: 20
    });
    const decrypted = decryptFise(encrypted, xorCipher, defaultRules);

    assert.strictEqual(decrypted, plaintext);
});

test("encryptFise - error: maxSaltLength < minSaltLength", () => {
    const plaintext = "Hello, world!";
    assert.throws(
        () => {
            encryptFise(plaintext, xorCipher, defaultRules, {
                minSaltLength: 20,
                maxSaltLength: 10
            });
        },
        {
            message: "FISE: maxSaltLength must be >= minSaltLength."
        }
    );
});

test("decryptFise - error: invalid envelope", () => {
    assert.throws(
        () => {
            decryptFise("invalid", xorCipher, defaultRules);
        },
        {
            message: "FISE: cannot infer salt length from envelope."
        }
    );
});

test("encryptFise - multiple roundtrips with same input", () => {
    const plaintext = "Test message";
    for (let i = 0; i < 10; i++) {
        const encrypted = encryptFise(plaintext, xorCipher, defaultRules);
        const decrypted = decryptFise(encrypted, xorCipher, defaultRules);
        assert.strictEqual(decrypted, plaintext);
    }
});

test("encryptFise - various special characters", () => {
    const testCases = [
        "!@#$%^&*()",
        "Line 1\nLine 2\nLine 3",
        "\tTabbed\tText\t",
        "   Spaces   ",
        "Mixed123!@#ABC"
    ];

    for (const plaintext of testCases) {
        const encrypted = encryptFise(plaintext, xorCipher, defaultRules);
        const decrypted = decryptFise(encrypted, xorCipher, defaultRules);
        assert.strictEqual(decrypted, plaintext);
    }
});

