# FISE Whitepaper (v1.0)
## Fast Internet Secure Extensible – A Rule-Based, Keyless, High-Performance Envelope for Web/API Data Protection

## Abstract
FISE is a lightweight, high-performance, rule-based envelope designed to protect the semantic meaning of web/API responses. Unlike traditional encryption algorithms, which rely on static keys that must be exposed to the frontend, FISE uses a customizable, keyless transformation pipeline that produces unique, unpredictable output for every application. This makes universal decoders impossible and significantly increases the cost of data scraping or reverse-engineering.

FISE is not a replacement for AES, WebCrypto, TLS, or backend security. Instead, it operates as a semantic-protection layer specifically optimized for the frontend environment.

## 1. Introduction
Modern web applications rely heavily on REST APIs that return structured, meaningful JSON data. While HTTPS protects the transport layer, the returned data remains plaintext and therefore highly vulnerable to:

- automated scraping
- competitive data harvesting
- cloning of curated datasets
- reverse engineering of business logic
- unauthorized third-party reuse

Frontend applications must receive readable data to function, but this requirement exposes a company’s data assets—often the most valuable part of the system.

FISE was created to address this problem:
**a method to protect data meaning without requiring frontend-stored keys or heavy cryptographic operations.**

## 2. Problem Statement

### 2.1 Data is always exposed
Even with HTTPS:
- browser devtools show plaintext JSON
- scrapers can fetch data directly
- API structure is fully visible
- business logic can be inferred

### 2.2 Traditional cryptography fails in frontend
AES/WebCrypto:
- require a key
- key must exist in frontend → attacker can read it
- heavy per-operation cost
- predictable structure

Thus:
**encryption does not solve semantic exposure.**

### 2.3 API scraping is trivial
Attackers often copy entire databases with:

```js
fetch('/api/items?page=1').then(r => r.json());
```

This creates massive business risk for any product where **data itself is the asset** (travel, POI, content, pricing, captions, recommendations).

## 3. Design Philosophy
FISE is built upon five core principles:

### 3.1 Keyless Protection
No static key is ever stored in frontend code → nothing to steal.

### 3.2 Security Through Diversity
Every implementation is unique.
No two FISE pipelines need to share the same structure.

### 3.3 Infinite Customization
Developers can customize:
- salt generation
- offsets
- metadata encoding
- scanning patterns
- ciphers
- envelope structure
- timestamp-based entropy

### 3.4 Semantic Obfuscation
FISE protects *meaning*, not transport.
Attackers cannot extract meaningful JSON without understanding the rule pipeline.

### 3.5 Cheap to Run, Expensive to Reverse
Target:
- microsecond-level transformation cost
- exponential reverse-engineering cost

## 4. The FISE Transformation Pipeline

### 4.1 Salt Generation
A variable-length salt adds unpredictability.

Examples:
- random(10–99 chars)
- entropy from timestamp
- entropy derived from char codes

### 4.2 Metadata Encoding
Salt length and offsets are encoded into one or more metadata blocks.

Possible formats:
- hex
- base36 / base62
- emoji channel
- zero-width characters
- XOR signature

### 4.3 Optional Cipher Layer
FISE allows developers to insert:
- XOR cipher
- AES (if desired)
- hybrid multi-phase cipher

This layer is optional to maintain high performance.

### 4.4 Offset Calculation
Offsets determine where metadata is inserted and where salt is embedded.

Offsets may be derived from:
- timestamp
- prime sequences
- rolling checksum
- character patterns

### 4.5 Envelope Assembly
Data, salt, metadata are merged into an unpredictable structure.

### 4.6 Final Output
The result is a string with no identifiable structure, no fixed format, and no universal decode pattern.

## 5. Decryption Pipeline
To reverse the transformation:
1. Extract encoded metadata
2. Decode salt length / offset
3. Locate salt
4. Remove or unwind noise
5. Reverse optional cipher
6. Restore original plaintext

Only the correct FISE rule implementation can decode the output.

## 6. Security Model

### 6.1 FISE Protects Against
- scraping bots
- competitive data harvesting
- reverse-engineering of response structure
- cloning of curated datasets
- inference of backend business logic
- trivial replay attacks

### 6.2 FISE Does Not Replace
- TLS (transport security)
- Authentication or authorization
- Backend rate limiting
- Real cryptography for secrets
- Access control

### 6.3 Security Properties
- No static key
- No universal decoder
- No predictable structure
- Regenerable rules
- High entropy per response

## 7. Comparison Table

| Feature                 | AES/WebCrypto | Obfuscation libs | FISE             |
| ----------------------- | ------------- | ---------------- | ---------------- |
| Requires key            | ✔ Yes         | ❌ No             | ❌ No             |
| Key exposed in frontend | ✔ Yes         | ❌ No             | ❌ No             |
| Universal decoder       | ✔ Yes         | ✔ Often          | ❌ Impossible     |
| Performance             | ❌ Medium      | ✔ Fast           | ⭐ Extremely fast |
| Predictability          | ✔ High        | ✔ Medium         | ❌ None           |
| Semantic protection     | ❌ No          | ❌ Partial        | ⭐ Strong         |
| Customizable            | ❌ No          | ❌ Limited        | ⭐ Infinite       |
| Per-app uniqueness      | ❌ No          | ❌ No             | ⭐ Yes            |

## 8. Performance Analysis

Benchmarks (Node 20, Apple M1):

| Operation                 | Average Time  |
| ------------------------- | ------------- |
| FISE Encrypt              | ~0.02–0.04 ms |
| FISE Decrypt              | ~0.01–0.02 ms |
| AES (crypto-js) decrypt   | ~0.4–0.9 ms   |
| WebCrypto AES-GCM decrypt | ~0.15–0.35 ms |

### Why FISE is fast:
- pure string operations
- no hashing
- no PBKDF
- no memory-expensive key expansion
- minimal dependencies
- no heavy cryptography (unless injected manually)

## 9. Use Cases
- Web/API response protection
- Anti-scraping
- Protect curated content (travel, POI, AI metadata)
- E-commerce pricing data
- Streaming content metadata
- News and article aggregation
- Sensitive analytics returned to clients
- Mobile apps
- React/React Native frontend
- Dashboards & admin panels
- Any system where frontend sees valuable data

## 10. Future Work
Potential enhancements for FISE v0.2+:
- multi-block interleaving
- decoy noise segments
- multi-phase randomized pipeline
- session-rotating rule sets
- rule engine DSL
- browser-optimized WASM fast path
- detector for malformed or tampered envelopes

## 11. Conclusion
REST APIs expose readable data, and traditional encryption cannot solve the problem in a browser environment where keys are inherently exposed.

FISE introduces a new paradigm:
**a rule-based, keyless, high-performance semantic protection layer designed specifically for the frontend.**

By allowing infinite customization and discouraging universal decoding, FISE raises the cost of scraping dramatically while staying lightweight and fast.

FISE is not about cryptographic secrecy —
it is about preserving the value of data assets and protecting modern frontend applications.
