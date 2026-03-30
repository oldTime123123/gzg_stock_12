import CryptoJS from "crypto-js";

// 建议放到环境变量中 (import.meta.env.VITE_APP_KEY)，这里为了演示直接写死
const SECRET_KEY_STR = process.env.VITE_APP_KEY;
const SECRET_IV_STR = process.env.VITE_APP_IV;

const KEY = CryptoJS.MD5(SECRET_KEY_STR);
const IV = CryptoJS.MD5(SECRET_IV_STR);


/**
 * AES 加密
 * @param data 原始字符串
 */
export function encryptData(data: string): string {
  if (!data) return "";
  const encrypted = CryptoJS.AES.encrypt(data, KEY, {
    iv: IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
}

/**
 * AES 解密
 * @param cipherText 密文
 */
export function decryptData(cipherText: string): string {
  if (!cipherText) return "";
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, KEY, {
      iv: IV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText || "";
  } catch (e) {
    console.error("解密失败，可能是旧数据或格式错误", e);
    return cipherText;
  }
}

