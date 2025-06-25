export {};

declare global {
  interface Window {
    recaptchaVerifier: firebase.auth.RecaptchaVerifier | any;
  }
}

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

import { RecaptchaVerifier } from 'firebase/auth';

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
  }
}
