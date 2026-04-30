const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#8E44AD", "#2ECC71", "#E67E22", "#3498DB", "#D35400"];

document.getElementById("setupTasks").addEventListener("click", () => {
    const totalMin = parseInt(document.getElementById("totalTime").value, 10);
    const count = parseInt(document.getElementById("taskCount").value, 10);
    const container = document.getElementById("taskInputs");
    container.innerHTML = "";
    if (!totalMin || !count || count < 1) { alert("Angiv total tid (min) og antal opgaver (≥1)."); return; }
    const defaultPct = (100 / count).toFixed(2);
    for (let i = 1; i <= count; i++) {
        const row = document.createElement("div");
        row.className = "task-row";
        row.innerHTML = `<label>Opgave ${i} (%):</label><input type="number" class="task-pct" min="1" max="100" step="0.01" value="${defaultPct}">`;
        container.appendChild(row);
    }
});

document.getElementById("autoDivide").addEventListener("click", () => {
    const pctInputs = Array.from(document.querySelectorAll(".task-pct"));
    if (pctInputs.length === 0) { alert("Generer først opgaverne."); return; }
    const equal = (100 / pctInputs.length).toFixed(2);
    pctInputs.forEach(inp => inp.value = equal);
});

let timeChart, currentTask = 0, remaining = 0, timerHandle;

document.getElementById("startTimer").addEventListener("click", () => {
    const totalMin = parseFloat(document.getElementById("totalTime").value);
    const pctInputs = Array.from(document.querySelectorAll(".task-pct"));
    if (!totalMin || pctInputs.length === 0) { alert("Indtast total tid og generer opgaver."); return; }

    const segments = pctInputs.map(inp => Math.floor((parseFloat(inp.value) / 100) * totalMin * 60));
    const labels = segments.map((_, i) => `Opgave ${i + 1}`);
    const totalSeconds = segments.reduce((a, b) => a + b, 0);

    // Save to localStorage so the floating timer can follow across pages
    localStorage.setItem("kubo_timer", JSON.stringify({
        segments,
        labels,
        startTime: Date.now(),
        totalSeconds
    }));

    currentTask = 0;
    remaining = segments[0];

    if (timeChart) timeChart.destroy();
    timeChart = new Chart(document.getElementById("timeChart"), {
        type: "pie",
        data: {
            labels,
            datasets: [{ data: [...segments], backgroundColor: COLORS.slice(0, segments.length) }]
        },
        options: { plugins: { legend: { position: "bottom" } }, animation: { duration: 0 } }
    });

    clearInterval(timerHandle);
    timerHandle = setInterval(() => {
        if (remaining > 0) {
            remaining--;
            timeChart.data.datasets[0].data[currentTask] = remaining;
            timeChart.update();
        } else if (currentTask < segments.length - 1) {
            currentTask++;
            remaining = segments[currentTask];
        } else {
            clearInterval(timerHandle);
            localStorage.removeItem("kubo_timer");
        }
    }, 1000);
});
