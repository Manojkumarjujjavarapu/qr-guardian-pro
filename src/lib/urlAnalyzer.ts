export type ThreatLevel = 'safe' | 'suspicious' | 'malicious';

export interface AnalysisResult {
  url: string;
  threatLevel: ThreatLevel;
  riskScore: number;
  threats: string[];
  details: {
    domain: string;
    protocol: string;
    path: string;
    hasIPAddress: boolean;
    hasSuspiciousPatterns: boolean;
    hasRedirects: boolean;
    hasSuspiciousExtension: boolean;
    isShortened: boolean;
    hasPhishingKeywords: boolean;
    hasExcessiveSubdomains: boolean;
    hasEncodedCharacters: boolean;
    hasPortNumber: boolean;
  };
  timestamp: Date;
}

// Known URL shortening services
const URL_SHORTENERS = [
  'bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'ow.ly', 'is.gd', 'buff.ly',
  'adf.ly', 'j.mp', 'rb.gy', 'cutt.ly', 'shorturl.at', 'tiny.cc', 'bc.vc',
  'v.gd', 'clck.ru', 'shorte.st', 'cli.re', 'short.io'
];

// Suspicious file extensions
const SUSPICIOUS_EXTENSIONS = [
  '.exe', '.bat', '.cmd', '.scr', '.pif', '.msi', '.jar', '.vbs', '.js',
  '.ws', '.wsf', '.ps1', '.hta', '.cpl', '.msc', '.gadget', '.application',
  '.scf', '.lnk', '.inf', '.reg', '.dll', '.apk', '.dmg', '.iso'
];

// Phishing keywords
const PHISHING_KEYWORDS = [
  'login', 'signin', 'sign-in', 'verify', 'verification', 'update', 'secure',
  'account', 'password', 'credential', 'banking', 'paypal', 'amazon', 'apple',
  'microsoft', 'google', 'facebook', 'netflix', 'confirm', 'suspend', 'locked',
  'urgent', 'immediately', 'expired', 'validate', 'authenticate', 'wallet',
  'crypto', 'bitcoin', 'eth', 'reward', 'winner', 'prize', 'free', 'gift'
];

// Known malicious TLDs
const SUSPICIOUS_TLDS = [
  '.tk', '.ml', '.ga', '.cf', '.gq', '.top', '.work', '.click', '.link',
  '.xyz', '.pw', '.cc', '.ws', '.buzz', '.surf', '.rest', '.fit'
];

