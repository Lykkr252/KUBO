function checkClockAnswer(event) {
    event.preventDefault();
    const selected = document.querySelector('input[name="tid"]:checked');
    const feedback = document.getElementById("clockFeedback");
    if (!selected) { feedback.textContent = "⚠️ Vælg et svar."; feedback.style.color = "orange"; return; }
    if (selected.value === "2") { feedback.textContent = "✅ Rigtigt! Klokken er 16:30."; feedback.style.color = "green"; }
    else { feedback.textContent = "❌ Prøv igen."; feedback.style.color = "red"; }
}
function gemUrPræference() {
    const val = document.getElementById("urPref").value;
    const feedback = document.getElementById("urSvar");
    if (!val) { feedback.textContent = "⚠️ Vælg en ur-type."; feedback.style.color = "orange"; }
    else { feedback.textContent = "✅ Tak for din feedback!"; feedback.style.color = "green"; }
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
    if (current.length !== 6) { feedback.textContent = "⚠️ Du skal placere alle 6 tal."; feedback.style.color = "orange"; return; }
    if (JSON.stringify(current) === JSON.stringify(correct)) { feedback.textContent = "✅ Godt gået!"; feedback.style.color = "green"; }
    else { feedback.textContent = "❌ Prøv igen."; feedback.style.color = "red"; }
}
function checkRabatAnswer() {
    const answer = parseFloat(document.getElementById("rabatAnswer").value);
    const correct = Math.round((3 * 79.95 * 0.85) * 100) / 100;
    const feedback = document.getElementById("rabatFeedback");
    if (isNaN(answer)) { feedback.textContent = "⚠️ Indtast et tal."; feedback.style.color = "orange"; return; }
    if (Math.abs(answer - correct) < 0.01) { feedback.textContent = "✅ Korrekt!"; feedback.style.color = "green"; }
    else { feedback.textContent = `❌ Forkert. Rigtigt svar: ${correct.toFixed(2)} kr.`; feedback.style.color = "red"; }
}
function checkPattern() {
    const answer = parseInt(document.getElementById("patternAnswer").value);
    const feedback = document.getElementById("patternFeedback");
    if (isNaN(answer)) { feedback.textContent = "⚠️ Indtast et tal."; feedback.style.color = "orange"; return; }
    if (answer === 32) { feedback.textContent = "✅ Rigtigt! Mønsteret er en fordobling."; feedback.style.color = "green"; }
    else { feedback.textContent = "❌ Forkert. Prøv at kigge på mønsteret igen."; feedback.style.color = "red"; }
}
function checkLargest(event) {
    event.preventDefault();
    const selected = document.querySelector('input[name="largest"]:checked');
    const feedback = document.getElementById("largestFeedback");
    if (!selected) { feedback.textContent = "⚠️ Vælg et svar."; feedback.style.color = "orange"; return; }
    if (selected.value === "2") { feedback.textContent = "✅ Rigtigt! 0,99 er størst."; feedback.style.color = "green"; }
    else { feedback.textContent = "❌ Forkert. Prøv igen."; feedback.style.color = "red"; }
}
function checkRound() {
    const answer = parseInt(document.getElementById("roundAnswer").value);
    const feedback = document.getElementById("roundFeedback");
    if (isNaN(answer)) { feedback.textContent = "⚠️ Indtast et helt tal."; feedback.style.color = "orange"; return; }
    if (answer === 5) { feedback.textContent = "✅ Korrekt! 4,76 rundes op til 5."; feedback.style.color = "green"; }
    else { feedback.textContent = "❌ Forkert. Prøv igen."; feedback.style.color = "red"; }
}
function checkVinkel() {
    const svar = parseInt(document.getElementById("vinkelSvar").value);
    const feedback = document.getElementById("vinkelFeedback");
    const korrektAntal = 23;
    if (isNaN(svar)) { feedback.textContent = "⚠️ Indtast et tal."; feedback.style.color = "orange"; return; }
    if (svar === korrektAntal) { feedback.textContent = "✅ Rigtigt! Du har talt alle 90° vinkler."; feedback.style.color = "green"; }
    else { feedback.textContent = `❌ Forkert. Prøv igen.`; feedback.style.color = "red"; }
}
function checkGulvOpgave() {
    const areal = parseFloat(document.getElementById("arealSvar").value);
    const pris = parseFloat(document.getElementById("prisSvar").value);
    const feedback = document.getElementById("gulvFeedback");
    const korrektAreal = 13;
    const korrektPris = korrektAreal * 77;
    if (isNaN(areal) || isNaN(pris)) { feedback.textContent = "⚠️ Udfyld begge felter med tal."; feedback.style.color = "orange"; return; }
    const arealOK = Math.abs(areal - korrektAreal) < 0.1;
    const prisOK = Math.abs(pris - korrektPris) < 1;
    if (arealOK && prisOK) { feedback.textContent = "✅ Rigtigt! Du har både areal og pris korrekt."; feedback.style.color = "green"; }
    else if (!arealOK && prisOK) { feedback.textContent = "❌ Prisen er korrekt, men arealet er forkert."; feedback.style.color = "red"; }
    else if (arealOK && !prisOK) { feedback.textContent = "❌ Arealet er korrekt, men prisen er forkert."; feedback.style.color = "red"; }
    else { feedback.textContent = `❌ Begge svar er forkerte. Prøv igen.`; feedback.style.color = "red"; }
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
    if (clicked === 23) { feedback.textContent = "✅ Rigtigt! Arealet er 23."; feedback.style.color = "green"; }
    else { feedback.textContent = `❌ Du har valgt ${clicked} felter. Prøv igen.`; feedback.style.color = "red"; }
}
function checkOmkreds() {
    const input = document.getElementById("omkredsSvar1");
    const feedback = document.getElementById("omkredsFeedback1");
    const brugerSvar = parseInt(input.value);
    if (brugerSvar === 11) { feedback.textContent = "✅ Rigtigt! Omkredsen er 11 meter."; feedback.style.color = "green"; }
    else { feedback.textContent = `❌ Forkert. Prøv igen.`; feedback.style.color = "red"; }
}
function checkRefleksion() {
    const svar = document.getElementById("refleksionSvar").value.trim();
    const feedback = document.getElementById("refleksionFeedback");
    if (svar.length < 10) { feedback.textContent = "⚠️ Skriv lidt mere – prøv at forklare med dine egne ord."; feedback.style.color = "orange"; }
    else { feedback.textContent = "✅ Tak for din refleksion!"; feedback.style.color = "green"; }
}
function checkPlus() {
    const svar1 = parseInt(document.getElementById("plus1").value);
    const svar2 = parseInt(document.getElementById("plus2").value);
    const svar3 = parseInt(document.getElementById("plus3").value);
    document.getElementById("feedback1").textContent = svar1 === 165 ? "✅ Rigtigt!" : "❌ Forkert. Prøv igen.";
    document.getElementById("feedback2").textContent = svar2 === 99 ? "✅ Rigtigt!" : "❌ Forkert. Prøv igen.";
    document.getElementById("feedback3").textContent = svar3 === 85 ? "✅ Rigtigt!" : "❌ Forkert. Prøv igen.";
    document.getElementById("feedback1").style.color = svar1 === 165 ? "green" : "red";
    document.getElementById("feedback2").style.color = svar2 === 99 ? "green" : "red";
    document.getElementById("feedback3").style.color = svar3 === 85 ? "green" : "red";
}
function checkMinus() {
    const svar1 = parseInt(document.getElementById("minus1").value);
    const svar2 = parseInt(document.getElementById("minus2").value);
    const svar3 = parseInt(document.getElementById("minus3").value);
    document.getElementById("feedbackMinus1").textContent = svar1 === 73 ? "✅ Rigtigt!" : "❌ Forkert. Prøv igen.";
    document.getElementById("feedbackMinus2").textContent = svar2 === 22 ? "✅ Rigtigt!" : "❌ Forkert. Prøv igen.";
    document.getElementById("feedbackMinus3").textContent = svar3 === 36 ? "✅ Rigtigt!" : "❌ Forkert. Prøv igen.";
    document.getElementById("feedbackMinus1").style.color = svar1 === 73 ? "green" : "red";
    document.getElementById("feedbackMinus2").style.color = svar2 === 22 ? "green" : "red";
    document.getElementById("feedbackMinus3").style.color = svar3 === 36 ? "green" : "red";
}
function checkDivision() {
    const svar1 = parseInt(document.getElementById("div1").value);
    const svar2 = parseInt(document.getElementById("div2").value);
    const svar3 = parseInt(document.getElementById("div3").value);
    document.getElementById("feedbackDiv1").textContent = svar1 === 12 ? "✅ Rigtigt!" : "❌ Forkert. Prøv igen.";
    document.getElementById("feedbackDiv2").textContent = svar2 === 12 ? "✅ Rigtigt!" : "❌ Forkert. Prøv igen.";
    document.getElementById("feedbackDiv3").textContent = svar3 === 15 ? "✅ Rigtigt!" : "❌ Forkert. Prøv igen.";
    document.getElementById("feedbackDiv1").style.color = svar1 === 12 ? "green" : "red";
    document.getElementById("feedbackDiv2").style.color = svar2 === 12 ? "green" : "red";
    document.getElementById("feedbackDiv3").style.color = svar3 === 15 ? "green" : "red";
}
function checkBrok() {
    const svar1 = parseInt(document.getElementById("brok1").value);
    const svar2 = parseInt(document.getElementById("brok2").value);
    const svar3 = parseInt(document.getElementById("brok3").value);
    document.getElementById("feedbackBrok1").textContent = svar1 === 50 ? "✅ Rigtigt! ½ = 50%" : "❌ Forkert. Prøv igen.";
    document.getElementById("feedbackBrok2").textContent = svar2 === 75 ? "✅ Rigtigt! ¾ = 75%" : "❌ Forkert. Prøv igen.";
    document.getElementById("feedbackBrok3").textContent = svar3 === 40 ? "✅ Rigtigt! ⅖ = 40%" : "❌ Forkert. Prøv igen.";
    document.getElementById("feedbackBrok1").style.color = svar1 === 50 ? "green" : "red";
    document.getElementById("feedbackBrok2").style.color = svar2 === 75 ? "green" : "red";
    document.getElementById("feedbackBrok3").style.color = svar3 === 40 ? "green" : "red";
}
function tjekKagekaos() {
    const elevSvar = parseInt(document.getElementById("antalElever").value);
    const kageSvar = parseInt(document.getElementById("antalKager").value);
    const chokoSvar = parseInt(document.getElementById("stykkerChoko").value);
    const lagkageSvar = parseInt(document.getElementById("stykkerLagkage").value);
    const citronSvar = parseInt(document.getElementById("tilbageCitron").value);
    const feedback = document.getElementById("kageFeedback");
    const korrekt = elevSvar === 24 && kageSvar === 5 && chokoSvar === 16 && lagkageSvar === 12 && citronSvar === 2;
    if (korrekt) { feedback.textContent = "✅ Super! Du har husket alle de vigtigste detaljer."; feedback.style.color = "green"; }
    else { feedback.textContent = "❌ Noget er forkert. Prøv igen eller læs historien én gang mere."; feedback.style.color = "red"; }
}
function tjekDatoer() {
    const emmaSvar = document.getElementById("emmaRetur").value.trim();
    const lucasSvar = document.getElementById("lucasAfrejse").value.trim();
    const skoleSvar = document.getElementById("skolestart").value.trim();
    const feedback = document.getElementById("datoFeedback");
    if (emmaSvar === "29-10-2025" && lucasSvar === "17-10-2025" && skoleSvar === "03-11-2025") {
        feedback.textContent = "✅ Rigtigt! Du har styr på datoerne."; feedback.style.color = "green";
    } else { feedback.textContent = "❌ Noget er forkert. Tjek dine beregninger og prøv igen."; feedback.style.color = "red"; }
}
function tjekMaaleAlm() {
    const svar1 = parseFloat(document.getElementById("svar1").value);
    const svar2 = parseFloat(document.getElementById("svar2").value);
    const svar3 = parseInt(document.getElementById("svar3").value);
    document.getElementById("feedback1").textContent = svar1 === 320 ? "✅ Rigtigt! 3,2 m = 320 cm." : "❌ Forkert. Prøv igen.";
    document.getElementById("feedback2").textContent = svar2 === 15 ? "✅ Rigtigt! 1,5 l = 15 dl." : "❌ Forkert. Prøv igen.";
    document.getElementById("feedback3").textContent = svar3 === 270 ? "✅ Rigtigt! 4 min 30 sek = 270 sek." : "❌ Forkert. Prøv igen.";
    document.getElementById("feedback1").style.color = svar1 === 320 ? "green" : "red";
    document.getElementById("feedback2").style.color = svar2 === 15 ? "green" : "red";
    document.getElementById("feedback3").style.color = svar3 === 270 ? "green" : "red";
}
let seconds = 0;
let timerInterval = null;
function startTimer() {
    timerInterval = setInterval(() => {
        seconds++;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        document.getElementById("timeDisplay").textContent = String(minutes).padStart(2, '0') + ":" + String(remainingSeconds).padStart(2, '0');
    }, 1000);
}
function resetTimer() {
    clearInterval(timerInterval);
    seconds = 0;
    document.getElementById("timeDisplay").textContent = "00:00";
    startTimer();
}
startTimer();
