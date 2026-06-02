/**
 * crypto.ts  (v0-election-web-app — server-side only)
 *
 * Decrypts AES-256-CBC payloads produced by election_backend/src/crypto.ts.
 * Used exclusively inside API route handlers — the ENCRYPTION_SECRET env var
 * is never exposed to the browser.
 */

import { createDecipheriv, createHash } from "crypto"

/**
 * Derives a deterministic 32-byte key from any string secret using SHA-256.
 * Must match the key derivation in election_backend/src/crypto.ts.
 */
function deriveKey(secret: string): Buffer {
  return createHash("sha256").update(secret).digest()
}

/**
 * Decrypts a base64-encoded AES-256-CBC payload produced by encryptPayload().
 * Format: Base64( ivHex ":" ciphertextHex )
 */
export function decryptPayload<T = unknown>(token: string, secret: string): T {
  const key = deriveKey(secret)
  const packed = Buffer.from(token, "base64").toString("utf8")
  const colonIdx = packed.indexOf(":")

  if (colonIdx === -1) {
    throw new Error("Invalid encrypted token format — missing ':'")
  }

  const ivHex = packed.slice(0, colonIdx)
  const ciphertextHex = packed.slice(colonIdx + 1)

  const iv = Buffer.from(ivHex, "hex")
  const ciphertext = Buffer.from(ciphertextHex, "hex")

  const decipher = createDecipheriv("aes-256-cbc", key, iv)
  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()])

  return JSON.parse(decrypted.toString("utf8")) as T
}
