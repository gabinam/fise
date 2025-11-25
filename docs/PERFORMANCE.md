# FISE Performance

FISE is designed to be extremely lightweight. Most operations are simple string operations:

- random salt generation
- slicing, concatenation
- small length-encoding
- a user-defined cipher (XOR by default)

## Sample benchmark (Node 20, M1)

| Operation                 | Avg Time (10,000 runs) |
| ------------------------- | ---------------------- |
| encryptFise               | ~0.02–0.04 ms          |
| decryptFise               | ~0.01–0.02 ms          |
| AES (crypto-js) decrypt   | ~0.4–0.9 ms            |
| WebCrypto AES-GCM decrypt | ~0.15–0.35 ms          |

These numbers are illustrative, not strict guarantees. They show that FISE is suitable for:

- high-frequency API usage
- decrypting many items in a list
- real-time frontend usage on low-end devices
