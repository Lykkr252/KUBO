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
// Teacher PIN is stored in Firebase at config/teacherPin.
// Default fallback: LAERER2025

const DEFAULT_PIN = 'LAERER2025';

async function tryLogin() {
    const entered = document.getElementById('pinInput').value.trim();
    if (!entered) return showGateError('Indtast lærerkode.');

    let correctPin = DEFAULT_PIN;
    try {
        const snap = await db.ref('config/teacherPin').once('value');
        if (snap.exists()) correctPin = snap.val();
    } catch (_) { /* use default */ }

    if (entered !== correctPin) {
        return showGateError('Forkert lærerkode. Prøv igen.');
    }

    sessionStorage.setItem('kubo_laerer', '1');
    document.getElementById('gate').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    document.getElementById('teacherLabel').textContent = 'Logget ind som laerer';
    loadData();
}

function showGateError(msg) {
    document.getElementById('gateError').textContent = msg;
}

function teacherLogout() {
    sessionStorage.removeItem('kubo_laerer');
    location.reload();
}

// Resume session if already authenticated
if (sessionStorage.getItem('kubo_laerer')) {
    document.getElementById('gate').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    document.getElementById('teacherLabel').textContent = 'Logget ind som laerer';
    loadData();
}

// ── Data loading ──────────────────────────────────────────────────────────────

let allStudents = [];

async function loadData() {
    try {
        const snap = await db.ref('results').once('value');
        const raw = snap.val() || {};
        allStudents = Object.entries(raw).map(([username, data]) => parseStudent(username, data));
    } catch (e) {
        allStudents = [];
    }
    document.getElementById('loadingMsg').style.display = 'none';
    document.getElementById('studentTable').style.display = '';
    updateSummary();
    renderTable();
}

function parseStudent(username, data) {
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
        timeSpent: data.timeSpent || 0,
        lastActivity: data.lastActivity || 0,
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

    detailTr.innerHTML = `
        <td colspan="7">
            <div class="detail-inner">
                <h4>Moduler — ${escHtml(st.username)}</h4>
                <div class="module-grid">${st.moduleResults.map(moduleChip).join('')}</div>
                ${riskNote}
            </div>
        </td>`;
    tr.after(detailTr);
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
