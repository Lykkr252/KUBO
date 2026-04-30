/**
 * KUBO Floating Timer Widget
 * Persistent donut chart with centered digital countdown, follows across all pages.
 */
(function () {
    const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#8E44AD", "#2ECC71", "#E67E22", "#3498DB", "#D35400"];
    const STORAGE_KEY = "kubo_timer";

    function getState() {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch { return null; }
    }

    function clearState() { localStorage.removeItem(STORAGE_KEY); }

    function calcPosition(state) {
        const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
        if (elapsed >= state.totalSeconds) return null;
        let cum = 0;
        for (let i = 0; i < state.segments.length; i++) {
            if (elapsed < cum + state.segments[i]) {
                const rem = state.segments[i] - (elapsed - cum);
                return {
                    task: i,
                    remaining: rem,
                    data: state.segments.map((seg, j) => {
                        if (j < i) return 0;
                        if (j === i) return rem;
                        return seg;
                    })
                };
            }
            cum += state.segments[i];
        }
        return null;
    }

    function fmt(seconds) {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
    }

    function getTimerLink() {
        return window.location.pathname.includes("/pages/") ? "tidsstyring.html" : "pages/tidsstyring.html";
    }

    function createWidget(state) {
        const pos = calcPosition(state);
        if (!pos) { clearState(); return; }

        const widget = document.createElement("div");
        widget.id = "floatingTimer";
        widget.innerHTML = `
            <div id="ft-header">
                <a href="${getTimerLink()}" id="ft-title">⏱️ Timer aktiv</a>
                <button id="ft-close" title="Stop timer">✕</button>
            </div>
            <div id="ft-body">
                <div id="ft-chart-wrap">
                    <canvas id="ft-canvas" width="120" height="120"></canvas>
                    <div id="ft-overlay">
                        <div id="ft-clock">${fmt(pos.remaining)}</div>
                        <div id="ft-prog">${pos.task + 1}/${state.segments.length}</div>
                    </div>
                </div>
                <div id="ft-info">
                    <div id="ft-task">${state.labels[pos.task]}</div>
                    <div id="ft-label">Opgave ${pos.task + 1} af ${state.segments.length}</div>
                </div>
            </div>
        `;
        document.body.appendChild(widget);

        const ctx = document.getElementById("ft-canvas").getContext("2d");
        const chart = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: state.labels,
                datasets: [{
                    data: pos.data,
                    backgroundColor: COLORS.slice(0, state.segments.length),
                    borderWidth: 3,
                    borderColor: "#fff"
                }]
            },
            options: {
                plugins: { legend: { display: false }, tooltip: { enabled: false } },
                animation: { duration: 300 },
                cutout: "62%"
            }
        });

        document.getElementById("ft-close").addEventListener("click", () => {
            clearState();
            widget.remove();
            clearInterval(interval);
        });

        const interval = setInterval(() => {
            const s = getState();
            if (!s) { widget.remove(); clearInterval(interval); return; }

            const p = calcPosition(s);
            if (!p) {
                clearState();
                widget.remove();
                clearInterval(interval);
                showFinished();
                return;
            }

            chart.data.datasets[0].data = p.data;
            chart.update();
            document.getElementById("ft-clock").textContent = fmt(p.remaining);
            document.getElementById("ft-prog").textContent = (p.task + 1) + "/" + s.segments.length;
            document.getElementById("ft-task").textContent = s.labels[p.task];
            document.getElementById("ft-label").textContent = "Opgave " + (p.task + 1) + " af " + s.segments.length;
        }, 1000);
    }

    function showFinished() {
        const note = document.createElement("div");
        note.id = "floatingTimer";
        note.style.cssText = "border-color:#16A34A;";
        note.innerHTML = `<div id="ft-header" style="background:#16A34A;"><span>✅ Tid op!</span><button style="background:rgba(255,255,255,0.3);border:none;color:white;cursor:pointer;border-radius:50%;width:22px;height:22px;font-family:inherit;" onclick="this.closest('#floatingTimer').remove()">✕</button></div>`;
        document.body.appendChild(note);
        setTimeout(() => note.remove(), 4000);
    }

    function loadChartAndInit() {
        if (window.Chart) { createWidget(getState()); return; }
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/chart.js";
        script.onload = () => createWidget(getState());
        document.head.appendChild(script);
    }

    window.addEventListener("load", () => {
        if (getState()) loadChartAndInit();
    });
})();
