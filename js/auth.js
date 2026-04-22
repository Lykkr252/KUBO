// js/auth.js

async function hashPw(pw) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pw));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// ── Student auth ──────────────────────────────────────────────────────────────

async function doLogin(username, password) {
    try {
        const hash = await hashPw(password);
        const { data, error } = await db
            .from('users')
            .select('id')
            .eq('username', username)
            .eq('password', hash)
            .eq('role', 'student')
            .single();

        if (error || !data) return false;

        // Load preferred language from student profile
        const { data: student } = await db
            .from('students')
            .select('preferred_language')
            .eq('id', data.id)
            .single();

        sessionStorage.setItem('kubo_user',    username);
        sessionStorage.setItem('kubo_user_id', data.id);
        if (student?.preferred_language) {
            sessionStorage.setItem('kubo_lang', student.preferred_language);
        }
        return true;
    } catch {
        return false;
    }
}

// profile = { studynumber, email, studyline, subject, class, preferredLanguage }
async function doRegister(username, password, profile = {}) {
    try {
        // Check username is not taken
        const { data: existing } = await db
            .from('users')
            .select('id')
            .eq('username', username)
            .maybeSingle();

        if (existing) return 'taken';

        const hash = await hashPw(password);

        // Insert user
        const { data: user, error } = await db
            .from('users')
            .insert({ username, password: hash, role: 'student' })
            .select('id')
            .single();

        if (error) return 'Noget gik galt. Prøv igen.';

        // Insert student profile
        const { error: pErr } = await db.from('students').insert({
            id:                 user.id,
            studynumber:        profile.studynumber       || null,
            email:              profile.email             || null,
            studyline:          profile.studyline         || null,
            subject:            profile.subject           || null,
            class:              profile.class             || null,
            preferred_language: profile.preferredLanguage || 'da',
        });

        if (pErr) return 'Noget gik galt. Prøv igen.';
        return 'ok';
    } catch {
        return 'Noget gik galt. Prøv igen.';
    }
}

async function savePreferredLanguage(lang) {
    const userId = sessionStorage.getItem('kubo_user_id');
    if (!userId) return;
    await db.from('students').update({ preferred_language: lang }).eq('id', userId);
    sessionStorage.setItem('kubo_lang', lang);
}

function doLogout() {
    sessionStorage.removeItem('kubo_user');
    sessionStorage.removeItem('kubo_user_id');
    window.location.href = '/pages/login.html';
}

function getCurrentUser()   { return sessionStorage.getItem('kubo_user'); }
function getCurrentUserId() { return sessionStorage.getItem('kubo_user_id'); }

function requireLogin() {
    if (!getCurrentUser()) window.location.href = '/pages/login.html';
}

// ── Teacher auth ──────────────────────────────────────────────────────────────

async function doTeacherLogin(teacherId, password) {
    try {
        const hash = await hashPw(password);
        const { data, error } = await db
            .from('users')
            .select('id')
            .eq('username', teacherId)
            .eq('password', hash)
            .eq('role', 'teacher')
            .single();

        if (error || !data) return false;
        sessionStorage.setItem('kubo_laerer',    teacherId);
        sessionStorage.setItem('kubo_laerer_id', data.id);
        return true;
    } catch {
        return false;
    }
}

// profile = { teachernumber, email, studyline, class, subject }
async function doTeacherRegister(teacherId, password, profile = {}) {
    try {
        const { data: existing } = await db
            .from('users')
            .select('id')
            .eq('username', teacherId)
            .maybeSingle();

        if (existing) return 'taken';

        const hash = await hashPw(password);

        const { data: user, error } = await db
            .from('users')
            .insert({ username: teacherId, password: hash, role: 'teacher' })
            .select('id')
            .single();

        if (error) return 'Noget gik galt. Prøv igen.';

        await db.from('teachers').insert({
            id:            user.id,
            teachernumber: profile.teachernumber || teacherId,
            email:         profile.email         || null,
            studyline:     profile.studyline      || null,
            class:         profile.class          || null,
            subject:       profile.subject        || null,
        });

        return 'ok';
    } catch {
        return 'Noget gik galt. Prøv igen.';
    }
}

function getCurrentTeacher()   { return sessionStorage.getItem('kubo_laerer'); }
function getCurrentTeacherId() { return sessionStorage.getItem('kubo_laerer_id'); }
