# FISE - Fast Internet Secure Extensible

[![npm version](https://img.shields.io/npm/v/fise.svg)](https://www.npmjs.com/package/fise)
[![npm downloads](https://img.shields.io/npm/dm/fise.svg)](https://www.npmjs.com/package/fise)
[![license](https://img.shields.io/github/license/anbkit/fise)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

---

## 🔥 What is FISE?

**FISE is a keyless, rule-based, high-performance envelope for protecting API responses and frontend data.**

It is not a replacement for AES, TLS, or authentication.  
FISE is designed for *web response protection*, where traditional crypto is too heavy — or exposes static keys in the frontend.

FISE focuses on:

- high-speed transformations
- rule-based obfuscation
- infinite customization
- zero shared pattern between apps

---

## ⚡ Performance Benchmark (Node 20, M1)

| Method                    | Avg Time (per op) |
| ------------------------- | ----------------- |
| **FISE encrypt**          | ~0.02–0.04 ms     |
| **FISE decrypt**          | ~0.01–0.02 ms     |
| AES (crypto-js) decrypt   | ~0.4–0.9 ms       |
| WebCrypto AES-GCM decrypt | ~0.15–0.35 ms     |

### Why is FISE so fast?

- No heavy crypto unless you plug your own cipher
- Pure string operations
- No hashing, no PBKDF, no cost multipliers
- Runs thousands of ops per frame in frontend
- Ideal for high-frequency API usage

**FISE is optimized for web response protection, not heavyweight cryptography.**

---

## 🔐 The True Strength of FISE: Infinite Customization, Zero Standard Format

FISE does **not** rely on a single encryption scheme.  
Its real power comes from **unpredictability** and **per-application diversity**.

Every implementation of FISE can be completely different:

- no fixed envelope format  
- no universal salt position  
- no predictable metadata  
- no shared offset rules  
- no standard scanning method  
- no constant cipher  
- no global pattern to exploit  

### Every website or app becomes its **own encryption dialect**.

You can customize:

- salt generation  
- salt placement (front, end, interleaved, split, segmented)  
- timestamp-based entropy  
- metadata encoding (base36, base62, emoji, hex, XOR, zero-width chars)  
- metadata size  
- offset calculation  
- scanning rules (charCodeAt, primes, XOR signatures)  
- ciphers (XOR, AES, hybrid)  
- envelope structure  
- decoy blocks / noise injection  

Because the customization space is **effectively infinite**, two FISE pipelines are extremely unlikely to match.

### This creates a special security property:

- ❌ No universal decoder can exist  
- 🔒 Reverse-engineering one FISE app does **NOT** break another  
- 🧩 No fixed patterns for attackers  
- 🔄 Rules can be regenerated instantly if leaked  
- 🎭 Security comes from diversity, not secrecy alone  

> **FISE turns every web/app into its own unique encryption language — a moving target by design.**

---

## 📦 Installation

```bash
npm install fise
```

---

## 🚀 Basic Usage

```ts
import { encryptFise, decryptFise } from "fise";

const encrypted = encryptFise("Hello, world!");
const decrypted = decryptFise(encrypted);

console.log(encrypted);
console.log(decrypted); // "Hello, world!"
```

> You can replace rules, cipher, salt logic, metadata logic, offset rules, scanning rules — everything.

---

## 🧩 Architecture Overview

A FISE transformation pipeline typically consists of:

1. **Salt generation**
2. **Metadata + entropy encoding**
3. **Cipher layer (optional)**
4. **Offset calculation**
5. **Envelope mixing**
6. **Custom insertion rules**
7. **Final packed string**

Every step is customizable.

---

## 📚 Documentation

- `docs/RULES.md` — how to customize rule engine  
- `docs/SPEC.md` — transformation specification  
- `docs/PERFORMANCE.md` — benchmark details  
- `docs/SECURITY.md` — threat model  

---

## 🛡 Security Philosophy

FISE is not AES.  
FISE is not for secrets like passwords or tokens.

It is built for **real-world API/web protection**:

- prevent scraping  
- hide response semantics  
- avoid static keys  
- avoid universal decoders  
- add cost for attackers  

---

## 🤝 Contributing

See `CONTRIBUTING.md`  
We welcome rule designs, ciphers, scanners, metadata patterns, or optimization ideas.

---

## 📄 License

MIT © An Nguyen
