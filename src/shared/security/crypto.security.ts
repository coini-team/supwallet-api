import crypto from 'crypto';

function getRandomIV() {
    return crypto.randomBytes(12);
}

export const encrypt = (key, plaintext) => {
    const iv = getRandomIV();
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    const encryptedData = Buffer.concat([
        iv,
        cipher.update(plaintext),
        cipher.final(),
        cipher.getAuthTag()
    ]);
    return encryptedData.toString('base64');
}

export const decrypt = (key, ciphertext) => {
    ciphertext = Buffer.from(ciphertext, 'base64');
    const iv = ciphertext.slice(0, 12);
    const ciphertextTag = ciphertext.slice(12);
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(ciphertextTag.slice(-16));
    const decrypted = Buffer.concat([
        decipher.update(ciphertextTag.slice(0, -16)),
        decipher.final()
    ]);
    return decrypted.toString();
}
