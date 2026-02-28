
/**
 * Crypto Service
 * Uses Web Crypto API to encrypt and decrypt sensitive data.
 * In a production app, the 'masterKey' should be derived from the user's password.
 */

const ALGORITHM = 'AES-GCM';
const IV_LENGTH = 12;

// In production, this would be derived from the user's password via PBKDF2
// For this implementation, we use a stable key derived from the user's identity
async function getEncryptionKey(userId: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const baseKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(`focus-os-vault-secret-${userId}`),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('focus-os-salt'),
      iterations: 100000,
      hash: 'SHA-256',
    },
    baseKey,
    { name: ALGORITHM, length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptData(data: string, userId: string): Promise<string> {
  try {
    const key = await getEncryptionKey(userId);
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(data);

    const encryptedContent = await crypto.subtle.encrypt(
      {
        name: ALGORITHM,
        iv: iv,
      },
      key,
      encodedData
    );

    // Combine IV and encrypted content
    const combined = new Uint8Array(iv.length + encryptedContent.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encryptedContent), iv.length);

    // Return as Base64 string
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Failed to encrypt data');
  }
}

export async function decryptData(base64Data: string, userId: string): Promise<string> {
  try {
    const key = await getEncryptionKey(userId);
    const combined = new Uint8Array(
      atob(base64Data)
        .split('')
        .map((char) => char.charCodeAt(0))
    );

    const iv = combined.slice(0, IV_LENGTH);
    const encryptedContent = combined.slice(IV_LENGTH);

    const decryptedContent = await crypto.subtle.decrypt(
      {
        name: ALGORITHM,
        iv: iv,
      },
      key,
      encryptedContent
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedContent);
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Failed to decrypt data');
  }
}
