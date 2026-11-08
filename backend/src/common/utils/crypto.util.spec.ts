import { CryptoUtil } from './crypto.util';

describe('CryptoUtil (AES-256-GCM)', () => {
  const validSecretHex =
    '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
  const alternativeSecret = 'a-secure-random-32-byte-phrase!!';

  it('should encrypt plaintext into 3 colon-separated hex segments', () => {
    const plainText = 'spotify-access-token-sample-12345';
    const encrypted = CryptoUtil.encrypt(plainText, validSecretHex);

    expect(typeof encrypted).toBe('string');
    const parts = encrypted.split(':');
    expect(parts.length).toBe(3);
    const [ivHex, tagHex, cipherHex] = parts;

    // IV is 12 bytes = 24 hex characters
    expect(ivHex.length).toBe(24);
    // Auth tag is 16 bytes = 32 hex characters
    expect(tagHex.length).toBe(32);
    expect(cipherHex.length).toBeGreaterThan(0);
  });

  it('should decrypt back to original plaintext', () => {
    const plainText = 'my-super-secret-oauth-refresh-token';
    const encrypted = CryptoUtil.encrypt(plainText, validSecretHex);
    const decrypted = CryptoUtil.decrypt(encrypted, validSecretHex);

    expect(decrypted).toBe(plainText);
  });

  it('should generate non-deterministic ciphertexts for identical plaintext due to random IVs', () => {
    const plainText = 'same-token-content';
    const enc1 = CryptoUtil.encrypt(plainText, validSecretHex);
    const enc2 = CryptoUtil.encrypt(plainText, validSecretHex);

    expect(enc1).not.toBe(enc2);
    expect(CryptoUtil.decrypt(enc1, validSecretHex)).toBe(plainText);
    expect(CryptoUtil.decrypt(enc2, validSecretHex)).toBe(plainText);
  });

  it('should fail decryption if auth tag is tampered with', () => {
    const plainText = 'tamper-test';
    const encrypted = CryptoUtil.encrypt(plainText, validSecretHex);
    const parts = encrypted.split(':');

    // Alter the authentication tag
    const tamperedTag = parts[1].replace(/^[0-9a-f]/, (c) =>
      c === '0' ? '1' : '0',
    );
    const tamperedPayload = `${parts[0]}:${tamperedTag}:${parts[2]}`;

    expect(() => {
      CryptoUtil.decrypt(tamperedPayload, validSecretHex);
    }).toThrow();
  });

  it('should fail decryption if decrypted with wrong secret key', () => {
    const plainText = 'key-mismatch-test';
    const encrypted = CryptoUtil.encrypt(plainText, validSecretHex);

    expect(() => {
      CryptoUtil.decrypt(encrypted, alternativeSecret);
    }).toThrow();
  });
});
