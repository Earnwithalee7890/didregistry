# DID Registry 🆔

**DID Registry** is a decentralized identity protocol on Stacks. It allows users to anchor their W3C-compliant DID Documents on the Bitcoin L2 via Stacks, ensuring self-sovereign identity management.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Type](https://img.shields.io/badge/standard-W3C%20DID-green)

## Features

- **Self-Sovereign**: You own your identity. No central server.
- **IPFS Integration**: Stores lightweight hashes on-chain, full docs on IPFS.
- **Versioning**: built-in version control for identity updates.
- **TypeScript SDK**: Helper library for resolving DIDs.

## Usage

### Smart Contract
```clarity
;; Register a new Identity
(contract-call? .did-registry register-did "QmHash...")

;; Resolve an Identity
(contract-call? .did-registry resolve-did 'SP2J6...)
```

### TypeScript SDK
```typescript
import { DIDRegistrar } from './src/did-sdk';

const registrar = new DIDRegistrar('ST1PQ...');
const docHash = await registrar.resolve('SP2J6...');
```

## License
MIT
