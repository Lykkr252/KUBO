// ── Module definitions ───────────────────────────────────────────────────────
// Max total: 27 points. Risk exercises max: 15 points.

const MODULES = [
    { key: 'klokken',      label: 'Klokken',          max: 1, risiko: false },
    { key: 'talSortering', label: 'Talsortering',      max: 1, risiko: true  },
    { key: 'rabat',        label: 'Rabat',             max: 1, risiko: false },
    { key: 'monster',      label: 'Mønster',           max: 1, risiko: true  },
    { key: 'storste',      label: 'Største tal',       max: 1, risiko: true  },
    { key: 'afrunding',    label: 'Afrunding',         max: 1, risiko: false },
    { key: 'vinkel',       label: 'Vinkler',           max: 1, risiko: false },
    { key: 'gulvAreal',    label: 'Gulv – areal',      max: 1, risiko: false },
    { key: 'gulvPris',     label: 'Gulv – pris',       max: 1, risiko: false },
    { key: 'areal',        label: 'Areal-grid',        max: 1, risiko: false },
    { key: 'plus',         label: 'Plus (3 stk)',      max: 3, risiko: true  },
    { key: 'minus',        label: 'Minus (3 stk)',     max: 3, risiko: true  },
    { key: 'division',     label: 'Division (3 stk)',  max: 3, risiko: true  },
    { key: 'brok',         label: 'Brøker (3 stk)',    max: 3, risiko: true  },
    { key: 'kagekaos',     label: 'Kagekaos',          max: 1, risiko: false },
    { key: 'datoer',       label: 'Datoer',            max: 1, risiko: false },
    { key: 'maaleAlm',     label: 'Måleenheder (3 stk)',max: 3, risiko: false },
];

const MAX_TOTAL = MODULES.reduce((s, m) => s + m.max, 0);       // 27
const MAX_RISK  = MODULES.filter(m => m.risiko).reduce((s, m) => s + m.max, 0); // 15

// ── Auth ──────────────────────────────────────────────────────────────────────
// Teachers have individual accounts stored at teachers/{teacherId}.
// Auth functions (doTeacherLogin, doTeacherRegister, etc.) live in auth.js.

async function tryLogin() {
    const idVal  = (document.getElementById('teacherIdInput').value  || '').trim();
    const pwVal  = (document.getElementById('teacherPwInput').value  || '');
    const isReg  = document.getElementById('gateRegMode') &&
                   document.getElementById('gateRegMode').checked;

    if (!idVal || !pwVal) return showGateError('Udfyld ID og adgangskode.');

    if (isReg) {
        // Registration mode
        const profile = {
            teachernumber: idVal,
            email:     (document.getElementById('gateEmail')     || {}).value || '',
            studyline: (document.getElementById('gateStudyline') || {}).value || '',
            class:     (document.getElementById('gateClass')     || {}).value || '',
            subject:   (document.getElementById('gateSubject')   || {}).value || '',
        };
        const result = await doTeacherRegister(idVal, pwVal, profile);
        if (result === 'taken') return showGateError('Lærer-ID er allerede i brug.');
        if (result !== 'ok')   return showGateError(result);
        // Fall through to login after registration
    }

    const ok = await doTeacherLogin(idVal, pwVal);
    if (!ok) return showGateError('Forkert ID eller adgangskode.');

    openDashboard(idVal);
    loadData();
}

function openDashboard(teacherId) {
    document.getElementById('gate').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    document.getElementById('teacherLabel').textContent = 'Lærer: ' + teacherId;
}

function updateTeacherLabel(teacherId, teacherClass) {
    const label = document.getElementById('teacherLabel');
    if (!label) return;
    label.textContent = teacherClass
        ? `Lærer: ${teacherId} · Klasse: ${teacherClass}`
        : `Lærer: ${teacherId}`;
}

function showGateError(msg) {
    document.getElementById('gateError').textContent = msg;
}

function teacherLogout() {
    sessionStorage.removeItem('kubo_laerer');
    location.reload();
}

// Resume session if already authenticated
const _savedTeacher = sessionStorage.getItem('kubo_laerer');
if (_savedTeacher) {
    openDashboard(_savedTeacher);
    loadData();
}

