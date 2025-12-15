// Security utilities for creating and validating secure links
import crypto from 'crypto';

interface SecureLinkData {
  email: string;
  segment: string;
  timestamp: number;
}

export function createSecureLink(data: SecureLinkData): string {
  const payload = JSON.stringify(data);
  const secret = process.env.REPORT_LINK_SECRET || 'default-secret';
  const expiry = process.env.REPORT_LINK_EXPIRY_DAYS || '7';
  
  // Create HMAC signature
  const signature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('base64');
  
  // Combine payload and signature
  const encodedPayload = Buffer.from(payload).toString('base64');
  const combined = `${encodedPayload}.${signature}`;
  
  // Add expiry timestamp
  const expiryMs = parseInt(expiry) * 24 * 60 * 60 * 1000;
  const expiryTimestamp = Date.now() + expiryMs;
  
  return `token=${combined}&expires=${expiryTimestamp}`;
}

export function validateSecureLink(token: string): { valid: boolean; data?: SecureLinkData; error?: string } {
  try {
    const secret = process.env.REPORT_LINK_SECRET || 'default-secret';
    const params = new URLSearchParams(token);
    const encodedPayload = params.get('token');
    const expires = params.get('expires');
    
    if (!encodedPayload || !expires) {
      return { valid: false, error: 'Invalid token format' };
    }
    
    // Check expiry
    const expiryTimestamp = parseInt(expires);
    if (Date.now() > expiryTimestamp) {
      return { valid: false, error: 'Token has expired' };
    }
    
    // Decode and validate signature
    const payload = Buffer.from(encodedPayload, 'base64').toString('utf8');
    const data = JSON.parse(payload) as SecureLinkData;
    
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('base64');
    
    const actualSignature = encodedPayload.split('.')[1];
    
    if (expectedSignature !== actualSignature) {
      return { valid: false, error: 'Invalid token signature' };
    }
    
    return { valid: true, data };
    
  } catch (error) {
    return { valid: false, error: 'Token validation failed' };
  }
}

export function generateResumeToken(): string {
  return crypto.randomBytes(32).toString('hex');
}