# FISE Performance

FISE is designed to be extremely lightweight. Most operations are simple string operations:

- random salt generation
- slicing, concatenation
- small length-encoding
- a user-defined cipher (XOR by default)

## Sample benchmark (Node 20, M4 PRO)

> **Last Updated**: 2025-11-26 (Node v22.14.0, darwin arm64)


Performance varies with payload size. Typical benchmarks:

| Payload Size | Encrypt (avg) | Decrypt (avg) | Total (avg)  |
| ------------ | ------------- | ------------- | ------------ |
| 100 chars    | ~0.004    ms  | ~0.054    ms  | ~0.058    ms |
| 500 chars    | ~0.006    ms  | ~0.269    ms  | ~0.275    ms |
| 1000 chars   | ~0.010    ms  | ~0.313    ms  | ~0.323    ms |
| 4.9 KB       | ~0.048    ms  | ~1.564    ms  | ~1.612    ms |
| 9.8 KB       | ~0.095    ms  | ~6.051    ms  | ~6.146    ms |
| 48.8 KB      | ~0.599    ms  | ~15.239   ms  | ~15.838   ms |

| Operation                 | Avg Time (10,000 runs, ~1 KB) |
| ------------------------- | ----------------------------- |
| FISE encrypt              | ~0.01 ms                      |
| FISE decrypt              | ~0.4 ms                       |
| AES (crypto-js) decrypt   | ~0.4–0.9 ms                   |
| WebCrypto AES-GCM decrypt | ~0.15–0.35 ms                 |

## Performance Characteristics

- **Encrypt**: O(n) - linear with payload size
- **Decrypt**: O(n) - optimized to avoid O(n²) search operations
- **Memory**: Minimal - uses pre-allocated arrays for XOR operations
- **CPU**: Lightweight - pure string operations, no heavy crypto

## Optimization Notes

Recent optimizations (v0.1.0+):
- XOR cipher uses pre-allocated arrays instead of string concatenation
- Decrypt uses direct offset calculation instead of linear search
- Base64 encoding prioritizes Node.js Buffer for better performance

These numbers are illustrative, not strict guarantees. They show that FISE is suitable for:

- high-frequency API usage
- decrypting many items in a list
- real-time frontend usage on low-end devices
- scenarios where microsecond-level latency matters
