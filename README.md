# Vault

> End-to-end encrypted T4L Projects team collaboration 

Vault is an open-source, privacy-native alternative to Microsoft Teams. The server is **architecturally incapable of reading your messages, files, or calls** — it only ever handles ciphertexts. This is not a marketing claim; it is a design constraint enforced at every layer of the system.

This repository is the home of a multi-year student project. If you are reading this as a new team member, start with the [Getting Started](#getting-started) section, then work through the [First Task](#your-first-task-j06) below.

## Table of Contents

- [Project Philosophy](#project-philosophy)
- [Architecture Overview](#architecture-overview)
- [Repository Structure](#repository-structure)
- [Getting Started](#getting-started)
- [Your First Task (J06)](#your-first-task-j06)
- [Project Plan](#project-plan)
- [Cryptographic Design](#cryptographic-design)
- [Team Norms](#team-norms)
- [Resources & Reading List](#resources--reading-list)
- [Contributing](#contributing)
- [License](#license)

---

## Project Philosophy

**The server is not trusted.** Every design decision flows from this premise. When you add a feature, ask yourself: *what does the server learn from this?* The answer should always be: only metadata — who talked to whom, and when — never content.

This is harder than building a normal app. It means:
- Search has to work on-device over an encrypted index.
- Compliance and eDiscovery requires user-controlled key escrow, not server-side access.
- AI features run on-device, not in the cloud.
- Every new engineer has to understand why before they touch any crypto code.

We accept this complexity because the alternative — trusting a central server — defeats the entire purpose.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     Client (trusted)                     │
│  ┌──────────┐  ┌──────────┐  ┌────────────────────────┐ │
│  │  Crypto  │  │   KMS    │  │   UI (Desktop/Mobile)  │ │
│  │ Layer    │  │ (local)  │  │                        │ │
│  └────┬─────┘  └────┬─────┘  └───────────┬────────────┘ │
└───────┼─────────────┼────────────────────┼──────────────┘
        │  ciphertext │  encrypted keys    │ ciphertext
        ▼             ▼                    ▼
┌─────────────────────────────────────────────────────────┐
│                  Server (untrusted)                      │
│  ┌──────────────┐  ┌────────────┐  ┌──────────────────┐ │
│  │  Messaging   │  │  File      │  │  Identity /      │ │
│  │  Relay       │  │  Storage   │  │  Key Server      │ │
│  └──────────────┘  └────────────┘  └──────────────────┘ │
│          Sees: ciphertexts + metadata ONLY               │
└─────────────────────────────────────────────────────────┘
```

The server relays encrypted blobs. It cannot decrypt them. It cannot be compelled to hand over plaintext because it does not have any.

---

## Repository Structure

```
vault/
├── src/
│   ├── crypto/
│   │   ├── primitives.py      ← START HERE (J06 first task)
│   │   ├── double_ratchet.py  ← (J08, coming soon)
│   │   └── mls.py             ← (J08, group key agreement)
│   ├── kms/
│   │   └── keystore.py        ← (J08)
│   ├── identity/
│   │   └── auth.py            ← (J10)
│   └── server/                ← (J14 onwards)
├── tests/
│   ├── test_primitives.py     ← run these first
│   └── ...
├── docs/
│   ├── threat-model.md        ← (J05 deliverable)
│   ├── protocol-spec.md       ← (J05 deliverable)
│   └── adr/                   ← Architecture Decision Records
├── requirements.txt
├── .github/
│   └── workflows/
│       └── ci.yml             ← (J04 deliverable)
└── README.md
```

---

## Getting Started

### Prerequisites

- Python 3.11+
- Git
- A working Docker installation (needed from Phase 2 onward)

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/your-org/vault.git
cd vault

# 2. Create a virtual environment
python -m venv .venv
source .venv/bin/activate       # Windows: .venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run the smoke test
python -m src.crypto.primitives

# 5. Run the full test suite
pytest tests/ -v
```

You should see all tests pass. If anything fails, check that libsodium is installed on your system — PyNaCl requires it.

> **macOS:** `brew install libsodium`  
> **Ubuntu/Debian:** `sudo apt install libsodium-dev`  
> **Windows:** libsodium ships bundled with the PyNaCl wheel — no extra step needed.

---

## Your First Task (J06)

**Job:** Crypto Library Evaluation & PoC  
**Phase:** 1 — Cryptographic Core  
**Duration:** ~3 months  
**Skills needed:** Python, libsodium, unit testing, cryptography fundamentals  
**Predecessor:** J02 (Learn Cryptography Fundamentals), J04 (CI/CD Setup)

### What to do

1. **Read `src/crypto/primitives.py` top to bottom.** Do not skip the docstrings.

2. **Run the smoke test:**
   ```bash
   python -m src.crypto.primitives
   ```

3. **Run the test suite and make sure everything passes:**
   ```bash
   pytest tests/test_primitives.py -v --tb=short
   ```

4. **Work through the TODOs in order.** Each one is an exercise:

   | Exercise | Location | What you'll learn |
   |----------|----------|-------------------|
   | 1 | `SymmetricKey.encrypt` | Why nonce reuse breaks confidentiality |
   | 2 | `SymmetricKey.decrypt` | Exception design in crypto code |
   | 3 | `EncryptionKeyPair.encrypt_to` | X25519 DH key agreement internals |
   | 4 | `SigningKeyPair` docstring | Signing vs encryption — why they're different |
   | 5 | `SigningKeyPair.verify` | Handling bad signatures safely |
   | 6 | `derive_key` | HKDF, salt, info, why you never use raw secrets |

5. **Write two new tests** for edge cases you think of that aren't covered yet. Add them to `tests/test_primitives.py`.

6. **Add your answers** to exercises 1–6 as comments in the code. These become part of the team wiki.

7. **Open a PR** when done. Request review from the crypto lead.

### Definition of Done

- [ ] All existing tests pass
- [ ] Two new tests written and passing
- [ ] All 6 TODO comments answered in-code
- [ ] `VaultDecryptionError` wired up in `SymmetricKey.decrypt`
- [ ] PR reviewed and merged

---

## Project Plan

The full project plan lives in `docs/project-plan/`:

| File | Contents |
|------|----------|
| `vault_project_plan.xlsx` | All 41 jobs with Job #, phase, description, duration, start/end months, predecessors, successors, and required skills |
| `vault_project_plan.graphml` | Dependency graph — open in [yEd](https://www.yworks.com/products/yed) and run Layout → Hierarchical |

**Makespan:** ~52 months (~4.3 years) across 7 phases.

### Phase overview

| Phase | Name | Months | Key deliverables |
|-------|------|--------|------------------|
| P0 | Bootstrap | 1–4 | Team formed, crypto + networking studied, CI live |
| P1 | Crypto Core | 6–24 | E2E protocol spec, KMS v1, identity & auth, crypto audit |
| P2 | Backend Core | 25–37 | Messaging service, file storage, workspace API, admin console |
| P3 | Clients | 28–44 | Desktop + mobile apps, offline mode |
| P4 | Collaboration | 6–47 | Video/audio calls, collaborative docs, screen share |
| P5 | Infrastructure | 28–42 | Self-hosted packaging, multi-region, developer API |
| P6 | Enterprise | 25–52 | Post-quantum crypto, compliance escrow, on-device AI, SOC 2 |

---

## Cryptographic Design

> The full spec lives in `docs/protocol-spec.md` (J05 deliverable — not written yet).

### Key hierarchy (sketch)

```
User master key (passkey-derived)
  └── Identity signing key (Ed25519)      → proves you sent a message
  └── Identity encryption key (X25519)   → used in initial key exchange
        └── Per-session symmetric key (XSalsa20-Poly1305)
              └── Per-message key (Double-Ratchet derived)
```

### What the server stores

| Data | Form on server |
|------|---------------|
| Messages | AES-256-GCM ciphertext |
| Files | AES-256-GCM ciphertext (chunked) |
| Encryption keys | Encrypted key bundles (server cannot decrypt) |
| Identity | Public keys only |
| Metadata | Timestamps, sender/recipient IDs, channel IDs |

### What the server never sees

- Message plaintext
- File contents
- Symmetric or private keys in any usable form
- Call audio or video

---

## Team Norms

We'll develop these later

### Branching

```
main          ← stable, protected. PRs only.
develop       ← integration branch
feature/J06-crypto-poc   ← your branch naming format
```

### Commits

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(crypto): add HKDF key derivation function
fix(kms): handle missing key bundle gracefully
docs(readme): add first-task instructions
test(crypto): add avalanche effect test for derive_key
```

### Pull Requests

- Every PR needs at least one reviewer.
- Crypto code needs review from the crypto lead specifically.
- PRs touching `src/crypto/` must include tests.
- No PR merges with failing CI.

### Meetings

- Weekly stand-up: 30 min, async update in `#stand-up` Slack channel if you can't attend.
- Monthly retro: what's blocked, what changed, what we learned.
- Phase kickoffs and retrospectives are mandatory.

### On being a student team

This is a long project. Semesters end, people graduate, life happens. To keep the project healthy:

1. **Document everything** — assume the next person to touch your code has never seen it.
2. **No hero coding** — if you're the only person who understands a subsystem, that's a risk. Pair up.
3. **Done is better than perfect** — ship a working PoC, then improve it.
4. **When in doubt, ask** — especially in the crypto layer. A wrong assumption here is a security bug.

---

## Resources & Reading List

### Cryptography
- *Serious Cryptography* — Jean-Philippe Aumasson (start here, read cover to cover)
- *The Joy of Cryptography* — Mike Rosulek (free PDF, more rigorous)
- [Crypto 101](https://www.crypto101.io/) — free introductory course
- [NaCl / libsodium documentation](https://libsodium.gitbook.io/doc/)
- RFC 5869 — HKDF specification
- [Signal Protocol documentation](https://signal.org/docs/) — Double-Ratchet, X3DH

### Networking & Protocols
- *Computer Networking: A Top-Down Approach* — Kurose & Ross (networking bible)
- [High Performance Browser Networking](https://hpbn.co/) — free, covers WebSockets, WebRTC
- RFC 8446 — TLS 1.3
- [WebRTC for the Curious](https://webrtcforthecurious.com/) — free, excellent

### Distributed Systems
- *Designing Data-Intensive Applications* — Martin Kleppmann (read in Phase 5)
- [The Log: What every software engineer should know](https://engineering.linkedin.com/distributed-systems/log-what-every-software-engineer-should-know-about-real-time-datas-unifying) — Kreps

### Post-Quantum Cryptography
- [NIST PQC project](https://csrc.nist.gov/projects/post-quantum-cryptography)
- NIST FIPS 203 (ML-KEM) — read in Phase 6
- *An Introduction to Mathematical Cryptography* — Hoffstein, Pipher, Silverman

---

## Contributing

Contributions from outside the core team are welcome once the project reaches Phase 2. Until then, focus is on establishing the cryptographic foundations correctly.

Before opening an issue or PR, please read the [Team Norms](#team-norms) section.

---

## License

MIT License — see `LICENSE` for details.

> **Note on cryptography export regulations:** This project implements cryptographic software. Depending on your country of residence, there may be export control regulations that apply to distributing or using this software. Check the laws in your jurisdiction before distributing.
