# CHANGELOG — DID Registry

## [2.0.0] — 2026-02-19

### Added
- `verification-keys` map: multi-key support per DID (secp256k1, Ed25519)
- `credential-anchors` map: on-chain verifiable credential issuance
- `delegates` map: time-bound delegate authorization
- `update-did-as-delegate`: delegates can update DID documents on behalf of controller
- `add-verification-key`: add named public keys to DID document
- `revoke-verification-key`: cryptographically invalidate a specific key
- `anchor-credential`: issue verifiable credentials with type tag and subject
- `revoke-credential`: issuer can invalidate anchored credentials
- `deactivate-did`: controller can permanently deactivate their DID
- `verify-credential`: read-only check if credential is active (not revoked)
- `get-did-count`: global counter for registered DIDs
- `controller` field in DID document: W3C-compliant controller separation

### Changed
- `did-documents` map extended with `created-at`, `updated-at`, `active`, `controller`
- `update-did` now enforces `active` check and `controller` authorization
- `DIDRegistrar` TypeScript class renamed to `DIDRegistrarSDK` with full transaction builders

---

## [1.0.0] — 2026-02-01

### Added
- Basic `register-did` and `resolve-did` functions
- Simple IPFS hash anchoring per principal
