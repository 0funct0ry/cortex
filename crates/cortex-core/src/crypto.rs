use aes_gcm::{
    aead::{Aead, KeyInit},
    Aes256Gcm, Nonce,
};
use base64::{engine::general_purpose, Engine as _};
use hmac::Hmac;
use rand::{rngs::OsRng, RngCore};
use sha2::Sha256;
use std::fmt;

#[derive(Debug)]
pub enum CryptoError {
    EncryptionFailed,
    DecryptionFailed,
    InvalidFormat,
    Base64Error(base64::DecodeError),
}

impl fmt::Display for CryptoError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            CryptoError::EncryptionFailed => write!(f, "Encryption failed"),
            CryptoError::DecryptionFailed => write!(f, "Decryption failed"),
            CryptoError::InvalidFormat => write!(f, "Invalid encrypted format"),
            CryptoError::Base64Error(err) => write!(f, "Base64 error: {}", err),
        }
    }
}

impl std::error::Error for CryptoError {}

impl From<base64::DecodeError> for CryptoError {
    fn from(err: base64::DecodeError) -> Self {
        CryptoError::Base64Error(err)
    }
}

pub const PREFIX: &str = "ENC(v1:";
pub const SUFFIX: &str = ")";

/// Encrypts plaintext using AES-GCM-256 with a 32-byte key.
/// The output is a string in the format `ENC(v1:<base64(nonce + ciphertext)>)`.
pub fn encrypt(plaintext: &str, key: &[u8; 32]) -> Result<String, CryptoError> {
    let cipher = Aes256Gcm::new(key.into());
    let mut nonce_bytes = [0u8; 12];
    OsRng.fill_bytes(&mut nonce_bytes);
    let nonce = Nonce::from_slice(&nonce_bytes);

    let ciphertext =
        cipher.encrypt(nonce, plaintext.as_bytes()).map_err(|_| CryptoError::EncryptionFailed)?;

    let mut combined = Vec::with_capacity(nonce_bytes.len() + ciphertext.len());
    combined.extend_from_slice(&nonce_bytes);
    combined.extend_from_slice(&ciphertext);

    let encoded = general_purpose::STANDARD.encode(combined);
    Ok(format!("{}{}{}", PREFIX, encoded, SUFFIX))
}

/// Decrypts a string in the format `ENC(v1:<base64(nonce + ciphertext)>)`.
pub fn decrypt(encrypted: &str, key: &[u8; 32]) -> Result<String, CryptoError> {
    if !encrypted.starts_with(PREFIX) || !encrypted.ends_with(SUFFIX) {
        return Err(CryptoError::InvalidFormat);
    }

    let payload = &encrypted[PREFIX.len()..encrypted.len() - SUFFIX.len()];
    let combined = general_purpose::STANDARD.decode(payload)?;

    if combined.len() < 12 {
        return Err(CryptoError::InvalidFormat);
    }

    let (nonce_bytes, ciphertext) = combined.split_at(12);
    let nonce = Nonce::from_slice(nonce_bytes);
    let cipher = Aes256Gcm::new(key.into());

    let plaintext = cipher.decrypt(nonce, ciphertext).map_err(|_| CryptoError::DecryptionFailed)?;

    String::from_utf8(plaintext).map_err(|_| CryptoError::DecryptionFailed)
}

/// Derives a 32-byte key from a passphrase and salt using PBKDF2-HMAC-SHA256.
pub fn derive_key(passphrase: &str, salt: &[u8]) -> [u8; 32] {
    let mut key = [0u8; 32];
    pbkdf2::pbkdf2::<Hmac<Sha256>>(passphrase.as_bytes(), salt, 100_000, &mut key)
        .expect("PBKDF2 failed");
    key
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_encryption_roundtrip() {
        let key = [0u8; 32];
        let plaintext = "Hello, Cortex!";
        let encrypted = encrypt(plaintext, &key).unwrap();
        assert!(encrypted.starts_with(PREFIX));
        assert!(encrypted.ends_with(SUFFIX));

        let decrypted = decrypt(&encrypted, &key).unwrap();
        assert_eq!(plaintext, decrypted);
    }

    #[test]
    fn test_decryption_failure_with_wrong_key() {
        let key1 = [1u8; 32];
        let key2 = [2u8; 32];
        let plaintext = "Secret data";
        let encrypted = encrypt(plaintext, &key1).unwrap();

        let result = decrypt(&encrypted, &key2);
        assert!(matches!(result, Err(CryptoError::DecryptionFailed)));
    }

    #[test]
    fn test_key_derivation() {
        let salt = b"cortex-salt";
        let key1 = derive_key("passphrase", salt);
        let key2 = derive_key("passphrase", salt);
        let key3 = derive_key("different", salt);

        assert_eq!(key1, key2);
        assert_ne!(key1, key3);
    }
}
