// Client-side pattern matching using your exact regex patterns
export const keyPatterns = {
  "AWS": /AKIA[0-9A-Z]{16}/g,
  "Google": /AIza[0-9A-Za-z\-_]{35}/g,
  "Slack": /xox[baprs]-[0-9a-zA-Z]{10,48}/g,
  "Stripe": /sk_live_[0-9a-zA-Z]{24}/g,
  "SendGrid": /SG\.[A-Za-z0-9\-_]{22}\.[A-Za-z0-9\-_]{43}/g,
  "Twilio": /SK[0-9a-fA-F]{32}/g,
  "GitHub": /gh[pousr]_[A-Za-z0-9_]{36,255}/g,
  "OpenAI": /sk-[a-zA-Z0-9]{48}/g,
  "Heroku": /[hH]eroku[a-z0-9]{32}/g,
  "Mailgun": /key-[0-9a-zA-Z]{32}/g,
  "Firebase": /AAA[A-Za-z0-9_\-]{7}:[A-Za-z0-9_\-]{140}/g,
  "DigitalOcean": /dop_v1_[a-f0-9]{64}/g,
  "Cloudflare": /(cf-[a-z0-9]{32}|Bearer [a-zA-Z0-9_\-]{40,60})/g,
  "JWT": /eyJ[A-Za-z0-9_\-]+\.[A-Za-z0-9_\-]+\.[A-Za-z0-9_\-]+/g,
  "RSA Private Key": /-----BEGIN RSA PRIVATE KEY-----/g,
  "Facebook": /EAACEdEose0cBA[0-9A-Za-z]+/g,
  "Azure Storage": /DefaultEndpointsProtocol=https;AccountName=[a-z0-9]+;AccountKey=[A-Za-z0-9+\/=]+/g,
  "Dropbox": /sl\.[A-Za-z0-9\-_]{20,}/g,
  "Notion": /secret_[a-zA-Z0-9]{43}/g,
  "Netlify": /Bearer [a-zA-Z0-9_\-]{40,60}/g,
  "Terraform": /tfr_[A-Za-z0-9]{32}/g,
  "CircleCI": /circle-token [a-f0-9]{40}/g,
  "BasicAuth": /https?:\/\/[A-Za-z0-9_\-]+:[A-Za-z0-9_\-]+@/g,
  "Generic Base64": /(?<![A-Za-z0-9+\/=])[A-Za-z0-9+\/]{32,}={0,2}(?![A-Za-z0-9+\/=])/g,
};

// Sensitive filenames that shouldn't be committed
export const sensitiveFilenames = [
  ".env", ".env.local", ".env.production", ".env.dev", ".env.test",
  "credentials.json", "firebase.json", ".aws/credentials", ".npmrc", ".dockercfg",
  "id_rsa", "id_rsa.pub", ".pypirc"
];

export interface ScanMatch {
  file: string;
  type: string;
  match: string;
  line: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

export const getSeverity = (keyType: string): 'critical' | 'high' | 'medium' | 'low' => {
  const criticalTypes = ['AWS', 'Stripe', 'SendGrid', 'RSA Private Key', 'Azure Storage'];
  const highTypes = ['Google', 'Slack', 'Twilio', 'GitHub', 'OpenAI', 'Facebook'];
  const mediumTypes = ['JWT', 'Heroku', 'Mailgun', 'Firebase', 'DigitalOcean', 'Cloudflare', 'Dropbox', 'Notion', 'Netlify', 'Terraform', 'CircleCI'];
  
  if (criticalTypes.includes(keyType)) return 'critical';
  if (highTypes.includes(keyType)) return 'high';
  if (mediumTypes.includes(keyType)) return 'medium';
  return 'low';
};

export const scanFileContent = (fileName: string, content: string): ScanMatch[] => {
  const matches: ScanMatch[] = [];
  const lines = content.split('\n');
  const seenMatches = new Set<string>();

  // Check for sensitive filenames
  for (const sensitiveFile of sensitiveFilenames) {
    if (fileName.endsWith(sensitiveFile) || fileName.includes(sensitiveFile)) {
      const key = `Sensitive File:${sensitiveFile}`;
      if (!seenMatches.has(key)) {
        seenMatches.add(key);
        matches.push({
          file: fileName,
          type: 'Sensitive File',
          match: sensitiveFile,
          line: 1,
          severity: 'high'
        });
      }
    }
  }

  // Scan content for API keys
  lines.forEach((line, lineIndex) => {
    for (const [keyType, pattern] of Object.entries(keyPatterns)) {
      const lineMatches = line.match(pattern);
      if (lineMatches) {
        lineMatches.forEach(match => {
          const key = `${keyType}:${match}`;
          if (!seenMatches.has(key)) {
            seenMatches.add(key);
            matches.push({
              file: fileName,
              type: keyType,
              match: match,
              line: lineIndex + 1,
              severity: getSeverity(keyType)
            });
          }
        });
      }
    }
  });

  return matches;
};