// ── Firebase result saving ───────────────────────────────────────────────────

function saveScore(module, score) {
    const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
    if (!user || typeof db === 'undefined') return;
    const ref = db.ref('results/' + user + '/scores/' + module);
    ref.once('value').then(snap => {
        const prev = snap.val() || 0;
        if (score > prev) ref.set(score);
    });
    db.ref('results/' + user + '/lastActivity').set(Date.now());
}

window.addEventListener('beforeunload', () => {
    const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
    if (!user || typeof db === 'undefined') return;
    db.ref('results/' + user + '/timeSpent').once('value').then(snap => {
        const prev = snap.val() || 0;
        db.ref('results/' + user + '/timeSpent').set(prev + seconds);
    });
});

// ── Exercises ────────────────────────────────────────────────────────────────

function checkClockAnswer(event) {
    event.preventDefault();
    const selected = document.querySelector('input[name="tid"]:checked');
    const feedback = document.getElementById("clockFeedback");
    if (!selected) { feedback.textContent = t('fb.select'); feedback.style.color = "orange"; return; }
    if (selected.value === "2") {
        feedback.textContent = t('fb.clock.ok'); feedback.style.color = "green";
        saveScore('klokken', 1);
    } else {
        feedback.textContent = t('fb.wrong'); feedback.style.color = "red";
    }
}

function gemUrPræference() {
    const val = document.getElementById("urPref").value;
    const feedback = document.getElementById("urSvar");
    if (!val) { feedback.textContent = t('fb.select.type'); feedback.style.color = "orange"; }
    else { feedback.textContent = t('fb.thanks.pref'); feedback.style.color = "green"; }
}

const tiles = document.querySelectorAll('.number-tile');
const dropzone = document.getElementById('dropzone');
tiles.forEach(tile => { tile.addEventListener('dragstart', e => { e.dataTransfer.setData("text/plain", tile.textContent); }); });
dropzone.addEventListener('dragover', e => e.preventDefault());
dropzone.addEventListener('drop', e => {
    e.preventDefault();
    const value = e.dataTransfer.getData("text/plain");
    if ([...dropzone.children].some(c => c.textContent === value)) return;
    const newTile = document.createElement("div");
    newTile.className = "number-tile";
    newTile.textContent = value;
    dropzone.appendChild(newTile);
});

function checkOrder() {
    const correct = ["0,007", "0,07", "0,7", "7", "70", "700"];
    const current = [...dropzone.children].map(el => el.textContent);
    const feedback = document.getElementById("sortFeedback");
    if (current.length !== 6) { feedback.textContent = t('fb.fill.6'); feedback.style.color = "orange"; return; }
    if (JSON.stringify(current) === JSON.stringify(correct)) {
        feedback.textContent = t('fb.sort.ok'); feedback.style.color = "green";
        saveScore('talSortering', 1);
    } else {
        feedback.textContent = t('fb.wrong'); feedback.style.color = "red";
    }
}

function checkRabatAnswer() {
    const answer = parseFloat(document.getElementById("rabatAnswer").value);
    const correct = Math.round((3 * 79.95 * 0.85) * 100) / 100;
    const feedback = document.getElementById("rabatFeedback");
    if (isNaN(answer)) { feedback.textContent = t('fb.enter'); feedback.style.color = "orange"; return; }
    if (Math.abs(answer - correct) < 0.01) {
        feedback.textContent = t('fb.rabat.ok'); feedback.style.color = "green";
        saveScore('rabat', 1);
    } else {
        feedback.textContent = `${t('fb.wrong')} (${correct.toFixed(2)} kr.)`; feedback.style.color = "red";
    }
}

function checkPattern() {
    const answer = parseInt(document.getElementById("patternAnswer").value);
    const feedback = document.getElementById("patternFeedback");
    if (isNaN(answer)) { feedback.textContent = t('fb.enter'); feedback.style.color = "orange"; return; }
    if (answer === 32) {
        feedback.textContent = t('fb.pattern.ok'); feedback.style.color = "green";
        saveScore('monster', 1);
    } else {
        feedback.textContent = t('fb.wrong'); feedback.style.color = "red";
    }
}

