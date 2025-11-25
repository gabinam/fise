# Security Policy

FISE is an obfuscation and protection layer for API and frontend data.
It helps make scraping, cloning, and casual inspection significantly harder.

FISE is **not** a replacement for:

- HTTPS / TLS  
- Authentication or authorization  
- Database encryption or key management  

---

## Threat Model

FISE is designed to defend against:

- Direct inspection of API responses via browser DevTools  
- Automated crawlers and basic scraping tools  
- Pattern-based reverse engineering  
- Universal decoders  
- Mass decoding attempts  

FISE does **not** aim to defend against:

- Attackers with full access to frontend code and long-term analysis  
- Backend key compromises  
- Man-in-the-middle attacks without TLS  
- Highly sophisticated cryptographic attacks  

---

## Unique Security Property

Each FISE deployment is **rule-based** and can fully customize:

- salt generation  
- offset calculation  
- metadata encoding  
- scanning rules  
- entropy rules  
- cipher selection  
- envelope structure  

This means:

- No universal decoder can exist  
- Reverse-engineering one app does **not** break another  
- Rules can be regenerated instantly if leaked  

---

## Reporting Security Issues

If you discover a potential vulnerability:

- Please use a **private and responsible disclosure** process  
- Contact the maintainer directly instead of opening a public issue first  
