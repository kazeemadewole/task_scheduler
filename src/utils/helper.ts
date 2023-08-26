// eslint-disable-next-line @typescript-eslint/no-var-requires
const crypto = require('crypto');
const iv = Buffer.from(`${process.env.IV}`);
const ivstring = iv.toString('hex').slice(0, 16);

export const generateSixDigitVerificationCode = (): string => {
  return Math.floor(Math.random() * (100000 - 999999 + 1) + 999999).toString();
};

export const generateRandomInteger = (min: number, max: number): number => {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

export const generateRandomStrings = (length: number) => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

export function validPhoneNumber(phoneNumber: string) {
  let isValidPhoneNumber = false;
  // validate phone number pattern
  if (/^0[2-9][0-9][0-9]{7,8}$/.test(phoneNumber.replace(/\s+/g, ''))) {
    isValidPhoneNumber = true;
  }
  return isValidPhoneNumber;
}

function sha1(input) {
  return crypto.createHash('sha1').update(input).digest();
}

export async function generateOtp(validtime = 120) {
  // Generate OTP
  const otp =
    process.env.BACKEND_ENV === 'prod'
      ? generateSixDigitVerificationCode()
      : '123456';
  // add 10 seconds to the to start the validity time count
  const timestamp = new Date();
  // timestamp.setSeconds(timestamp.getSeconds() + 10);
  // set OTP expiration to "validityDuration" set in the function param "payload"
  const expiration_time = timestamp
    .setSeconds(timestamp.getSeconds() + validtime)
    .toFixed();
  // const expiration_times = timestamp.setSeconds(timestamp.getSeconds() + payload.validityDuration);

  return { otp, timestamp, expiration_time };
}

export async function encode(string, secret = null) {
  const key = password_derive_bytes(
    secret ? secret : process.env.CRYPT_PASSWORD,
    '',
    100,
    32,
  );
  // Initialize Cipher Object to encrypt using AES-256 Algorithm
  const cipher = crypto.createCipheriv('aes-256-cbc', key, ivstring);
  const part1 = cipher.update(string, 'utf8');
  const part2 = cipher.final();
  const encrypted = Buffer.concat([part1, part2]).toString('base64');
  return encrypted;
}

// Function to decode the object
export async function decode(string, secret = null) {
  const key = password_derive_bytes(
    secret ? secret : process.env.CRYPT_PASSWORD,
    '',
    100,
    32,
  );
  // Initialize decipher Object to decrypt using AES-256 Algorithm
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, ivstring);
  let decrypted = decipher.update(string, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

function password_derive_bytes(password, salt, iterations, len) {
  let key = Buffer.from(password + salt);
  for (let i = 0; i < iterations; i++) {
    key = sha1(key);
  }
  if (key.length < len) {
    const hx = password_derive_bytes(password, salt, iterations - 1, 20);
    for (let counter = 1; key.length < len; ++counter) {
      key = Buffer.concat([
        key,
        sha1(Buffer.concat([Buffer.from(counter.toString()), hx])),
      ]);
    }
  }
  return Buffer.alloc(len, key);
}
