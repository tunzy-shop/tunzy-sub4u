// ============================================
// FIREBASE CONFIGURATION - TUNZY SUB 4 YOU
// ============================================

const firebaseConfig = {
    apiKey: "AIzaSyAIR0BrQov-9FL5wLK20ibHA2PdvWsdC30",
    authDomain: "tunzysub4you.firebaseapp.com",
    projectId: "tunzysub4you",
    storageBucket: "tunzysub4you.firebasestorage.app",
    messagingSenderId: "983100201697",
    appId: "1:983100201697:web:d365c53b775ea0a3aa75a0"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);