function checkLargest(event) {
    event.preventDefault();
    const selected = document.querySelector('input[name="largest"]:checked');
    const feedback = document.getElementById("largestFeedback");
    if (!selected) { feedback.textContent = t('fb.select'); feedback.style.color = "orange"; return; }
    if (selected.value === "2") {
        feedback.textContent = t('fb.largest.ok'); feedback.style.color = "green";
        saveScore('storste', 1);
    } else {
        feedback.textContent = t('fb.wrong'); feedback.style.color = "red";
    }
}

function checkRound() {
    const answer = parseInt(document.getElementById("roundAnswer").value);
    const feedback = document.getElementById("roundFeedback");
    if (isNaN(answer)) { feedback.textContent = t('fb.enter.whole'); feedback.style.color = "orange"; return; }
    if (answer === 5) {
        feedback.textContent = t('fb.round.ok'); feedback.style.color = "green";
        saveScore('afrunding', 1);
    } else {
        feedback.textContent = t('fb.wrong'); feedback.style.color = "red";
    }
}

function checkVinkel() {
    const svar = parseInt(document.getElementById("vinkelSvar").value);
    const feedback = document.getElementById("vinkelFeedback");
    if (isNaN(svar)) { feedback.textContent = t('fb.enter'); feedback.style.color = "orange"; return; }
    if (svar === 23) {
        feedback.textContent = t('fb.angle.ok'); feedback.style.color = "green";
        saveScore('vinkel', 1);
    } else {
        feedback.textContent = t('fb.wrong'); feedback.style.color = "red";
    }
}

function checkGulvOpgave() {
    const areal = parseFloat(document.getElementById("arealSvar").value);
    const pris = parseFloat(document.getElementById("prisSvar").value);
    const feedback = document.getElementById("gulvFeedback");
    const korrektAreal = 13;
    const korrektPris = korrektAreal * 77;
    if (isNaN(areal) || isNaN(pris)) { feedback.textContent = t('fb.fill.both'); feedback.style.color = "orange"; return; }
    const arealOK = Math.abs(areal - korrektAreal) < 0.1;
    const prisOK = Math.abs(pris - korrektPris) < 1;
    if (arealOK && prisOK) {
        feedback.textContent = t('fb.floor.both'); feedback.style.color = "green";
        saveScore('gulvAreal', 1); saveScore('gulvPris', 1);
    } else if (!arealOK && prisOK) {
        feedback.textContent = t('fb.floor.pris'); feedback.style.color = "red";
        saveScore('gulvPris', 1);
    } else if (arealOK && !prisOK) {
        feedback.textContent = t('fb.floor.areal'); feedback.style.color = "red";
        saveScore('gulvAreal', 1);
    } else {
        feedback.textContent = t('fb.wrong'); feedback.style.color = "red";
    }
}

const gridContainer = document.getElementById("gridContainer");
for (let i = 0; i < 100; i++) {
    const cell = document.createElement("div");
    cell.className = "grid-cell";
    cell.addEventListener("click", () => { cell.classList.toggle("clicked"); });
    gridContainer.appendChild(cell);
}

function checkAreal() {
    const clicked = document.querySelectorAll(".grid-cell.clicked").length;
    const feedback = document.getElementById("arealFeedback");
    if (clicked === 23) {
        feedback.textContent = t('fb.areal.ok'); feedback.style.color = "green";
        saveScore('areal', 1);
    } else {
        feedback.textContent = t('fb.areal.err', { n: clicked }); feedback.style.color = "red";
    }
}

function checkOmkreds() {
    const input = document.getElementById("omkredsSvar1");
    const feedback = document.getElementById("omkredsFeedback1");
    const brugerSvar = parseInt(input.value);
    if (brugerSvar === 11) { feedback.textContent = t('fb.omk.ok'); feedback.style.color = "green"; }
    else { feedback.textContent = t('fb.wrong'); feedback.style.color = "red"; }
}