// ── Data loading ──────────────────────────────────────────────────────────────
// testscores/{username}  — scores + class field (the shared link between students & teachers)
// students/{username}    — full student profile (email, studyline, etc.)
// evaluations/{username} — teacher evaluations
// Teacher and students are linked by matching class field.

let allStudents  = [];
let _teacherClass = '';   // class of the logged-in teacher

async function loadData() {
    const teacherId = sessionStorage.getItem('kubo_laerer') || '';

    // 1. Load teacher's own profile to get their class
    try {
        const tSnap = await db.ref('teachers/' + teacherId).once('value');
        _teacherClass = (tSnap.val() || {}).class || '';
        updateTeacherLabel(teacherId, _teacherClass);
    } catch {
        _teacherClass = '';
    }

    // 2. Load testscores, student profiles, and evaluations in parallel
    try {
        const [scoresSnap, profilesSnap, evalsSnap] = await Promise.all([
            db.ref('testscores').once('value'),
            db.ref('students').once('value'),
            db.ref('evaluations').once('value'),
        ]);

        const scores   = scoresSnap.val()   || {};
        const profiles = profilesSnap.val() || {};
        const evals    = evalsSnap.val()    || {};

        // Union of every username that appears in either node
        const usernames = new Set([...Object.keys(scores), ...Object.keys(profiles)]);

        allStudents = [...usernames]
            .filter(username => {
                // If the teacher has a class set, only show students in that same class.
                // Class is stored in both students/{u}/class and testscores/{u}/class.
                if (!_teacherClass) return true;
                const cls = (profiles[username] || {}).class
                         || (scores[username]   || {}).class
                         || '';
                return cls === _teacherClass;
            })
            .map(username =>
                parseStudent(username, scores[username] || {}, profiles[username] || {}, evals[username] || null)
            );
    } catch {
        allStudents = [];
    }

    document.getElementById('loadingMsg').style.display = 'none';
    document.getElementById('studentTable').style.display = '';
    updateSummary();
    renderTable();
}

// ── Evaluations ───────────────────────────────────────────────────────────────
// A teacher saves an evaluation for a student.
// It is written to evaluations/{studentUsername} AND administration/evaluations/{studentUsername}.

async function saveEvaluation(studentUsername, text) {
    const teacherId = sessionStorage.getItem('kubo_laerer') || 'unknown';
    const riskLevel = (allStudents.find(s => s.username === studentUsername) || {}).riskLevel || 'unknown';
    const entry = {
        text,
        teacherId,
        riskLevel,
        date: Date.now(),
    };
    await Promise.all([
        db.ref('evaluations/' + studentUsername).set(entry),
        db.ref('administration/evaluations/' + studentUsername).set(entry),
    ]);
}

function parseStudent(username, data, profile, evalEntry) {
    const scores = data.scores || {};
    let total = 0;
    let riskScore = 0;
    const moduleResults = MODULES.map(m => {
        const val = scores[m.key] || 0;
        total += val;
        if (m.risiko) riskScore += val;
        return { ...m, val };
    });

    const riskPct = MAX_RISK > 0 ? riskScore / MAX_RISK : 0;
    let riskLevel;
    if (riskPct < 0.35)       riskLevel = 'high';
    else if (riskPct < 0.60)  riskLevel = 'medium';
    else                       riskLevel = 'low';

    const attempted = moduleResults.filter(m => m.val > 0).length;

    return {
        username,
        total,
        riskScore,
        riskLevel,
        moduleResults,
        attempted,
        timeSpent:    data.timeSpent    || 0,
        lastActivity: data.lastActivity || 0,
        // Profile fields from students/{username}
        email:        profile.email        || '',
        studynumber:  profile.studynumber  || '',
        studyline:    profile.studyline    || '',
        subject:      profile.subject      || '',
        class:        profile.class        || '',
        // Existing teacher evaluation (if any)
        evaluation:   evalEntry ? evalEntry.text : '',
    };
}

// ── Summary cards ─────────────────────────────────────────────────────────────

