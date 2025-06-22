# KeySentry - MVP CLI Tool to Scan Repos for API Key Leaks

import re
import os
import json
import argparse
import tempfile
import subprocess
from pyfiglet import figlet_format
from termcolor import colored

# Define regex patterns for API keys
key_patterns = {
    "AWS": r"AKIA[0-9A-Z]{16}",
    "Google": r"AIza[0-9A-Za-z-_]{35}",
    "Slack": r"xox[baprs]-[0-9a-zA-Z]{10,48}",
    "Stripe": r"sk_live_[0-9a-zA-Z]{24}",
    "SendGrid": r"SG\.[A-Za-z0-9-_]{22}\.[A-Za-z0-9-_]{43}",
    "Twilio": r"SK[0-9a-fA-F]{32}",
    "GitHub": r"gh[pousr]_[A-Za-z0-9_]{36,255}",
    "OpenAI": r"sk-[a-zA-Z0-9]{48}",
    "Heroku": r"[hH]eroku[a-z0-9]{32}",
    "Mailgun": r"key-[0-9a-zA-Z]{32}",
    "Firebase": r"AAA[A-Za-z0-9_-]{7}:[A-Za-z0-9_-]{140}",
    "DigitalOcean": r"dop_v1_[a-f0-9]{64}",
    "Cloudflare": r"(cf-[a-z0-9]{32}|Bearer [a-zA-Z0-9_-]{40,60})",
    "JWT": r"eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+",
    "RSA Private Key": r"-----BEGIN RSA PRIVATE KEY-----",
    "Facebook": r"EAACEdEose0cBA[0-9A-Za-z]+",
    "Azure Storage": r"DefaultEndpointsProtocol=https;AccountName=[a-z0-9]+;AccountKey=[A-Za-z0-9+/=]+",
    "Dropbox": r"sl\.[A-Za-z0-9-_]{20,}",
    "Notion": r"secret_[a-zA-Z0-9]{43}",
    "Netlify": r"Bearer [a-zA-Z0-9_-]{40,60}",
    "Terraform": r"tfr_[A-Za-z0-9]{32}",
    "CircleCI": r"circle-token [a-f0-9]{40}",
    "BasicAuth": r"https?:\/\/[A-Za-z0-9_\-]+:[A-Za-z0-9_\-]+@",
    "Generic Base64": r"(?<![A-Za-z0-9+/=])[A-Za-z0-9+/]{32,}={0,2}(?![A-Za-z0-9+/=])",
}

# Define sensitive filenames that shouldn't be committed
sensitive_filenames = [
    ".env", ".env.local", ".env.production", ".env.dev", ".env.test",
    "credentials.json", "firebase.json", ".aws/credentials", ".npmrc", ".dockercfg",
    "id_rsa", "id_rsa.pub", ".pypirc"
]

def stylish_heading():
    title = figlet_format("KeySentry", font="starwars", width=120)
    print(colored(title, "cyan"))

def clone_repo(repo_url):
    temp_dir = tempfile.mkdtemp()
    subprocess.run(["git", "clone", repo_url, temp_dir], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    return temp_dir

def scan_file(file_path, seen_matches):
    matches = []
    try:
        with open(file_path, "r", errors="ignore") as f:
            content = f.read()
            for key_type, pattern in key_patterns.items():
                for match in re.findall(pattern, content):
                    key = (key_type, match)
                    if key not in seen_matches:
                        seen_matches.add(key)
                        matches.append({"file": file_path, "type": key_type, "match": match})
    except:
        pass
    return matches

def scan_repo(path):
    leaks = []
    seen_matches = set()
    for root, _, files in os.walk(path):
        for file in files:
            full_path = os.path.join(root, file)
            leaks.extend(scan_file(full_path, seen_matches))
            for sensitive_file in sensitive_filenames:
                if file.endswith(sensitive_file) or sensitive_file in full_path:
                    key = ("Sensitive File", sensitive_file)
                    if key not in seen_matches:
                        seen_matches.add(key)
                        leaks.append({"file": full_path, "type": "Sensitive File", "match": sensitive_file})
    return leaks

def main():
    stylish_heading()
    parser = argparse.ArgumentParser(description="Scan a GitHub repo or local path for exposed API keys and sensitive files")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--repo", help="GitHub repo URL")
    group.add_argument("--local", help="Path to local folder to scan")
    parser.add_argument("--output", default="leaks.json", help="Output JSON file")
    args = parser.parse_args()

    if args.repo:
        print(colored(f"[*] Cloning {args.repo}...", "yellow"))
        repo_path = clone_repo(args.repo)
    else:
        repo_path = args.local
        print(colored(f"[*] Scanning local folder: {repo_path}", "yellow"))

    print(colored("[*] Scanning for secrets and sensitive files...", "yellow"))
    leaks = scan_repo(repo_path)

    print(colored(f"[*] {len(leaks)} unique issues found.", "red" if leaks else "green"))
    with open(args.output, "w") as out:
        json.dump(leaks, out, indent=4)

    for leak in leaks:
        print(colored(f"[!] {leak['type']} found in {leak['file']} → {leak['match']}", "magenta"))

    print(colored(f"\n✅ Scan complete. Results stored in {args.output}", "cyan"))

if __name__ == "__main__":
    main()
