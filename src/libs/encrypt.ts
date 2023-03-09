import forge from 'node-forge';
import { ethers } from 'ethers';

export function createPemFromPrivateKey(privateKey: string): string {
  return `-----BEGIN RSA PRIVATE KEY-----\n${privateKey
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .replace(/(\S{64}(?!$))/g, '$1\n')}\n-----END RSA PRIVATE KEY-----\n`;
}

export function createSignature(message: string, prvKey: string) {
  const messageDigest = forge.md.sha256.create();
  messageDigest.update(message, 'utf8');
  const privateKey = forge.pki.privateKeyFromPem(createPemFromPrivateKey(prvKey));
  const arrayBuffer = forge.util.binary.raw.decode(privateKey.sign(messageDigest));
  return ethers.utils.base64.encode(arrayBuffer);
}
