# 🛡️ KeySentry — Stop API Key Leaks Before They Stop You

Secrets are the lifeblood of modern applications. A single leaked AWS credential, Slack token, or Firebase config can cause massive breaches, financial losses, or reputation damage.

That’s exactly why I built **KeySentry** — a **powerful, no-nonsense security tool** that detects leaked API keys, tokens, and sensitive files in your GitHub repositories or local projects.

Think of it as your **early warning system**: before attackers find your secrets, KeySentry flags them.

![a-dark-cyberpunk-themed-digital-poster-w_-YePJ_1tRI2sxaEUqdGSIQ_a62RDOYRQqOHTq_0JMh4zg](https://github.com/user-attachments/assets/0f0d606f-0d36-4afc-8412-f205ede686e3) <br/>

---

## 🔍 What is KeySentry?

**KeySentry is a dual-mode security scanner**:

* 🖥️ **Command-line scanner (CLI)** → Scan GitHub repos or local directories directly.
* 🌐 **Frontend web scanner** → Paste any GitHub URL and get instant results in your browser.

It’s built for **speed, accuracy, and simplicity** — no GitHub tokens required, no complex setup, just results that matter.

👉 Live frontend scanner: [https://key-sentry.netlify.app/](https://key-sentry.netlify.app/) <br/>
👉 GitHub repo: [https://github.com/AdityaBhatt3010/KeySentry](https://github.com/AdityaBhatt3010/KeySentry) <br/>
👉 DockerHub image: [https://hub.docker.com/r/adityabhatt3010/keysentry](https://hub.docker.com/r/adityabhatt3010/keysentry) <br/>

---

## 🚀 Features That Make It Different

* 🔎 **Scans 25+ API key formats** → AWS, Google, Slack, Stripe, OpenAI, Firebase, Twilio, GitHub, and more.
* 🧠 **Regex + entropy-based patterns** → to catch both standard and custom secret formats with high accuracy.
* 🗂️ **Sensitive file detection** → `.env`, `id_rsa`, `firebase.json`, `.aws/credentials`, `credentials.json`, and more.
* 💾 **Structured JSON outputs** → so you can integrate results into pipelines or reports.
* 🧩 **Flexible input** → works with both GitHub repo URLs and local directories.
* 💻 **No GitHub tokens needed** → works standalone.
* ⚡ **Beautiful CLI experience** → colorful logs and styled banners.
* 🌐 **Web-based scanner** → hosted on Netlify, perfect for instant audits.
* 🐳 **Docker support** → run anywhere, containerized and portable.

---

## 🧪 How to Use KeySentry

**1️⃣ Local Installation**

```bash
git clone https://github.com/AdityaBhatt3010/KeySentry.git
cd KeySentry
pip install -r requirements.txt
```

**2️⃣ GitHub Repository Scan**

```bash
python KeySentry.py --repo https://github.com/username/repo-name --output results.json
```

**3️⃣ Local Directory Scan**

```bash
python KeySentry.py --local /path/to/codebase --output results_local.json
```

**4️⃣ Docker Run (no setup needed)**

```bash
docker run --rm adityabhatt3010/keysentry --repo https://github.com/username/repo-name --output results.json
```

**5️⃣ Or go serverless in your browser**
👉 [Scan instantly via Web Scanner](https://key-sentry.netlify.app/)

---

## 📸 Screenshots

### 🌐 Web Interface Scanner

![Frontend Scanner](Screenshots/Site_Scanner.png) <br/>

![Frontend Results](Screenshots/Site_Results.png) <br/>

![Frontend Analytics](Screenshots/Site_Analytics.png) <br/>

### 🧪 CLI Scaner

![GitHub Scan](Screenshots/KeySentry.png) <br/>

![Local Scan](Screenshots/KeySentry_local.png) <br/>

![Help](Screenshots/Help.png) <br/>

### ⚙️ Docker Build & Run

![Docker Build](Screenshots/Docker_Build_Image.png) <br/>

![Docker Run](Screenshots/Docker_Run_Image.png) <br/>

---

## 📁 Example Output

Here’s what KeySentry finds when it detects leaked secrets:

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

No noise. Just clean, actionable results.

---

## 🔐 What KeySentry Detects

* **API Keys**:
  AWS, Google, Slack, Stripe, OpenAI, SendGrid, Twilio, GitHub, DigitalOcean, Heroku, Firebase, Cloudflare, JWT, Facebook, Dropbox, Azure, Netlify, Notion, Terraform, CircleCI, BasicAuth, and more.

* **Sensitive Files**:
  `.env`, `.env.local`, `.aws/credentials`, `.dockercfg`, `credentials.json`, `firebase.json`, `id_rsa`, `.pypirc`, etc.

---

## 🧠 Roadmap

✅ Full local & GitHub scanning <br/>
✅ JSON reporting <br/>
✅ Docker support <br/>
🔜 GitHub org-wide scans <br/>
🔜 FastAPI dashboard + SQLite storage <br/>
🔜 Discord/Telegram alerts <br/>

---

## 📌 Why You Should Use It

Attackers don’t hack in anymore. They **log in with leaked secrets**.

KeySentry gives you:

* ⚡ **Prevention** → Catch exposures before attackers or bots scrape them.
* 🧪 **Audit power** → Perfect for DevSecOps teams, bug bounty hunters, and researchers.
* 🔍 **Visibility** → Find risky files and API keys in seconds.

It’s lightweight, fast, and deadly accurate — built for people who don’t want security theater, only real results.

---

## 👨‍💻 Crafted By

Made with ❤️ by **Aditya Bhatt** — Cybersecurity & VAPT Specialist.

👉 GitHub: [https://github.com/AdityaBhatt3010/KeySentry](https://github.com/AdityaBhatt3010/KeySentry) <br/>
👉 Netlify Frontend: [https://key-sentry.netlify.app/](https://key-sentry.netlify.app/) <br/>
👉 DockerHub: [https://hub.docker.com/r/adityabhatt3010/keysentry](https://hub.docker.com/r/adityabhatt3010/keysentry) <br/> <br/>

📖 Optional deep-dive: [Article 1](https://infosecwriteups.com/%EF%B8%8F-stop-api-key-leaks-before-they-cost-you-meet-keysentry-5521f6c75ab0) <br/>

---

## ⚠️ Disclaimer

KeySentry is for **educational and auditing use only**.
Do not use it on repositories you don’t own or lack permission to scan.

---

🔥 **KeySentry isn’t just a scanner — it’s your first line of defense against secret leaks.**

---
