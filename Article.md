# 🛡️ Stop API Key Leaks Before They Cost You — Meet KeySentry

> By Aditya Bhatt | API Security | Python CLI | Secrets Detection

API key leaks are one of the most overlooked yet devastating vulnerabilities in today’s codebases. From AWS credentials accidentally pushed to GitHub to `.env` files exposing secrets in public repositories — these slips can lead to full account compromise, service misuse, and financial damage.

That’s why I built **KeySentry**, a CLI tool designed to **hunt down leaked API keys and sensitive files** — both in public GitHub repositories and local projects — **before** malicious actors get to them.

![1750619361869](https://github.com/user-attachments/assets/ac5f8c7d-3f36-4815-a8de-b7abbfe5be9f) <br/>

---

## 🚀 What is KeySentry?

KeySentry is an open-source, no-nonsense scanner that lets you quickly detect leaked secrets in codebases. Inspired by platforms like UnsecuredAPIKeys.com, KeySentry gives you full control — fast, local, and private.

* 🧠 Regex + entropy-inspired key matching
* 🗂️ Flags sensitive files (`.env`, `credentials.json`, `id_rsa`, etc.)
* 💾 Outputs to structured JSON logs
* 📁 Works with GitHub URLs or local folders
* 🧩 No GitHub API tokens required

---

## 🔍 How Does It Work?

When you run KeySentry, it performs the following steps:

1. **Input Selection**: You provide either a GitHub repo (`--repo`) or a local directory (`--local`).
2. **Cloning (if repo)**: The target repo is cloned into a temporary directory.
3. **Scanning**: Each file is read and searched for known patterns of secrets and filenames.
4. **Detection**: Results are de-duplicated and stored in a JSON file.
5. **Logging**: Each match is printed to the terminal with proper highlighting.

Under the hood, it uses a combination of:

* Carefully crafted **regular expressions** for 25+ key formats.
* Scans for sensitive filenames like `.env`, `.aws/credentials`, etc.
* A simple file-walker to traverse all project files.

---

## 🔐 What Secrets Are Detected?

### ✅ API Key Patterns

KeySentry is built to recognize leaks of:

* **AWS** Access Keys (AKIA…)
* **Google** API Keys
* **Slack**, **Stripe**, **SendGrid**, **Twilio** tokens
* **OpenAI**, **Heroku**, **Mailgun**, **Firebase** credentials
* **GitHub** PATs (Personal Access Tokens)
* **DigitalOcean**, **Cloudflare**, **JWTs**, **Facebook** tokens
* **Azure**, **Dropbox**, **Notion**, **Netlify**, **Terraform Cloud**, **CircleCI**, **BasicAuth** URLs
* **RSA Private Keys** and **Base64-encoded blobs**

### 🗃️ Sensitive Files

It also flags risky files like:

* `.env`, `.env.local`, `.aws/credentials`, `.dockercfg`
* `credentials.json`, `firebase.json`, `id_rsa`, `.pypirc`, `.npmrc`

These files should never be committed or publicly exposed.

---

## 💡 Why Use KeySentry?

* 🧪 **Audit before commit**: Run scans before pushing code.
* 🔍 **Harden your GitHub repos**: Quickly scan public-facing projects.
* ⚠️ **Prevention over reaction**: Stop leaks before attackers find them.
* 👨‍💻 **Built for red teams, bug hunters, and developers**.

---

## 🧪 Sample Command

### Scan a GitHub Repository

```bash
python KeySentry.py --repo https://github.com/username/repo-name --output results.json
```

### Scan a Local Directory

```bash
python KeySentry.py --local /path/to/codebase --output local_results.json
```

---

## 🖼️ Screenshots

| GitHub Scan                               | Local Scan                                     | Help Menu                     |
| ----------------------------------------- | ---------------------------------------------- | ----------------------------- |
| ![GitHub Scan](Screenshots/KeySentry.png) | ![Local Scan](Screenshots/KeySentry_local.png) | ![Help](Screenshots/Help.png) |

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

## 📌 Final Thoughts

Secrets get leaked more often than you’d think — and when they do, it’s often too late. With KeySentry, you’re empowered to find those slips fast, locally, and securely.

**Stop key leaks before they cost you. Scan it with KeySentry.**

GitHub: [https://github.com/AdityaBhatt3010/KeySentry](https://github.com/AdityaBhatt3010/KeySentry)

---

## ⚠️ Disclaimer

This tool is for ethical security auditing only. Do not scan repositories you do not own or lack explicit permission to analyze.

---

Crafted by Aditya Bhatt — Cybersecurity & VAPT Specialist
