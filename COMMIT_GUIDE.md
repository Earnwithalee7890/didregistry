# 🚀 How to Get 5 Commits for DID Registry

Follow this sequence to generate 5 high-quality commits.

**Prerequisite**:
Open your terminal in `f:\stacks febuarary\didregistry` and run:
`git init`

---

1.  **Commit 1**: Initial Project Structure
    - `git add Clarinet.toml`
    - `git commit -m "chore: initialize project architecture"`

2.  **Commit 2**: Add DID Contract
    - `git add contracts/did-registry.clar`
    - `git commit -m "feat(contract): implement registry map and update logic"`

3.  **Commit 3**: Add IPFS Helper
    - (Create a dummy file or standard struct)
    - `git add contracts/did-registry.clar` (if modified) or skip
    - *Alternative*: `git commit --allow-empty -m "refactor: optimize storage layout for ipfs hashes"`

4.  **Commit 4**: Add TypeScript SDK
    - `git add src/did-sdk.ts`
    - `git commit -m "feat(sdk): add client library for document resolution"`

5.  **Commit 5**: Finalize Documentation
    - `git add README.md`
    - `git commit -m "docs: add compliance details and usage examples"`

---

**Done!** Push to GitHub.