function checkRefleksion() {
    const svar = document.getElementById("refleksionSvar").value.trim();
    const feedback = document.getElementById("refleksionFeedback");
    if (svar.length < 10) { feedback.textContent = t('fb.write.more'); feedback.style.color = "orange"; }
    else { feedback.textContent = t('fb.thanks.refl'); feedback.style.color = "green"; }
}

function checkPlus() {
    const svar1 = parseInt(document.getElementById("plus1").value);
    const svar2 = parseInt(document.getElementById("plus2").value);
    const svar3 = parseInt(document.getElementById("plus3").value);
    const r1 = svar1 === 165, r2 = svar2 === 99, r3 = svar3 === 85;
    document.getElementById("feedback1").textContent = r1 ? t('fb.correct') : t('fb.wrong');
    document.getElementById("feedback2").textContent = r2 ? t('fb.correct') : t('fb.wrong');
    document.getElementById("feedback3").textContent = r3 ? t('fb.correct') : t('fb.wrong');
    document.getElementById("feedback1").style.color = r1 ? "green" : "red";
    document.getElementById("feedback2").style.color = r2 ? "green" : "red";
    document.getElementById("feedback3").style.color = r3 ? "green" : "red";
    saveScore('plus', [r1, r2, r3].filter(Boolean).length);
}

function checkMinus() {
    const svar1 = parseInt(document.getElementById("minus1").value);
    const svar2 = parseInt(document.getElementById("minus2").value);
    const svar3 = parseInt(document.getElementById("minus3").value);
    const r1 = svar1 === 73, r2 = svar2 === 22, r3 = svar3 === 36;
    document.getElementById("feedbackMinus1").textContent = r1 ? t('fb.correct') : t('fb.wrong');
    document.getElementById("feedbackMinus2").textContent = r2 ? t('fb.correct') : t('fb.wrong');
    document.getElementById("feedbackMinus3").textContent = r3 ? t('fb.correct') : t('fb.wrong');
    document.getElementById("feedbackMinus1").style.color = r1 ? "green" : "red";
    document.getElementById("feedbackMinus2").style.color = r2 ? "green" : "red";
    document.getElementById("feedbackMinus3").style.color = r3 ? "green" : "red";
    saveScore('minus', [r1, r2, r3].filter(Boolean).length);
}

function checkDivision() {
    const svar1 = parseInt(document.getElementById("div1").value);
    const svar2 = parseInt(document.getElementById("div2").value);
    const svar3 = parseInt(document.getElementById("div3").value);
    const r1 = svar1 === 12, r2 = svar2 === 12, r3 = svar3 === 15;
    document.getElementById("feedbackDiv1").textContent = r1 ? t('fb.correct') : t('fb.wrong');
    document.getElementById("feedbackDiv2").textContent = r2 ? t('fb.correct') : t('fb.wrong');
    document.getElementById("feedbackDiv3").textContent = r3 ? t('fb.correct') : t('fb.wrong');
    document.getElementById("feedbackDiv1").style.color = r1 ? "green" : "red";
    document.getElementById("feedbackDiv2").style.color = r2 ? "green" : "red";
    document.getElementById("feedbackDiv3").style.color = r3 ? "green" : "red";
    saveScore('division', [r1, r2, r3].filter(Boolean).length);
}

function checkBrok() {
    const svar1 = parseInt(document.getElementById("brok1").value);
    const svar2 = parseInt(document.getElementById("brok2").value);
    const svar3 = parseInt(document.getElementById("brok3").value);
    const r1 = svar1 === 50, r2 = svar2 === 75, r3 = svar3 === 40;
    document.getElementById("feedbackBrok1").textContent = r1 ? t('fb.correct') + ' ½ = 50%' : t('fb.wrong');
    document.getElementById("feedbackBrok2").textContent = r2 ? t('fb.correct') + ' ¾ = 75%' : t('fb.wrong');
    document.getElementById("feedbackBrok3").textContent = r3 ? t('fb.correct') + ' ⅖ = 40%' : t('fb.wrong');
    document.getElementById("feedbackBrok1").style.color = r1 ? "green" : "red";
    document.getElementById("feedbackBrok2").style.color = r2 ? "green" : "red";
    document.getElementById("feedbackBrok3").style.color = r3 ? "green" : "red";
    saveScore('brok', [r1, r2, r3].filter(Boolean).length);
}

