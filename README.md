# 🛡️ KeySentry

> 🔍 **KeySentry**: Find leaked API keys & secrets in any GitHub repo or local project. No mercy.

A powerful, no-nonsense CLI tool to **detect unsecured API keys, tokens, and sensitive files** across GitHub repositories or local codebases.

![1750619361869](https://github.com/user-attachments/assets/ac5f8c7d-3f36-4815-a8de-b7abbfe5be9f) <br/>

---

## 🚀 Features

- 🔎 Scans for 25+ common API key formats (AWS, Slack, Stripe, OpenAI, etc.)
- 🧠 Regex + entropy-inspired patterns for high accuracy
- 🗂️ Flags sensitive files like `.env`, `id_rsa`, `firebase.json`, and more
- 💾 Outputs structured results to JSON
- 🧩 Supports both GitHub repo URLs and **local folder paths**
- 💻 No need for GitHub API tokens
- ⚡ Styled terminal banner and colored logs

---

## 📦 Installation

```bash
git clone https://github.com/AdityaBhatt3010/KeySentry.git
cd KeySentry
pip install -r requirements.txt
```

---

## 🧪 Usage

### 🔍 Scan a GitHub repository:

```bash
python KeySentry.py --repo https://github.com/username/repo-name --output results.json
```

### 💻 Scan a local directory:

```bash
python KeySentry.py --local /path/to/codebase --output results_local.json
```

---

## 📸 Screenshots

### 🎯 Scanning GitHub Repo
![GitHub Scan](Screenshots/KeySentry.png)

### 💻 Scanning Local Directory
![Local Scan](Screenshots/KeySentry_local.png)

### 🆘 Help Menu
![Help](Screenshots/Help.png)

---

## 📁 Sample Output

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

## 🔐 What It Detects

### API Keys:

- AWS, Google, Slack, Stripe, OpenAI, SendGrid, Twilio
- GitHub, DigitalOcean, Heroku, Mailgun, Firebase
- Cloudflare, JWT, Facebook, Dropbox, Azure
- Netlify, Notion, Terraform, CircleCI, BasicAuth
- RSA Private Keys, Base64 tokens, and more

### Sensitive Files:

- `.env`, `.env.local`, `.aws/credentials`, `.dockercfg`
- `credentials.json`, `firebase.json`, `id_rsa`, `.pypirc`, etc.

---

## 🧠 Future Roadmap

- ✅ Full local & GitHub scanning
- ✅ Structured JSON reporting
- 🔜 Live token validation (OpenAI/AWS, etc.)
- 🔜 GitHub username/org-wide scan
- 🔜 FastAPI dashboard w/ SQLite visualization
- 🔜 Discord/Telegram alert integrations

---

## 👨‍💻 Crafted By

Made with ❤️ by [Aditya Bhatt](https://github.com/AdityaBhatt3010) — Cybersecurity & VAPT Specialist.

---

## ⚠️ Disclaimer

For educational & auditing use only. Do **not** use this tool on repositories you don't own or lack permission to scan.

---
