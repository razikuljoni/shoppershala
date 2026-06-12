import { describe, it, expect } from 'vitest';
import { hashPassword, comparePassword } from './password.util.js';

describe('Password Utility', () => {
  it('should hash a password', async () => {
    const password = 'testPassword123';
    const hash = await hashPassword(password);
    expect(hash).toBeDefined();
    expect(hash).not.toBe(password);
  });

  it('should verify a correct password against its hash', async () => {
    const password = 'testPassword123';
    const hash = await hashPassword(password);
    const isValid = await comparePassword(password, hash);
    expect(isValid).toBe(true);
  });

  it('should reject an incorrect password against its hash', async () => {
    const password = 'testPassword123';
    const hash = await hashPassword(password);
    const isValid = await comparePassword('wrongPassword', hash);
    expect(isValid).toBe(false);
  });

  it('should produce different hashes for the same password', async () => {
    const password = 'testPassword123';
    const hash1 = await hashPassword(password);
    const hash2 = await hashPassword(password);
    expect(hash1).not.toBe(hash2);
  });
});
