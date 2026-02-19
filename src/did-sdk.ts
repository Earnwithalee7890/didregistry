// DID SDK v2 — TypeScript client for DID Registry contract

import { StacksMainnet, StacksTestnet } from '@stacks/network';
import {
    makeContractCall,
    broadcastTransaction,
    callReadOnlyFunction,
    standardPrincipalCV,
    stringUtf8CV,
    stringAsciiCV,
    AnchorMode,
    PostConditionMode,
    cvToJSON
} from '@stacks/transactions';

export interface DIDDocument {
    id: string;         // did:stacks:SP123...
    publicKeys: DIDKey[];
    services: ServiceEndpoint[];
    credentialAnchors: string[];
}

export interface DIDKey {
    id: string;
    type: 'EcdsaSecp256k1' | 'Ed25519';
    publicKeyHex: string;
}

export interface ServiceEndpoint {
    id: string;
    type: string;
    endpoint: string;
}

export interface DIDConfig {
    contractAddress: string;
    contractName: string;
    network: 'mainnet' | 'testnet';
}

export class DIDRegistrarSDK {
    private config: DIDConfig;
    private network: StacksMainnet | StacksTestnet;

    constructor(config: DIDConfig) {
        this.config = config;
        this.network = config.network === 'mainnet' ? new StacksMainnet() : new StacksTestnet();
    }

    /** Register a new DID on-chain with IPFS document hash. */
    async registerDID(ipfsHash: string, senderKey: string): Promise<string> {
        const tx = await makeContractCall({
            contractAddress: this.config.contractAddress,
            contractName: this.config.contractName,
            functionName: 'register-did',
            functionArgs: [stringUtf8CV(ipfsHash)],
            senderKey,
            network: this.network,
            anchorMode: AnchorMode.Any,
            postConditionMode: PostConditionMode.Allow,
        });
        const result = await broadcastTransaction(tx, this.network);
        return result.txid;
    }

    /** Update DID document hash (controller only). */
    async updateDID(newHash: string, senderKey: string): Promise<string> {
        const tx = await makeContractCall({
            contractAddress: this.config.contractAddress,
            contractName: this.config.contractName,
            functionName: 'update-did',
            functionArgs: [stringUtf8CV(newHash)],
            senderKey,
            network: this.network,
            anchorMode: AnchorMode.Any,
            postConditionMode: PostConditionMode.Allow,
        });
        const result = await broadcastTransaction(tx, this.network);
        return result.txid;
    }

    /** Add a verification key to a DID document. */
    async addVerificationKey(keyId: string, pubKeyHex: string, keyType: string, senderKey: string): Promise<string> {
        const tx = await makeContractCall({
            contractAddress: this.config.contractAddress,
            contractName: this.config.contractName,
            functionName: 'add-verification-key',
            functionArgs: [
                stringAsciiCV(keyId),
                stringAsciiCV(pubKeyHex),
                stringAsciiCV(keyType)
            ],
            senderKey,
            network: this.network,
            anchorMode: AnchorMode.Any,
            postConditionMode: PostConditionMode.Allow,
        });
        const result = await broadcastTransaction(tx, this.network);
        return result.txid;
    }

    /** Anchor a verifiable credential hash on-chain. */
    async anchorCredential(credHash: string, subject: string, credType: string, senderKey: string): Promise<string> {
        const tx = await makeContractCall({
            contractAddress: this.config.contractAddress,
            contractName: this.config.contractName,
            functionName: 'anchor-credential',
            functionArgs: [
                stringUtf8CV(credHash),
                standardPrincipalCV(subject),
                stringAsciiCV(credType)
            ],
            senderKey,
            network: this.network,
            anchorMode: AnchorMode.Any,
            postConditionMode: PostConditionMode.Allow,
        });
        const result = await broadcastTransaction(tx, this.network);
        return result.txid;
    }

    /** Resolve a DID to its on-chain document hash. */
    async resolveDID(principal: string): Promise<any> {
        const result = await callReadOnlyFunction({
            contractAddress: this.config.contractAddress,
            contractName: this.config.contractName,
            functionName: 'resolve-did',
            functionArgs: [standardPrincipalCV(principal)],
            network: this.network,
            senderAddress: principal,
        });
        return cvToJSON(result);
    }

    /** Verify whether a credential is active (not revoked). */
    async verifyCredential(credHash: string): Promise<boolean> {
        const result = await callReadOnlyFunction({
            contractAddress: this.config.contractAddress,
            contractName: this.config.contractName,
            functionName: 'verify-credential',
            functionArgs: [stringUtf8CV(credHash)],
            network: this.network,
            senderAddress: this.config.contractAddress,
        });
        const json = cvToJSON(result);
        return json.value.value === true;
    }
}
