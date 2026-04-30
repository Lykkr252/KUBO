const currentUserId = typeof getCurrentUserId === 'function' ? getCurrentUserId() : null;
const _CAL_KEY = currentUserId ? `kubo_calendar_${currentUserId}` : 'kubo_calendar_guest';

function loadEvents() {
    try { return JSON.parse(localStorage.getItem(_CAL_KEY)) || {}; } catch { return {}; }
}

function saveAllEvents(allEvents) {
    localStorage.setItem(_CAL_KEY, JSON.stringify(allEvents));
}

document.addEventListener("DOMContentLoaded", function () {
    let currentDate = new Date();

    const grid = document.getElementById("calendarGrid");
    const eventModal = document.getElementById("eventModal");
    const eventModalTitle = document.getElementById("eventModalTitle");
    const eventList = document.getElementById("eventList");
    const newEventInput = document.getElementById("newEventInput");
    const addEventBtn = document.getElementById("addEventBtn");
    const closeEventModal = document.getElementById("closeEventModal");
    const settingsModal = document.getElementById("settingsModal");
    const openSettingsBtn = document.getElementById("openSettings");
    const closeSettingsBtn = document.getElementById("closeSettings");

    const monthNames = [
        "Januar", "Februar", "Marts", "April", "Maj", "Juni",
        "Juli", "August", "September", "Oktober", "November", "December"
    ];

    let settings = loadSettings();

    function loadSettings() {
        try {
            return JSON.parse(localStorage.getItem("kubo_cal_settings")) || defaultSettings();
        } catch {
            return defaultSettings();
        }
    }

    function defaultSettings() {
        return {
            showNumbers: true,
            showSymbols: true,
            showColors: true,
            colors: ["#FFB6C1", "#87CEFA", "#FFD700", "#90EE90", "#FFA07A", "#DDA0DD", "#ADD8E6"],
            symbols: ["🌞", "📚", "🎯", "💡", "🔔", "🔢", "🧩"]
        };
    }

    function saveSettings() {
        localStorage.setItem("kubo_cal_settings", JSON.stringify(settings));
    }

    // ── Events storage ───────────────────────────────────────────────────────
    let activeDay  = null;
    let allEvents  = loadEvents();

    function eventKey(year, month, day) {
        return `${year}-${month}-${day}`;
    }

    function getEvents(year, month, day) {
        return allEvents[eventKey(year, month, day)] || [];
    }

    function saveEvents(year, month, day, events) {
        const key = eventKey(year, month, day);
        if (events.length === 0) delete allEvents[key];
        else allEvents[key] = events;
        saveAllEvents(allEvents);
    }

    // ── Navigation ───────────────────────────────────────────────────────────
    document.getElementById("prevBtn").addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        render();
    });

    document.getElementById("nextBtn").addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        render();
    });

    // ── Settings modal ───────────────────────────────────────────────────────
    openSettingsBtn.addEventListener("click", () => {
        populateSettingsModal();
        settingsModal.style.display = "flex";
    });

    closeSettingsBtn.addEventListener("click", () => {
        settingsModal.style.display = "none";
    });

    settingsModal.addEventListener("click", (e) => {
        if (e.target === settingsModal) settingsModal.style.display = "none";
    });

    function populateSettingsModal() {
        document.getElementById("toggleNumbers").checked = settings.showNumbers;
        document.getElementById("toggleSymbols").checked = settings.showSymbols;
        document.getElementById("toggleColors").checked  = settings.showColors;

        const colorGrid = document.getElementById("colorPickers");
        colorGrid.innerHTML = "";
        settings.colors.forEach((color, i) => {
            const wrap = document.createElement("label");
            wrap.className = "color-picker-wrap";
            wrap.title = `Dag ${i + 1}'s farve`;

            const inp = document.createElement("input");
            inp.type = "color";
            inp.value = color;
            inp.dataset.idx = i;
            inp.addEventListener("input", () => {
                settings.colors[i] = inp.value;
                saveSettings();
                render();
            });

            const swatch = document.createElement("span");
            swatch.className = "color-swatch";
            swatch.style.background = color;
            inp.addEventListener("input", () => swatch.style.background = inp.value);

            wrap.appendChild(inp);
            wrap.appendChild(swatch);
            colorGrid.appendChild(wrap);
        });

        const symbolGrid = document.getElementById("symbolInputs");
        symbolGrid.innerHTML = "";
        settings.symbols.forEach((sym, i) => {
            const wrap = document.createElement("div");
            wrap.className = "symbol-input-wrap";

            const inp = document.createElement("input");
            inp.type = "text";
            inp.value = sym;
            inp.maxLength = 4;
            inp.className = "symbol-input";
            inp.dataset.idx = i;
            inp.addEventListener("input", () => {
                settings.symbols[i] = inp.value || "·";
                saveSettings();
                render();
            });

            wrap.appendChild(inp);
            symbolGrid.appendChild(wrap);
        });
    }

    document.getElementById("toggleNumbers").addEventListener("change", (e) => {
        settings.showNumbers = e.target.checked; saveSettings(); render();
    });
    document.getElementById("toggleSymbols").addEventListener("change", (e) => {
        settings.showSymbols = e.target.checked; saveSettings(); render();
    });
    document.getElementById("toggleColors").addEventListener("change", (e) => {
        settings.showColors = e.target.checked; saveSettings(); render();
    });

    document.getElementById("resetSettings").addEventListener("click", () => {
        settings = defaultSettings(); saveSettings(); populateSettingsModal(); render();
    });

    // ── Event modal ──────────────────────────────────────────────────────────
    closeEventModal.addEventListener("click", () => {
        eventModal.style.display = "none"; activeDay = null; render();
    });

    eventModal.addEventListener("click", (e) => {
        if (e.target === eventModal) { eventModal.style.display = "none"; activeDay = null; render(); }
    });

    addEventBtn.addEventListener("click", () => { addEvent(); });
    newEventInput.addEventListener("keydown", (e) => { if (e.key === "Enter") addEvent(); });

    function addEvent() {
        const text = newEventInput.value.trim();
        if (!text || !activeDay) return;
        const { year, month, day } = activeDay;
        const events = [...getEvents(year, month, day)];
        events.push(text);
        saveEvents(year, month, day, events);
        newEventInput.value = "";
        renderEventList();
        render();
    }

    function renderEventList() {
        if (!activeDay) return;
        const { year, month, day } = activeDay;
        const events = getEvents(year, month, day);
        eventList.innerHTML = "";

        if (events.length === 0) {
            eventList.innerHTML = `<p class="no-events">Ingen begivenheder endnu.</p>`;
            return;
        }

        events.forEach((ev, idx) => {
            const item = document.createElement("div");
            item.className = "event-item";
            item.innerHTML = `
                <span class="event-dot-small" style="background:${getEventColor(idx)}"></span>
                <span class="event-text">${escapeHtml(ev)}</span>
                <button class="event-delete-btn" data-idx="${idx}">✕</button>
            `;
            item.querySelector(".event-delete-btn").addEventListener("click", () => {
                const evs = [...getEvents(year, month, day)];
                evs.splice(idx, 1);
                saveEvents(year, month, day, evs);
                renderEventList();
                render();
            });
            eventList.appendChild(item);
        });
    }

    function getEventColor(idx) {
        const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#8E44AD", "#2ECC71", "#E67E22", "#3498DB"];
        return colors[idx % colors.length];
    }

    function escapeHtml(str) {
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    function openDayModal(year, month, day) {
        const weekdayNames = ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"];
        const date = new Date(year, month, day);
        eventModalTitle.textContent = `${weekdayNames[date.getDay()]} d. ${day}. ${monthNames[month]} ${year}`;
        activeDay = { year, month, day };
        renderEventList();
        newEventInput.value = "";
        eventModal.style.display = "flex";
        setTimeout(() => newEventInput.focus(), 100);
    }

    // ── Render calendar ──────────────────────────────────────────────────────
    function render() {
        const year  = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const today = new Date();

        document.getElementById("monthName").textContent = monthNames[month];
        document.getElementById("year").textContent = year;

        grid.innerHTML = "";

        const firstDay    = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const offset      = (firstDay + 6) % 7;

        for (let i = 0; i < offset; i++) grid.appendChild(document.createElement("div"));

        for (let day = 1; day <= daysInMonth; day++) {
            const events  = getEvents(year, month, day);
            const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
            const colorIdx = (day - 1) % settings.colors.length;
            const symIdx   = (day - 1) % settings.symbols.length;

            const el = document.createElement("div");
            el.className = "day" + (isToday ? " day-today" : "");
            el.title = "Klik for at tilføje begivenhed";

            if (settings.showColors && !isToday) el.style.backgroundColor = settings.colors[colorIdx];

            if (settings.showSymbols) {
                const symEl = document.createElement("span");
                symEl.className = "day-symbol";
                symEl.textContent = settings.symbols[symIdx];
                el.appendChild(symEl);
            }

            if (settings.showNumbers) {
                const numEl = document.createElement("strong");
                numEl.className = "day-number";
                numEl.textContent = day;
                el.appendChild(numEl);
            }

            if (events.length > 0) {
                const dotsEl = document.createElement("div");
                dotsEl.className = "event-dots";
                const max = Math.min(events.length, 3);
                for (let d = 0; d < max; d++) {
                    const dot = document.createElement("span");
                    dot.className = "event-dot-small";
                    dot.style.background = getEventColor(d);
                    dotsEl.appendChild(dot);
                }
                if (events.length > 3) {
                    const more = document.createElement("span");
                    more.className = "event-more";
                    more.textContent = `+${events.length - 3}`;
                    dotsEl.appendChild(more);
                }
                el.appendChild(dotsEl);

                const preview = document.createElement("div");
                preview.className = "event-preview";
                preview.textContent = events[0];
                el.appendChild(preview);
            }

            el.addEventListener("click", () => openDayModal(year, month, day));
            grid.appendChild(el);
        }
    }

    render();
});
