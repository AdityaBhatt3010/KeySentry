# 🛡️ KeySentry

> 🔍 **KeySentry**: Find leaked API keys & secrets in any GitHub repo. No mercy.

A powerful, no-nonsense CLI tool to **detect unsecured API keys, tokens, and sensitive files** in any GitHub repository.

Inspired by sites like UnsecuredAPIKeys.com — but now you control the scanner. Offline. Local. Fast. Accurate.

---

## 🚀 Features

- 🔎 Scans for 25+ common API key formats (AWS, Stripe, OpenAI, etc.)
- 🧠 Regex-based + entropy-like precision
- 🗂️ Flags sensitive files like `.env`, `credentials.json`, `firebase.json`, `id_rsa`, etc.
- 💾 Outputs findings in a structured JSON log
- 🔧 Lightweight CLI — no GitHub API token required

---

## 📦 Installation

```bash
git clone https://github.com/AdityaBhatt3010/KeySentry.git
cd KeySentry
python3 keysentry_scanner.py --repo https://github.com/username/repo-name --output results.json
```

Optional:

```bash
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
```

---

## 🧪 Usage

### 🔍 Scan a GitHub repo for secrets:

```bash
python keysentry_scanner.py --repo https://github.com/username/repo-name --output results.json
```

### 📁 Sample Output:

```json
[
  {
    "file": "/tmp/tmpabcd1234/app/settings.py",
    "type": "AWS",
    "match": "AKIAIOSFODNN7EXAMPLE"
  },
  {
    "file": "/tmp/tmpabcd1234/.env",
    "type": "Sensitive File",
    "match": ".env"
  }
]
```

---

## 🕵️‍♂️ What It Detects

### 🔐 API Keys:

* AWS, Google, Slack, Stripe, OpenAI, SendGrid, Twilio
* GitHub PATs, DigitalOcean, Heroku, Mailgun, Firebase
* Cloudflare, JWTs, Facebook, Dropbox, Azure, Netlify
* Notion, Terraform Cloud, CircleCI, RSA Private Keys
* BasicAuth URLs, Generic Base64 tokens

### ⚠️ Sensitive Files:

* `.env`, `.env.local`, `.env.production`, `.aws/credentials`
* `credentials.json`, `firebase.json`, `.dockercfg`, `id_rsa`, etc.

---

## 🧠 Future Developments

* ✅ Regex-based API key + sensitive file detection
* ✅ `.env` / `.aws/credentials` and other dangerous file flagging
* 🔜 **Live key validation** (e.g. OpenAI, AWS check if token still works)
* 🔜 **Local repo scan** (e.g., `--local /path/to/repo`)
* 🔜 **GitHub user-wide scan** (scan all public repos of a GitHub username)
* 🔜 GitHub org-wide scanner with batch mode
* 🔜 FastAPI dashboard with SQLite + graph visualizations
* 🔜 Telegram/Discord alert integration for teams

---

## 🧠 Credits

Crafted with ❤️ by [Aditya Bhatt](https://github.com/AdityaBhatt3010) — Cybersecurity & VAPT Specialist.

---

## ⚠️ Disclaimer

For educational & auditing use only. Do **not** use this tool on repositories you don't own or lack explicit permission to scan.

---