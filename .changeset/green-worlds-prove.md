---
'cs-lab-kit': minor
---

Add Base64, CEP, CreditCard, LicensePlate, JWT, and Generator classes. Base64 provides encode, decode, and isValid. CEP adds isValid, format, clean, generate, and fetchBrazilianAddress with multi-API failover. CreditCard adds Luhn validation, getBrand (Visa, Mastercard, Amex, Elo, Diners, Hipercard), format, clean, and generate. LicensePlate supports old and Mercosul plates with isValid, getType, isMercosul, format, clean, and generate. JWT adds encode, decode, and isValid with optional HMAC-SHA256 signature verification. Generator adds uuid, fuid, firstName, lastName, fullName, email, password, color, ipv4, integer, and float for test data.
