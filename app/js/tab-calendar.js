let calendarTabState = {
    matterRef: null,
    cursorDate: new Date()
};

function loadTab_Calendar(matter_id) {
    calendarTabState = {
        matterRef: matter_id,
        cursorDate: new Date()
    };

    const contentArea = document.getElementById("tabContentArea");
    contentArea.innerHTML = `
        <div class="calendar-lite-shell animate-fade-in">
            <div class="calendar-lite-header">
                <h3 class="calendar-lite-title">Calendar</h3>
                <button class="btn-primary-compact" onclick="openCalendarReportInNewWindow()">Open full calendar</button>
            </div>

            <div class="calendar-lite-toolbar">
                <div class="calendar-lite-view-tabs">
                    <button class="calendar-lite-tab active">Month</button>
                    <button class="calendar-lite-tab" disabled>Week</button>
                    <button class="calendar-lite-tab" disabled>Day</button>
                </div>
                <div class="calendar-lite-nav">
                    <button class="calendar-lite-nav-btn" id="calendarPrevBtn">&#8249;</button>
                    <button class="calendar-lite-nav-btn" id="calendarNextBtn">&#8250;</button>
                    <button class="calendar-lite-today-btn" id="calendarTodayBtn">Today</button>
                </div>
            </div>

            <div class="calendar-lite-month-title" id="calendarMonthTitle"></div>
            <div class="calendar-lite-grid-wrap" id="calendarGridWrap"></div>
        </div>
    `;

    document.getElementById("calendarPrevBtn")?.addEventListener("click", () => {
        calendarTabState.cursorDate = shiftMonth(calendarTabState.cursorDate, -1);
        renderCalendarMonth();
    });

    document.getElementById("calendarNextBtn")?.addEventListener("click", () => {
        calendarTabState.cursorDate = shiftMonth(calendarTabState.cursorDate, 1);
        renderCalendarMonth();
    });

    document.getElementById("calendarTodayBtn")?.addEventListener("click", () => {
        calendarTabState.cursorDate = new Date();
        renderCalendarMonth();
    });

    renderCalendarMonth();
}

function renderCalendarMonth() {
    const wrap = document.getElementById("calendarGridWrap");
    const titleEl = document.getElementById("calendarMonthTitle");
    if (!wrap || !titleEl) return;

    const d = calendarTabState.cursorDate;
    const month = d.getMonth();
    const year = d.getFullYear();

    titleEl.textContent = d.toLocaleString("en-US", { month: "long", year: "numeric" });

    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startWeekday = firstDay.getDay();

    const monthStartIso = calendarDateToIso(new Date(year, month, 1));
    const monthEndIso = calendarDateToIso(new Date(year, month, daysInMonth));

    const events = getCurrentMatterCalendarRows().filter(eventIntersectsMonth(monthStartIso, monthEndIso));

    let html = `
        <table class="calendar-lite-grid">
            <thead>
                <tr>
                    <th>Sunday</th>
                    <th>Monday</th>
                    <th>Tuesday</th>
                    <th>Wednesday</th>
                    <th>Thursday</th>
                    <th>Friday</th>
                    <th>Saturday</th>
                </tr>
            </thead>
            <tbody>
    `;

    let dayCounter = 1;
    for (let row = 0; row < 6; row++) {
        html += "<tr>";
        for (let col = 0; col < 7; col++) {
            const cellIndex = row * 7 + col;
            if (cellIndex < startWeekday || dayCounter > daysInMonth) {
                html += `<td class="calendar-lite-day is-empty"></td>`;
                continue;
            }

            const dayIso = calendarDateToIso(new Date(year, month, dayCounter));
            const dayEvents = events.filter(e => isDateInRange(dayIso, e.startDateIso, e.endDateIso || e.startDateIso));
            const pills = dayEvents.slice(0, 3).map(e => `
                <button class="calendar-lite-event" title="${escapeCalendarHtml(e.title)}" onclick="openCalendarRecord('${e.id}')">
                    ${escapeCalendarHtml(e.title)}
                </button>
            `).join("");
            const moreCount = dayEvents.length - 3;
            const moreHtml = moreCount > 0 ? `<div class="calendar-lite-more">+${moreCount} more</div>` : "";

            html += `
                <td class="calendar-lite-day">
                    <div class="calendar-lite-day-number">${dayCounter}</div>
                    <div class="calendar-lite-events">${pills}${moreHtml}</div>
                </td>
            `;
            dayCounter++;
        }
        html += "</tr>";
        if (dayCounter > daysInMonth) break;
    }

    html += `
            </tbody>
        </table>
    `;

    wrap.innerHTML = html;
}

