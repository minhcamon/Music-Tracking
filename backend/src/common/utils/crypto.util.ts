import * as crypto from 'crypto';

/**
 * Utility for AES-256-GCM token encryption and decryption.
 * Enforces AES-256-GCM authenticated encryption with a 12-byte random IV
 * and 16-byte authentication tag per docs/guidelines/shared/security-policy.md.
 */
export class CryptoUtil {
  private static readonly ALGORITHM = 'aes-256-gcm';
  private static readonly IV_LENGTH_BYTES = 12;
  private static readonly AUTH_TAG_LENGTH_BYTES = 16;
  private static readonly KEY_LENGTH_BYTES = 32;

  /**
   * Derives a 32-byte buffer key from the secret string.
   * Supports 64-character hex strings or raw 32-byte UTF-8 keys.
   */
  private static getKeyBuffer(secret: string): Buffer {
    if (!secret) {
      throw new Error('ENCRYPTION_SECRET is required for crypto operations');
    }

    if (/^[0-9a-fA-F]{64}$/.test(secret)) {
      return Buffer.from(secret, 'hex');
    }

    const buf = Buffer.from(secret, 'utf-8');
    if (buf.length === CryptoUtil.KEY_LENGTH_BYTES) {
      return buf;
    }

    // Hash to exactly 32 bytes if length is non-standard
    return crypto.createHash('sha256').update(secret).digest();
  }

  /**
   * Encrypts plaintext using AES-256-GCM.
   * Returns a serialized string in the format: "ivHex:authTagHex:ciphertextHex"
   */
  public static encrypt(plainText: string, secret: string): string {
    const key = this.getKeyBuffer(secret);
    const iv = crypto.randomBytes(this.IV_LENGTH_BYTES);
    const cipher = crypto.createCipheriv(this.ALGORITHM, key, iv, {
      authTagLength: this.AUTH_TAG_LENGTH_BYTES,
    });

    let encrypted = cipher.update(plainText, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');

    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
  }

  /**
   * Decrypts an AES-256-GCM encrypted payload produced by encrypt().
   */
  public static decrypt(cipherPayload: string, secret: string): string {
    const parts = cipherPayload.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted token payload format');
    }

    const [ivHex, authTagHex, encryptedHex] = parts;
    const key = this.getKeyBuffer(secret);
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipheriv(this.ALGORITHM, key, iv, {
      authTagLength: this.AUTH_TAG_LENGTH_BYTES,
    });
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}
