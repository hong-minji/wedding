import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyDdxTStyMIDEPBlIJP9rro3BGzuK1T7Big',
  authDomain: 'wedding-12b53.firebaseapp.com',
  projectId: 'wedding-12b53',
  storageBucket: 'wedding-12b53.firebasestorage.app',
  messagingSenderId: '607612848136',
  appId: '1:607612848136:web:f1d900350b3711c8cc29bd',
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

export const db = getFirestore(app)
