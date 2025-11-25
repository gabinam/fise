# FISE Architecture


Flow:


plaintext → cipher(text, salt) → envelope(metadata + text) → transport → FE → extract rules → decipher → JSON