function updateSummary() {
    const n = allStudents.length;
    document.getElementById('statTotal').textContent = n;

    if (n === 0) {
        document.getElementById('statAvgScore').textContent = '—';
        document.getElementById('statCompleted').textContent = '—';
        document.getElementById('statRisk').textContent = '—';
        return;
    }

    const avg = allStudents.reduce((s, st) => s + st.total, 0) / n;
    document.getElementById('statAvgScore').textContent = avg.toFixed(1);

    const completed = allStudents.filter(st => st.total >= 20).length;
    document.getElementById('statCompleted').textContent = completed;

    const atRisk = allStudents.filter(st => st.riskLevel === 'high' || st.riskLevel === 'medium').length;
    document.getElementById('statRisk').textContent = atRisk;
}

// ── Table rendering ───────────────────────────────────────────────────────────

function renderTable() {
    const search  = document.getElementById('searchInput').value.toLowerCase();
    const filter  = document.getElementById('filterRisk').value;
    const sortBy  = document.getElementById('sortBy').value;

    let students = allStudents.filter(st => {
        if (search && !st.username.toLowerCase().includes(search)) return false;
        if (filter && st.riskLevel !== filter) return false;
        return true;
    });

    students = students.slice().sort((a, b) => {
        if (sortBy === 'score-desc') return b.total - a.total;
        if (sortBy === 'score-asc')  return a.total - b.total;
        if (sortBy === 'time-desc')  return b.timeSpent - a.timeSpent;
        if (sortBy === 'risk') {
            const order = { high: 0, medium: 1, low: 2 };
            return order[a.riskLevel] - order[b.riskLevel];
        }
        return a.username.localeCompare(b.username, 'da');
    });

    document.getElementById('countLabel').textContent =
        students.length === allStudents.length
            ? `${students.length} elever`
            : `Viser ${students.length} af ${allStudents.length} elever`;

    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';

    if (students.length === 0) {
        document.getElementById('studentTable').style.display = 'none';
        document.getElementById('emptyState').style.display = '';
        return;
    }
    document.getElementById('studentTable').style.display = '';
    document.getElementById('emptyState').style.display = 'none';

    students.forEach(st => {
        // Main row
        const tr = document.createElement('tr');
        tr.dataset.user = st.username;
        tr.innerHTML = `
            <td class="username">${escHtml(st.username)}</td>
            <td>${scoreCell(st.total)}</td>
            <td>${progressCell(st.attempted, MODULES.length)}</td>
            <td class="time-cell">${formatTime(st.timeSpent)}</td>
            <td class="time-cell">${formatDate(st.lastActivity)}</td>
            <td>${riskBadge(st.riskLevel)}</td>
            <td style="color:#94a3b8;font-size:0.85rem">▼ Detaljer</td>
        `;
        tr.addEventListener('click', () => toggleDetail(st, tr));
        tbody.appendChild(tr);
    });
}

function toggleDetail(st, tr) {
    const existing = document.getElementById('detail-' + st.username);
    if (existing) { existing.remove(); tr.querySelector('td:last-child').textContent = '▼ Detaljer'; return; }
    tr.querySelector('td:last-child').textContent = '▲ Luk';

    const detailTr = document.createElement('tr');
    detailTr.id = 'detail-' + st.username;
    detailTr.className = 'detail-row';

    const riskNote = st.riskLevel !== 'low' ? buildRiskNote(st) : '';

    const profileRows = [
        st.studynumber ? `<span><strong>Studienr.:</strong> ${escHtml(st.studynumber)}</span>` : '',
        st.email       ? `<span><strong>E-mail:</strong> ${escHtml(st.email)}</span>`          : '',
        st.studyline   ? `<span><strong>Retning:</strong> ${escHtml(st.studyline)}</span>`     : '',
        st.subject     ? `<span><strong>Fag:</strong> ${escHtml(st.subject)}</span>`           : '',
        st.class       ? `<span><strong>Klasse:</strong> ${escHtml(st.class)}</span>`          : '',
    ].filter(Boolean).join(' &nbsp;|&nbsp; ');

    detailTr.innerHTML = `
        <td colspan="7">
            <div class="detail-inner">
                <h4>Moduler — ${escHtml(st.username)}</h4>
                ${profileRows ? `<p style="font-size:0.85rem;color:#64748b;margin-bottom:0.75rem">${profileRows}</p>` : ''}
                <div class="module-grid">${st.moduleResults.map(moduleChip).join('')}</div>
                ${riskNote}
                <div class="eval-section" style="margin-top:1rem">
                    <label style="font-size:0.8rem;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#64748b">
                        Lærervurdering
                    </label>
                    <textarea id="eval-${escHtml(st.username)}"
                        style="width:100%;margin-top:0.4rem;padding:0.6rem 0.8rem;border:2px solid #e2e8f0;border-radius:8px;font-family:inherit;font-size:0.9rem;resize:vertical;min-height:80px"
                        placeholder="Skriv din vurdering her...">${escHtml(st.evaluation)}</textarea>
                    <button onclick="submitEvaluation('${escHtml(st.username)}')"
                        style="margin-top:0.5rem;padding:0.4rem 1.2rem;background:#4f46e5;color:#fff;border:none;border-radius:8px;font-family:inherit;font-size:0.88rem;cursor:pointer">
                        Send til administration
                    </button>
                    <span id="eval-msg-${escHtml(st.username)}" style="font-size:0.82rem;margin-left:0.75rem;color:#16a34a"></span>
                </div>
            </div>
        </td>`;
    tr.after(detailTr);
}

