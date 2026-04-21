// js/auth.js

async function hashPw(pw) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pw));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// ── Student auth ──────────────────────────────────────────────────────────────

async function doLogin(username, password) {
    try {
        const snapshot = await db.ref('students/' + username).once('value');
        if (!snapshot.exists()) return false;
        const hash = await hashPw(password);
        if (hash !== snapshot.val().hash) return false;
        sessionStorage.setItem('kubo_user', username);
        // Restore preferred language
        const lang = snapshot.val().preferredLanguage;
        if (lang) sessionStorage.setItem('kubo_lang', lang);
        return true;
    } catch {
        return false;
    }
}

// profile = { studynumber, email, studyline, subject, class, preferredLanguage }
async function doRegister(username, password, profile = {}) {
    try {
        const snapshot = await db.ref('students/' + username).once('value');
        if (snapshot.exists()) return 'taken';
        const hash = await hashPw(password);
        await db.ref('students/' + username).set({
            hash,
            studynumber:       profile.studynumber       || '',
            email:             profile.email             || '',
            studyline:         profile.studyline         || '',
            subject:           profile.subject           || '',
            class:             profile.class             || '',
            preferredLanguage: profile.preferredLanguage || 'da',
        });
        return 'ok';
    } catch {
        return 'Noget gik galt. Prøv igen.';
    }
}

async function getStudentProfile(username) {
    try {
        const snap = await db.ref('students/' + username).once('value');
        if (!snap.exists()) return null;
        const v = snap.val();
        return {
            studynumber:       v.studynumber       || '',
            email:             v.email             || '',
            studyline:         v.studyline         || '',
            subject:           v.subject           || '',
            class:             v.class             || '',
            preferredLanguage: v.preferredLanguage || 'da',
        };
    } catch {
        return null;
    }
}

async function savePreferredLanguage(lang) {
    const user = getCurrentUser();
    if (!user || typeof db === 'undefined') return;
    await db.ref('students/' + user + '/preferredLanguage').set(lang);
    sessionStorage.setItem('kubo_lang', lang);
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

// ── Teacher auth ──────────────────────────────────────────────────────────────
// Teachers are stored at teachers/{teacherId} with a hashed password and profile.

async function doTeacherLogin(teacherId, password) {
    try {
        const snap = await db.ref('teachers/' + teacherId).once('value');
        if (!snap.exists()) return false;
        const hash = await hashPw(password);
        if (hash !== snap.val().hash) return false;
        sessionStorage.setItem('kubo_laerer', teacherId);
        return true;
    } catch {
        return false;
    }
}

// profile = { teachernumber, email, studyline, class, subject }
async function doTeacherRegister(teacherId, password, profile = {}) {
    try {
        const snap = await db.ref('teachers/' + teacherId).once('value');
        if (snap.exists()) return 'taken';
        const hash = await hashPw(password);
        await db.ref('teachers/' + teacherId).set({
            hash,
            teachernumber: profile.teachernumber || teacherId,
            email:         profile.email         || '',
            studyline:     profile.studyline      || '',
            class:         profile.class          || '',
            subject:       profile.subject        || '',
        });
        return 'ok';
    } catch {
        return 'Noget gik galt. Prøv igen.';
    }
}

async function getTeacherProfile(teacherId) {
    try {
        const snap = await db.ref('teachers/' + teacherId).once('value');
        if (!snap.exists()) return null;
        const v = snap.val();
        return {
            teachernumber: v.teachernumber || teacherId,
            email:         v.email         || '',
            studyline:     v.studyline      || '',
            class:         v.class          || '',
            subject:       v.subject        || '',
        };
    } catch {
        return null;
    }
}

function getCurrentTeacher() {
    return sessionStorage.getItem('kubo_laerer');
}

function doTeacherLogout() {
    sessionStorage.removeItem('kubo_laerer');
}
