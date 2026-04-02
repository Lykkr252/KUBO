// js/auth.js

async function hashPw(pw) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pw));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function doLogin(username, password) {
    try {
        const snapshot = await db.ref('users/' + username).once('value');
        if (!snapshot.exists()) return false;
        const hash = await hashPw(password);
        if (hash !== snapshot.val().hash) return false;
        sessionStorage.setItem('kubo_user', username);
        return true;
    } catch {
        return false;
    }
}

async function doRegister(username, password) {
    try {
        const snapshot = await db.ref('users/' + username).once('value');
        if (snapshot.exists()) return 'taken';
        const hash = await hashPw(password);
        await db.ref('users/' + username).set({ hash });
        return 'ok';
    } catch {
        return 'Noget gik galt. Prøv igen.';
    }
}

function doLogout() {
    sessionStorage.removeItem('kubo_user');
    window.location.href = '/pages/login.html';
}

function getCurrentUser() {
    return sessionStorage.getItem('kubo_user');
}

function requireLogin() {
    if (!getCurrentUser()) {
        window.location.href = '/pages/login.html';
    }
}
