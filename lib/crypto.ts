/**
 * Browser-side AES-256-CBC decryption utility.
 *
 * This mirrors the backend's encryptPayload function, using the
 * Web Crypto API (available in all modern browsers and in Node.js ≥ 18).
 *
 * Expected token format (produced by the backend):
 *   Base64( "<ivHex>:<ciphertextHex>" )
 *
 * Usage:
 *   const data = await decryptPayload<Candidate[]>(response.payload, SECRET)
 */

async function deriveKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder()
  // SHA-256 hash of the secret → 32-byte key material
  const hashBuffer = await crypto.subtle.digest("SHA-256", enc.encode(secret))

  return crypto.subtle.importKey(
    "raw",
    hashBuffer,
    { name: "AES-CBC" },
    false,
    ["decrypt"]
  )
}

export async function decryptPayload<T = unknown>(
  token: string,
  secret: string
): Promise<T> {
  // 1. Base64-decode the token
  const packed = atob(token)

  // 2. Split "ivHex:ciphertextHex"
  const colonIndex = packed.indexOf(":")
  if (colonIndex === -1) {
    throw new Error("Invalid encrypted payload format")
  }
  const ivHex = packed.slice(0, colonIndex)
  const ciphertextHex = packed.slice(colonIndex + 1)

  // 3. Convert hex strings to Uint8Arrays
  function hexToBytes(hex: string): Uint8Array {
    const bytes = new Uint8Array(hex.length / 2)
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
    }
    return bytes
  }

  const iv = hexToBytes(ivHex)
  const ciphertext = hexToBytes(ciphertextHex)

  // 4. Derive the CryptoKey
  const key = await deriveKey(secret)

  // 5. Decrypt
  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: "AES-CBC", iv },
    key,
    ciphertext
  )

  // 6. Parse JSON
  const json = new TextDecoder().decode(decryptedBuffer)
  return JSON.parse(json) as T
}
