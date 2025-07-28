const crypto = require('crypto');

const encryptionKey = process.env.ENCRYPTION_KEY;

// Encrypt sensitive data
const encryptData = (data) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptionKey), iv);
  let encrypted = cipher.update(data);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
};

// Anonymize user data
const anonymizeUser = (user) => {
  return {
    ...user,
    full_name: 'REDACTED',
    email: `anon_${crypto.randomBytes(8).toString('hex')}@redacted.com`,
    linkedin_id: encryptData(user.linkedin_id)
  };
};

module.exports = { encryptData, anonymizeUser };