function getCurrentMatterCalendarRows() {
    const source = Array.isArray(currentDataofCalendar) ? currentDataofCalendar : [];
    const matterRef = calendarTabState.matterRef;

    return source
        .filter(item => calendarMatchesMatter(item?.Matter_Number, matterRef))
        .map(normalizeCalendarRecord);
}

function calendarMatchesMatter(calendarMatter, selectedMatter) {
    const calendarMatterId = calendarGetMatterId(calendarMatter);
    const selectedMatterId = calendarGetMatterId(selectedMatter);
    if (calendarMatterId && selectedMatterId) {
        return calendarMatterId === selectedMatterId;
    }

    const calendarMatterName = calendarGetMatterDisplay(calendarMatter);
    const selectedMatterName = calendarGetMatterDisplay(selectedMatter);
    if (calendarMatterName && selectedMatterName) {
        return calendarMatterName === selectedMatterName;
    }
    return false;
}

function calendarGetMatterId(matterObj) {
    if (!matterObj) return "";
    if (typeof matterObj === "object") {
        return String(matterObj.ID || matterObj.id || "").trim();
    }
    return String(matterObj).trim();
}

function calendarGetMatterDisplay(matterObj) {
    if (!matterObj) return "";
    if (typeof matterObj === "object") {
        return String(matterObj.display_value || matterObj.name || "").trim().toLowerCase();
    }
    return String(matterObj).trim().toLowerCase();
}

function normalizeCalendarRecord(item) {
    const startDateRaw = item?.Start_Date || item?.Date || item?.Event_Start_Date || item?.End_Date || "";
    const endDateRaw = item?.End_Date || item?.Event_End_Date || item?.Start_Date || "";

    return {
        id: item?.ID || "",
        title: item?.Event || item?.Title || item?.Subject || item?.Name || "Calendar event",
        startDateIso: calendarParseToISODate(startDateRaw),
        endDateIso: calendarParseToISODate(endDateRaw)
    };
}

function shiftMonth(dateObj, delta) {
    return new Date(dateObj.getFullYear(), dateObj.getMonth() + delta, 1);
}

function calendarDateToIso(dateObj) {
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
    const dd = String(dateObj.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}

function eventIntersectsMonth(monthStartIso, monthEndIso) {
    return event => {
        const start = event.startDateIso;
        const end = event.endDateIso || event.startDateIso;
        if (!start) return false;
        return start <= monthEndIso && end >= monthStartIso;
    };
}

function isDateInRange(targetIso, startIso, endIso) {
    if (!targetIso || !startIso) return false;
    const end = endIso || startIso;
    return targetIso >= startIso && targetIso <= end;
}

function calendarParseToISODate(value) {
    if (!value) return "";

    const raw = String(value).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
        return raw;
    }

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(raw)) {
        const [mm, dd, yyyy] = raw.split("/");
        return `${yyyy}-${mm}-${dd}`;
    }

    const monthMap = {
        jan: "01",
        feb: "02",
        mar: "03",
        apr: "04",
        may: "05",
        jun: "06",
        jul: "07",
        aug: "08",
        sep: "09",
        oct: "10",
        nov: "11",
        dec: "12"
    };

    const match = raw.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{4})$/);
    if (match) {
        const dd = String(match[1]).padStart(2, "0");
        const mm = monthMap[String(match[2]).toLowerCase()] || "";
        const yyyy = match[3];
        return mm ? `${yyyy}-${mm}-${dd}` : "";
    }

    return "";
}

function escapeCalendarHtml(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function getCalendarReportUrl() {
    const envMatch = window.location.pathname.match(/\/environment\/([^/]+)\//);
    const env = envMatch ? envMatch[1] : WIDGET_CONFIG.ENV;
    const creatorBaseUrl = "https://creatorapp.zoho.com";
    const reportLinkName = WIDGET_CONFIG.CALENDAR;

    return `${creatorBaseUrl}/${WIDGET_CONFIG.OWNER}/environment/${env}/${WIDGET_CONFIG.APP}/#Report:${reportLinkName}`;
}

function openCalendarReportInNewWindow() {
    const reportUrl = getCalendarReportUrl();
    const popupWindow = window.open(reportUrl, "calendar_report_popup", "width=1400,height=900");

    if (popupWindow) {
        popupWindow.focus();
        return;
    }

    const navFn = ZOHO?.CREATOR?.UTIL?.navigateParentURL;
    if (typeof navFn === "function") {
        try {
            navFn({ url: reportUrl, windowName: "_parent" });
            return;
        } catch (e) {
            try {
                navFn(reportUrl);
                return;
            } catch (e2) {}
        }
    }
}

function openCalendarRecord(recordId) {
    console.log(`Open calendar record: ${recordId}`);
    openCalendarReportInNewWindow();
}
