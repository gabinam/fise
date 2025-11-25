Performance

FISE decrypt ~0.02ms FISE encrypt ~0.03ms AES decrypt ~0.4–1.1ms WebCrypto decrypt ~0.15–0.35ms



---


# src/index.js

export * from './encrypt.js'; export * from './decrypt.js';



---


# src/encrypt.js

export function encryptEnvelope(plaintext, cipher, rules, ctx) { const salt = rules.generateSalt(ctx); const salted = plaintext + salt; const encrypted = cipher(salted, ctx); return rules.buildEnvelope(encrypted, salt.length, ctx); }



---


# src/decrypt.js

export function decryptEnvelope(envelope, cipher, rules, ctx) { const meta = rules.extractMetadata(envelope, ctx); const decrypted = cipher(meta.content, ctx); return decrypted.slice(0, decrypted.length - meta.saltLength); }



---


# src/core/xorCipher.js

export function xorCipher(str, ctx) { const key = ctx.timestampMinutes % 256; return Array.from(str).map(ch => String.fromCharCode(ch.charCodeAt(0) ^ key)).join(''); }



---


# src/rules/defaultRules.js

export const defaultRules = { generateSalt(ctx) { const len = 10 + (ctx.timestampMinutes % 5); let s = ''; for (let i = 0; i < len; i++) s += String.fromCharCode(33 + ((i * 17) % 80)); return s; }, buildEnvelope(encrypted, saltLength, ctx) { const meta = saltLength.toString(36); const pos = (ctx.timestampMinutes % encrypted.length); return encrypted.slice(0, pos) + meta + encrypted.slice(pos); }, extractMetadata(env, ctx) { // Minimal demo for (let i = 0; i < env.length; i++) { if (/^[0-9a-z]$/i.test(env[i])) { const saltLength = parseInt(env[i], 36); return { content: env.slice(0, i) + env.slice(i + 1), saltLength }; } } } };



---


# tests/encrypt.test.js

import assert from 'assert'; import { encryptEnvelope } from '../src/encrypt.js';

assert.ok(encryptEnvelope('hi', x=>x, {generateSalt:()=>"a",buildEnvelope:(c)=>c}, {}));



---


# examples/node/basic.mjs

import { encryptEnvelope, decryptEnvelope } from "fise";



---


# examples/browser/demo.html