function tjekKagekaos() {
    const elevSvar = parseInt(document.getElementById("antalElever").value);
    const kageSvar = parseInt(document.getElementById("antalKager").value);
    const chokoSvar = parseInt(document.getElementById("stykkerChoko").value);
    const lagkageSvar = parseInt(document.getElementById("stykkerLagkage").value);
    const citronSvar = parseInt(document.getElementById("tilbageCitron").value);
    const feedback = document.getElementById("kageFeedback");
    const korrekt = elevSvar === 24 && kageSvar === 5 && chokoSvar === 16 && lagkageSvar === 12 && citronSvar === 2;
    if (korrekt) {
        feedback.textContent = t('fb.cake.ok'); feedback.style.color = "green";
        saveScore('kagekaos', 1);
    } else {
        feedback.textContent = t('fb.cake.err'); feedback.style.color = "red";
    }
}

function tjekDatoer() {
    const emmaSvar = document.getElementById("emmaRetur").value.trim();
    const lucasSvar = document.getElementById("lucasAfrejse").value.trim();
    const skoleSvar = document.getElementById("skolestart").value.trim();
    const feedback = document.getElementById("datoFeedback");
    if (emmaSvar === "29-10-2025" && lucasSvar === "17-10-2025" && skoleSvar === "03-11-2025") {
        feedback.textContent = t('fb.dates.ok'); feedback.style.color = "green";
        saveScore('datoer', 1);
    } else {
        feedback.textContent = t('fb.dates.err'); feedback.style.color = "red";
    }
}

function tjekMaaleAlm() {
    const svar1 = parseFloat(document.getElementById("svar1").value);
    const svar2 = parseFloat(document.getElementById("svar2").value);
    const svar3 = parseInt(document.getElementById("svar3").value);
    const r1 = svar1 === 320, r2 = svar2 === 15, r3 = svar3 === 270;
    document.getElementById("feedback1").textContent = r1 ? t('fb.units.m') : t('fb.wrong');
    document.getElementById("feedback2").textContent = r2 ? t('fb.units.l') : t('fb.wrong');
    document.getElementById("feedback3").textContent = r3 ? t('fb.units.s') : t('fb.wrong');
    document.getElementById("feedback1").style.color = r1 ? "green" : "red";
    document.getElementById("feedback2").style.color = r2 ? "green" : "red";
    document.getElementById("feedback3").style.color = r3 ? "green" : "red";
    saveScore('maaleAlm', [r1, r2, r3].filter(Boolean).length);
}

// ── Timer ────────────────────────────────────────────────────────────────────

let seconds = 0;
let timerInterval = null;
let timerRunning = false;

function toggleTimer() {
    if (timerRunning) {
        clearInterval(timerInterval);
        timerRunning = false;
        document.getElementById("timerToggleBtn").textContent = "▶";
        document.getElementById("timerToggleBtn").title = "Start";
    } else {
        timerInterval = setInterval(() => {
            seconds++;
            const m = Math.floor(seconds / 60);
            const s = seconds % 60;
            document.getElementById("timeDisplay").textContent =
                String(m).padStart(2, '0') + ":" + String(s).padStart(2, '0');
        }, 1000);
        timerRunning = true;
        document.getElementById("timerToggleBtn").textContent = "⏸";
        document.getElementById("timerToggleBtn").title = "Pause";
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    timerRunning = false;
    seconds = 0;
    document.getElementById("timeDisplay").textContent = "00:00";
    document.getElementById("timerToggleBtn").textContent = "▶";
    document.getElementById("timerToggleBtn").title = "Start";
}
