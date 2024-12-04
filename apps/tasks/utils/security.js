import CryptoJS from 'crypto-js';

const SECRET_KEY = 'o8p7rc3v@l)o1s0f-_jd^1+6=2qn(_#ek$sv$h202z&g39a*9*';

// Encrypt data - make it URL-safe
export const encryptData = (data) => {
  const encrypted = CryptoJS.AES.encrypt(data?.toString(), SECRET_KEY).toString();
  return encodeURIComponent(encrypted);  // Encode to make it URL-safe
};

// Decrypt data
export const decryptData = (encryptedData) => {
  try {
    const decodedData = decodeURIComponent(encryptedData);  // Decode before decrypting
    const bytes = CryptoJS.AES.decrypt(decodedData, SECRET_KEY);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedData) {
      console.error("Decrypted data is empty or invalid.");
      return null;
    }
    return decryptedData;
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
};
