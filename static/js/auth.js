// js/auth.js — localStorage-based auth (no backend required)

async function hashPw(pw) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pw));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function getUsers() {
    try { return JSON.parse(localStorage.getItem('kubo_users')) || {}; } catch { return {}; }
}
function _saveUsers(users) {
    localStorage.setItem('kubo_users', JSON.stringify(users));
}

// ── Student auth ──────────────────────────────────────────────────────────────

async function doLogin(username, password) {
    try {
        const hash  = await hashPw(password);
        const users = getUsers();
        const user  = users[username];
        if (!user || user.password !== hash || user.role !== 'student') return false;
        sessionStorage.setItem('kubo_user',    username);
        sessionStorage.setItem('kubo_user_id', username);
        if (user.preferred_language) sessionStorage.setItem('kubo_lang', user.preferred_language);
        return true;
    } catch { return false; }
}

async function doRegister(username, password, profile = {}) {
    try {
        const users = getUsers();
        if (users[username]) return 'taken';
        const hash = await hashPw(password);
        users[username] = {
            password:           hash,
            role:               'student',
            preferred_language: profile.preferredLanguage || 'da',
            studynumber:        profile.studynumber  || null,
            email:              profile.email        || null,
            studyline:          profile.studyline    || null,
            subject:            profile.subject      || null,
            class:              profile.class        || null,
        };
        _saveUsers(users);
        return 'ok';
    } catch { return 'Noget gik galt. Prøv igen.'; }
}

function savePreferredLanguage(lang) {
    const username = sessionStorage.getItem('kubo_user');
    if (username) {
        const users = getUsers();
        if (users[username]) { users[username].preferred_language = lang; _saveUsers(users); }
    }
    sessionStorage.setItem('kubo_lang', lang);
}

function doLogout() {
    sessionStorage.removeItem('kubo_user');
    sessionStorage.removeItem('kubo_user_id');
    window.location.href = 'login.html';
}

function getCurrentUser()   { return sessionStorage.getItem('kubo_user'); }
function getCurrentUserId() { return sessionStorage.getItem('kubo_user_id'); }

function requireLogin() {
    if (!getCurrentUser()) window.location.href = 'login.html';
}

