import process from 'node:process';

process.loadEnvFile('.env');

function requiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const baseUrl = requiredEnv('BASE_URL').replace(/\/$/, '');

export const loginUsername = requiredEnv('USERNAME');
export const loginPassword = requiredEnv('PASSWORD');

export function buildLoginUrl(path: string) {
  return `${baseUrl}${path}`;
}
