# 🛡️ KeySentry

> 🔍 **KeySentry**: Find leaked API keys & secrets in any GitHub repo or local project. No mercy.

A powerful, no-nonsense tool to **detect unsecured API keys, tokens, and sensitive files** — either via **command-line scan** or a **beautifully built frontend web scanner**.

![a-dark-cyberpunk-themed-digital-poster-w_-YePJ_1tRI2sxaEUqdGSIQ_a62RDOYRQqOHTq_0JMh4zg](https://github.com/user-attachments/assets/0f0d606f-0d36-4afc-8412-f205ede686e3) <br/>

---

## 🚀 Features

- 🔎 Scans for 25+ common API key formats (AWS, Slack, Stripe, OpenAI, etc.)
- 🧠 Regex + entropy-inspired patterns for high accuracy
- 🗂️ Flags sensitive files like `.env`, `id_rsa`, `firebase.json`, etc.
- 💾 Outputs structured results to JSON
- 🧩 Supports both **GitHub repo URLs** and **local folder paths**
- 💻 No GitHub API tokens needed
- ⚡ Styled terminal banner and colorful terminal logs
- 🌐 **Frontend scanner** hosted on Netlify for ease of use

---

## 🌐 Live Frontend

We now have a **frontend interface** (located in `project/` folder) for easier scanning.

> 🔗 https://key-sentry.netlify.app/

Paste a GitHub repo URL and instantly view results in your browser.

---

## 🐳 Docker Support

You can build and run the CLI version via Docker.

### 📁 Dockerfile Provided

A ready-to-use Dockerfile is included.

### 📤 DockerHub Image

➡️ https://hub.docker.com/r/adityabhatt3010/keysentry

---

## 📦 Installation

### 🔧 Local Installation

```bash
git clone https://github.com/AdityaBhatt3010/KeySentry.git
cd KeySentry
pip install -r requirements.txt
````

### 🐳 Pull from DockerHub

```bash
docker pull adityabhatt3010/keysentry
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

### ▶️ Using Docker:

```bash
docker run --rm adityabhatt3010/keysentry --repo https://github.com/username/repo-name --output results.json
```

---

## 📸 Screenshots

### 🌐 Web Interface Scanner

![Frontend Scanner](Screenshots/Site_Scanner.jpg) <br/>

![Frontend Results](Screenshots/Site_Results.jpg) <br/>

![Frontend Analytics](Screenshots/Site_Analytics.jpg) <br/>

### 🧪 CLI Scaner

![GitHub Scan](Screenshots/KeySentry.png) <br/>

![Local Scan](Screenshots/KeySentry_local.png) <br/>

![Help](Screenshots/Help.png) <br/>

### ⚙️ Docker Build & Run

![Docker Build](Screenshots/Docker_ <br/>Build_Image.png)

![Docker Run](Screenshots/Docker_Run_Imag <br/>e.png)

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

* AWS, Google, Slack, Stripe, OpenAI, SendGrid, Twilio
* GitHub, DigitalOcean, Heroku, Mailgun, Firebase
* Cloudflare, JWT, Facebook, Dropbox, Azure
* Netlify, Notion, Terraform, CircleCI, BasicAuth
* RSA Private Keys, Base64 blobs, and more

### Sensitive Files:

* `.env`, `.env.local`, `.aws/credentials`, `.dockercfg`
* `credentials.json`, `firebase.json`, `id_rsa`, `.pypirc`, etc.

---

## 🧠 Future Roadmap

* ✅ Full local & GitHub scanning
* ✅ Structured JSON reporting
* ✅ Docker support
* 🔜 Live token validation (OpenAI/AWS, etc.)
* 🔜 GitHub username/org-wide scan
* 🔜 FastAPI dashboard w/ SQLite visualization
* 🔜 Discord/Telegram alert integrations

---

## 👨‍💻 Crafted By

Made with ❤️ by [Aditya Bhatt](https://github.com/AdityaBhatt3010) — Cybersecurity & VAPT Specialist.

---

## ⚠️ Disclaimer

For educational & auditing use only. Do **not** use this tool on repositories you don't own or lack permission to scan.

---