// Suspicious patterns in URLs
const SUSPICIOUS_PATTERNS = [
  /[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/, // IP address
  /@/, // Contains @ symbol (credential phishing)
  /data:/i, // Data URI
  /javascript:/i, // JavaScript URI
  /vbscript:/i, // VBScript URI
  /%[0-9a-f]{2}/i, // URL encoded characters
  /\.(php|asp|aspx|jsp|cgi)\?/i, // Dynamic pages with parameters
  /redirect|redir|url=|goto|return|next=/i, // Redirect parameters
  /base64/i, // Base64 encoding
  /eval|exec|system|cmd/i, // Command injection patterns
];

// Homograph attack detection (look-alike characters)
const HOMOGRAPH_CHARS: Record<string, string[]> = {
  'a': ['а', 'ɑ', 'α'],
  'e': ['е', 'ε'],
  'o': ['о', 'ο'],
  'p': ['р', 'ρ'],
  'c': ['с', 'ϲ'],
  'x': ['х', 'χ'],
  'y': ['у', 'γ'],
  'n': ['η'],
  'i': ['і', 'ι'],
  's': ['ѕ'],
};

export function analyzeUrl(rawUrl: string): AnalysisResult {
  const threats: string[] = [];
  let riskScore = 0;

  // Parse URL
  let url: URL;
  let urlString = rawUrl.trim();
  
  // Add protocol if missing
  if (!urlString.match(/^https?:\/\//i)) {
    urlString = 'http://' + urlString;
  }

  try {
    url = new URL(urlString);
  } catch {
    return {
      url: rawUrl,
      threatLevel: 'malicious',
      riskScore: 100,
      threats: ['Invalid URL format - potential obfuscation attempt'],
      details: {
        domain: 'INVALID',
        protocol: 'unknown',
        path: '',
        hasIPAddress: false,
        hasSuspiciousPatterns: true,
        hasRedirects: false,
        hasSuspiciousExtension: false,
        isShortened: false,
        hasPhishingKeywords: false,
        hasExcessiveSubdomains: false,
        hasEncodedCharacters: false,
        hasPortNumber: false,
      },
      timestamp: new Date(),
    };
  }

  const domain = url.hostname.toLowerCase();
  const path = url.pathname + url.search;
  const fullUrl = url.href.toLowerCase();

  // Check for IP address instead of domain
  const hasIPAddress = /^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$/.test(domain);
  if (hasIPAddress) {
    threats.push('URL uses IP address instead of domain name');
    riskScore += 35;
  }

  // Check protocol
  if (url.protocol === 'http:') {
    threats.push('Insecure HTTP connection (no encryption)');
    riskScore += 15;
  }

  // Check for URL shorteners
  const isShortened = URL_SHORTENERS.some(shortener => domain.includes(shortener));
  if (isShortened) {
    threats.push('URL shortener detected - destination hidden');
    riskScore += 20;
  }

  // Check for suspicious file extensions
  const hasSuspiciousExtension = SUSPICIOUS_EXTENSIONS.some(ext => 
    path.toLowerCase().endsWith(ext)
  );
  if (hasSuspiciousExtension) {
    threats.push('Suspicious file extension detected');
    riskScore += 40;
  }

  // Check for phishing keywords
  const foundPhishingKeywords = PHISHING_KEYWORDS.filter(keyword =>
    fullUrl.includes(keyword)
  );
  const hasPhishingKeywords = foundPhishingKeywords.length > 0;
  if (hasPhishingKeywords) {
    threats.push(`Phishing keywords detected: ${foundPhishingKeywords.slice(0, 3).join(', ')}`);
    riskScore += 15 + (foundPhishingKeywords.length * 3);
  }

  // Check for suspicious TLDs
  const hasSuspiciousTld = SUSPICIOUS_TLDS.some(tld => domain.endsWith(tld));
  if (hasSuspiciousTld) {
    threats.push('Suspicious top-level domain (TLD)');
    riskScore += 15;
  }

  // Check for excessive subdomains
  const subdomainCount = domain.split('.').length - 2;
  const hasExcessiveSubdomains = subdomainCount > 3;
  if (hasExcessiveSubdomains) {
    threats.push('Excessive subdomains (potential subdomain attack)');
    riskScore += 20;
  }

  // Check for encoded characters
  const hasEncodedCharacters = /%[0-9a-f]{2}/i.test(fullUrl);
  if (hasEncodedCharacters) {
    threats.push('URL contains encoded characters');
    riskScore += 10;
  }

  // Check for non-standard port
  const hasPortNumber = url.port !== '' && url.port !== '80' && url.port !== '443';
  if (hasPortNumber) {
    threats.push(`Non-standard port: ${url.port}`);
    riskScore += 15;
  }

  // Check for suspicious patterns
  let hasSuspiciousPatterns = false;
  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(fullUrl)) {
      hasSuspiciousPatterns = true;
      break;
    }
  }
  if (hasSuspiciousPatterns) {
    threats.push('Suspicious URL pattern detected');
    riskScore += 25;
  }

  // Check for redirect parameters
  const hasRedirects = /redirect|redir|url=|goto|return|next=/i.test(fullUrl);
  if (hasRedirects) {
    threats.push('URL redirect parameter detected');
    riskScore += 15;
  }

  // Check for homograph attacks
  let hasHomograph = false;
  for (const [latin, cyrillic] of Object.entries(HOMOGRAPH_CHARS)) {
    for (const char of cyrillic) {
      if (domain.includes(char)) {
        hasHomograph = true;
        break;
      }
    }
    if (hasHomograph) break;
  }
  if (hasHomograph) {
    threats.push('Potential homograph attack (look-alike characters)');
    riskScore += 45;
  }

  // Check for long URL (potential obfuscation)
  if (fullUrl.length > 200) {
    threats.push('Unusually long URL');
    riskScore += 10;
  }

  // Cap risk score at 100
  riskScore = Math.min(100, riskScore);

  // Determine threat level
  let threatLevel: ThreatLevel;
  if (riskScore >= 50) {
    threatLevel = 'malicious';
  } else if (riskScore >= 20) {
    threatLevel = 'suspicious';
  } else {
    threatLevel = 'safe';
  }

  return {
    url: rawUrl,
    threatLevel,
    riskScore,
    threats: threats.length > 0 ? threats : ['No threats detected'],
    details: {
      domain,
      protocol: url.protocol.replace(':', ''),
      path,
      hasIPAddress,
      hasSuspiciousPatterns,
      hasRedirects,
      hasSuspiciousExtension,
      isShortened,
      hasPhishingKeywords,
      hasExcessiveSubdomains,
      hasEncodedCharacters,
      hasPortNumber,
    },
    timestamp: new Date(),
  };
}