async function submitEvaluation(username) {
    const ta  = document.getElementById('eval-' + username);
    const msg = document.getElementById('eval-msg-' + username);
    if (!ta) return;
    const text = ta.value.trim();
    if (!text) { msg.style.color = '#dc2626'; msg.textContent = 'Skriv en vurdering først.'; return; }
    msg.style.color = '#94a3b8'; msg.textContent = 'Gemmer...';
    try {
        await saveEvaluation(username, text);
        msg.style.color = '#16a34a'; msg.textContent = 'Sendt til administration!';
        // Update cached student so re-opening shows the saved text
        const st = allStudents.find(s => s.username === username);
        if (st) st.evaluation = text;
    } catch {
        msg.style.color = '#dc2626'; msg.textContent = 'Fejl – prøv igen.';
    }
}

function moduleChip(m) {
    let cls, icon;
    if (m.val === 0)        { cls = 'chip-none'; icon = '○'; }
    else if (m.val >= m.max){ cls = 'chip-ok';   icon = '✓'; }
    else                    { cls = 'chip-part';  icon = `${m.val}/${m.max}`; }
    if (m.val === 0 && m.risiko) cls = 'chip-miss';
    return `<div class="module-chip ${cls}"><span>${icon}</span><span>${escHtml(m.label)}</span></div>`;
}

function buildRiskNote(st) {
    const weak = st.moduleResults
        .filter(m => m.risiko && m.val < m.max)
        .map(m => m.label);
    if (weak.length === 0) return '';
    const pct = Math.round((st.riskScore / MAX_RISK) * 100);
    return `<div class="detail-note">
        <strong>Dyskalkulirisiko (${pct}% af risikopoint):</strong>
        Eleven viser svaghed i: ${weak.join(', ')}.
        Disse øvelser tester kernekompetencer relateret til talforståelse og regning.
    </div>`;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function scoreCell(total) {
    const pct = total / MAX_TOTAL;
    const color = pct >= 0.7 ? '#16a34a' : pct >= 0.4 ? '#d97706' : '#dc2626';
    return `<div class="score-bar-wrap">
        <div class="score-bar-bg">
            <div class="score-bar-fill" style="width:${Math.round(pct*100)}%;background:${color}"></div>
        </div>
        <span class="score-text" style="color:${color}">${total}/${MAX_TOTAL}</span>
    </div>`;
}

function progressCell(attempted, total) {
    const pct = Math.round((attempted / total) * 100);
    return `<span style="font-size:0.85rem;color:#64748b">${attempted}/${total} moduler (${pct}%)</span>`;
}

function riskBadge(level) {
    if (level === 'high')   return `<span class="badge badge-red">Mistænkt</span>`;
    if (level === 'medium') return `<span class="badge badge-yellow">Middel</span>`;
    return `<span class="badge badge-green">Lav risiko</span>`;
}

function formatTime(secs) {
    if (!secs) return '—';
    const m = Math.floor(secs / 60), s = secs % 60;
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

function formatDate(ts) {
    if (!ts) return '—';
    const d = new Date(ts);
    return d.toLocaleDateString('da-DK', { day:'2-digit', month:'short', year:'numeric' });
}

function escHtml(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
