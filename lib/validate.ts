import validator from 'validator';

// Generate random code: 6-8 chars, A-Za-z0-9
export function generateRandomCode(length: number = 7): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Validate code format: [A-Za-z0-9]{6,8}
export function isValidCode(code: string): boolean {
  return /^[A-Za-z0-9]{6,8}$/.test(code);
}

// Validate URL
export function isValidUrl(url: string): boolean {
  return validator.isURL(url, { require_protocol: true });
}