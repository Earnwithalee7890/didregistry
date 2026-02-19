// DID Registry — Clarinet Test Suite
// Tests DID registration, update, delegate auth, credential anchoring, and revocation

import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';

Clarinet.test({
    name: "register-did: principal can register a DID with IPFS hash",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;

        let block = chain.mineBlock([
            Tx.contractCall('did-registry', 'register-did', [
                types.utf8("QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG")
            ], deployer.address)
        ]);

        block.receipts[0].result.expectOk().expectBool(true);
    }
});

Clarinet.test({
    name: "register-did: cannot register same principal twice",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;

        chain.mineBlock([
            Tx.contractCall('did-registry', 'register-did', [
                types.utf8("QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG")
            ], deployer.address)
        ]);

        let block = chain.mineBlock([
            Tx.contractCall('did-registry', 'register-did', [
                types.utf8("QmDifferentHash123")
            ], deployer.address)
        ]);

        block.receipts[0].result.expectErr().expectUint(102); // ERR-DID-EXISTS
    }
});

Clarinet.test({
    name: "update-did: controller can update document hash",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;

        chain.mineBlock([
            Tx.contractCall('did-registry', 'register-did', [
                types.utf8("QmOriginalHash")
            ], deployer.address)
        ]);

        let block = chain.mineBlock([
            Tx.contractCall('did-registry', 'update-did', [
                types.utf8("QmUpdatedHash999")
            ], deployer.address)
        ]);

        block.receipts[0].result.expectOk().expectBool(true);
    }
});

Clarinet.test({
    name: "add-verification-key: DID holder can add a secp256k1 key",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;

        chain.mineBlock([
            Tx.contractCall('did-registry', 'register-did', [
                types.utf8("QmKeyTestHash")
            ], deployer.address)
        ]);

        let block = chain.mineBlock([
            Tx.contractCall('did-registry', 'add-verification-key', [
                types.ascii("key-1"),
                types.ascii("02a1633cafcc01ebfb6d78e39f687a1f0995c62fc95f51ead10a02ee0be551b5dc"),
                types.ascii("EcdsaSecp256k1")
            ], deployer.address)
        ]);

        block.receipts[0].result.expectOk().expectBool(true);
    }
});

Clarinet.test({
    name: "anchor-credential: issuer can anchor credential hash on-chain",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const subject = accounts.get('wallet_1')!;

        chain.mineBlock([
            Tx.contractCall('did-registry', 'register-did', [
                types.utf8("QmIssuerHash")
            ], deployer.address)
        ]);

        let block = chain.mineBlock([
            Tx.contractCall('did-registry', 'anchor-credential', [
                types.utf8("QmCredentialHashABC123"),
                types.principal(subject.address),
                types.ascii("ProofOfWork")
            ], deployer.address)
        ]);

        block.receipts[0].result.expectOk().expectBool(true);
    }
});
