;; DID Registry - Decentralized Identity
;; Maps Stacks Principals to DID Documents (via IPFS hash or raw data)

(define-constant err-not-found (err u100))
(define-constant err-unauthorized (err u101))

(define-map did-documents
    principal
    {
        ipfs-hash: (string-ascii 64),
        updated-at: uint,
        version: uint
    }
)

(define-public (register-did (ipfs-hash (string-ascii 64)))
    (begin
        (map-set did-documents tx-sender {
            ipfs-hash: ipfs-hash,
            updated-at: block-height,
            version: u1
        })
        (ok true)
    )
)

(define-public (update-did (ipfs-hash (string-ascii 64)))
    (let
        (
            (current-doc (unwrap! (map-get? did-documents tx-sender) err-not-found))
        )
        (map-set did-documents tx-sender {
            ipfs-hash: ipfs-hash,
            updated-at: block-height,
            version: (+ (get version current-doc) u1)
        })
        (ok true)
    )
)

(define-public (delete-did)
    (begin
        (map-delete did-documents tx-sender)
        (ok true)
    )
)

(define-read-only (resolve-did (subject principal))
    (map-get? did-documents subject)
)
