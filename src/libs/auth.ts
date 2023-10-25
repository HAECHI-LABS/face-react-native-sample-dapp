import { LoginProviderType } from '@haechi-labs/face-types';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import { createSignature } from './encrypt';
import qs from 'qs';

const PRV_KEY =
  'MIICdQIBADANBgkqhkiG9w0BAQEFAASCAl8wggJbAgEAAoGBAJLbedwNLvHyeZO4rUUU3QR9ijS+jrGFMEwE1ZVtCy5+/rRfyG/f5NsBDckjIwSEuj5z7fWhiu+tDQbZ72PzK8lgRScu4T49oAGjTLdXmb2D+p1MHmn14R+pmUOtxSXXNSvhbusnAXCROUAVIo6pUI+ebyjOZwzLKsQeCXYBt6GtAgMBAAECgYAEfQa9bf24UVPb6vIIwXl70KZvtD9CN7LhL+ijN4D2+9SnCKJkoPAqrV6Rfixsz+2tSPfF4RkQ+DYEtpZ1dJIq+kNxqRjb7TEHcduYYQwgkJZe2LPd1LS5bnvLGSbGMHHy7+MYNm6M/ghdHoDU+tkYLNFT19BX7MKbBWQPpoH/gQJBAJllv/CZQBhofxLZO0xsM8xcxTo3MFQoos89+Kdym+a8i/WqD49IgIsiK3adn/GCtjSeKJhPlrd5iNUqTBywUk0CQQD1Fdv9q++RmpuhD6LQtGzeeoNzld7xRjWjHVwHvp7/6xeSCyO8sHKydUF/NmV+Jy8vFpJn6b1AvagtgqALanzhAkBaP1eeWLsx4QCp+S3+90W+PPI4HtILIWEv5jjNYws/w7vgC25eEPy3XqINhgzcjNdfu5EMkv6L8S/Eob7nvgCdAkALF4ArTNq8xjiA44pE08WRlA3a7091r+3BghSmLRRZFLSuYV6urXWjafca4MVbHj7ebLEXjtaH1Y2E8cJ4gctBAkBPXs2bRZpI5ULwyYknWaq77gfuappmShgiCv7TUKixt5KqZy8DUU13x/WTUCWjthF/lmgkVq+FvsnG49dF8TM7';

export async function getCustomLoginCredential(provider: LoginProviderType) {
  try {
    let idToken;
    switch (provider) {
      case 'google.com': {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();

        if (userInfo.idToken) {
          idToken = userInfo.idToken;
        }
        break;
      }
      case 'apple.com': {
        const result = await InAppBrowser.openAuth(
          `https://appleid.apple.com/auth/authorize?client_id=xyz.facewallet.3rd&redirect_uri=https%3A%2F%2Fus-central1-prj-d-face.cloudfunctions.net%2FexternalSocialLogin&response_type=code%20id_token&scope=name%20email&response_mode=form_post&state=apple.com%7CRN`,
          'facewallet://facewallet'
        );
        if (result.type !== 'success') throw new Error('Failed auth');
        idToken = qs.parse(result.url.split('?').slice(1).join('')).idToken as string;
        console.log({ idToken });
        break;
      }
      case 'kakao.com': {
        const kakaoQueryStr = qs.stringify({
          client_id: '1d81f69a60f238d6ec4679e0fe543777',
          redirect_uri: 'https://us-central1-prj-d-face.cloudfunctions.net/externalSocialLogin',
          response_type: 'code',
          scope: 'openid',
          prompt: 'login',
          state: 'kakao.com|RN',
          nonce:
            Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15),
        });
        const result = await InAppBrowser.openAuth(
          `https://kauth.kakao.com/oauth/authorize?${kakaoQueryStr}`,
          'facewallet://facewallet'
        );
        if (result.type !== 'success') throw new Error('Failed auth');
        idToken = qs.parse(result.url.split('?').slice(1).join('')).idToken as string;
        console.log({ idToken });
        break;
      }
    }

    if (!idToken) throw new Error('Failed to get idToken');
    const signature = createSignature(idToken, PRV_KEY) as string;
    return { signature, idToken };
  } catch (error) {
    console.log({ error });
  }
}
