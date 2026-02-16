let activitiesState = {
    type: "All",
    keyword: "",
    fromDate: "",
    toDate: "",
    rangePreset: "all",
    matterRef: null
};

function loadTab_Activities(matter_id) {
    activitiesState = {
        type: "All",
        keyword: "",
        fromDate: "",
        toDate: "",
        rangePreset: "all",
        matterRef: matter_id
    };

    const contentArea = document.getElementById("tabContentArea");

    contentArea.innerHTML = `
        <div class="activities-page animate-fade-in">
            <div class="activities-header">
                <h3 class="activities-title">Activities</h3>
                <div class="activities-header-actions">
                    <button class="btn-primary-compact" onclick="createActivityEntry('Time')">New time entry</button>
                    <button class="btn-primary-compact" onclick="createActivityEntry('Expense')">New expense</button>
                </div>
            </div>

            <div class="activities-table-wrap">
                <table class="activities-table">
                    <thead>
                        <tr>
                            <th style="width: 34px;"></th>
                            <th style="width: 110px;">Actions</th>
                            <th style="width: 90px;">Type</th>
                            <th style="width: 72px;">Qty</th>
                            <th>Description</th>
                            <th style="width: 130px;">Attachments</th>
                            <th style="width: 95px;">Rate ($)</th>
                            <th style="width: 130px;">Non-billable ($)</th>
                            <th style="width: 95px;">Billable ($)</th>
                            <th style="width: 110px;">Date</th>
                            <th style="width: 130px;">User</th>
                            <th style="width: 120px;">Invoice status</th>
                        </tr>
                    </thead>
                    <tbody id="activitiesTableBody"></tbody>
                </table>
            </div>
        </div>
    `;

    console.log(matter_id);
    console.log(currentDataofActivities)
    renderActivitiesTable();
}

function bindActivitiesEvents() {
    document.querySelectorAll("[data-activity-type]").forEach(btn => {
        btn.addEventListener("click", () => {
            activitiesState.type = btn.getAttribute("data-activity-type");
            document.querySelectorAll("[data-activity-type]").forEach(x => x.classList.remove("active"));
            btn.classList.add("active");
            renderActivitiesTable();
        });
    });

    document.getElementById("activityKeyword")?.addEventListener("input", event => {
        activitiesState.keyword = (event.target.value || "").trim().toLowerCase();
        renderActivitiesTable();
    });

    document.getElementById("activityFromDate")?.addEventListener("change", event => {
        activitiesState.fromDate = event.target.value || "";
        activitiesState.rangePreset = "all";
        const rangeEl = document.getElementById("activityDateRange");
        if (rangeEl) rangeEl.value = "all";
        renderActivitiesTable();
    });

    document.getElementById("activityToDate")?.addEventListener("change", event => {
        activitiesState.toDate = event.target.value || "";
        activitiesState.rangePreset = "all";
        const rangeEl = document.getElementById("activityDateRange");
        if (rangeEl) rangeEl.value = "all";
        renderActivitiesTable();
    });

    document.getElementById("activityDateRange")?.addEventListener("change", event => {
        activitiesState.rangePreset = event.target.value || "all";
        applyDatePreset();
        renderActivitiesTable();
    });
}

function applyDatePreset() {
    if (activitiesState.rangePreset === "all") {
        return;
    }

    const now = new Date();
    const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let startDate = null;

    if (activitiesState.rangePreset === "last_30") {
        startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - 30);
    } else if (activitiesState.rangePreset === "this_year") {
        startDate = new Date(endDate.getFullYear(), 0, 1);
    }

    activitiesState.fromDate = startDate ? formatDateForInput(startDate) : "";
    activitiesState.toDate = formatDateForInput(endDate);

    const fromEl = document.getElementById("activityFromDate");
    const toEl = document.getElementById("activityToDate");
    if (fromEl) fromEl.value = activitiesState.fromDate;
    if (toEl) toEl.value = activitiesState.toDate;
}

function renderActivitiesTable() {
    const tbody = document.getElementById("activitiesTableBody");
    if (!tbody) return;

    const activityRows = getCurrentMatterActivities();
    const filtered = activityRows;

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="12" class="activities-empty">
                    No activities found.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filtered.map(row => `
        <tr>
            <td><input type="checkbox" class="activities-checkbox" aria-label="Select activity ${row.id}"></td>
            <td>
                <button class="activities-edit-btn" onclick="editActivityEntry('${row.id}')">Edit</button>
            </td>
            <td>
                <span class="activities-type ${row.type === "Time" ? "is-time" : "is-expense"}">
                    ${row.type}
                </span>
            </td>
            <td>${formatQty(row.qty, row.type)}</td>
            <td title="${escapeActivityHtml(row.description)}">${escapeActivityHtml(row.description)}</td>
            <td>${escapeActivityHtml(row.attachments || "-")}</td>
            <td class="activities-money">${formatMoney(row.rate)}</td>
            <td class="activities-money">${formatMoney(row.nonBillable)}</td>
            <td class="activities-money">${formatMoney(row.billable)}</td>
            <td>${formatDateUS(row.dateIso || row.dateRaw)}</td>
            <td><span class="activities-user-link">${escapeActivityHtml(row.user)}</span></td>
            <td>${escapeActivityHtml(row.invoiceStatus || "-")}</td>
        </tr>
    `).join("");
}

function createActivityEntry(type) {
    console.log(`Create ${type} entry clicked`);
}

function editActivityEntry(activityId) {
    console.log(`Edit activity clicked: ${activityId}`);
}

function formatQty(value, type) {
    const num = parseNumber(value);
    if (num == null) {
        return escapeActivityHtml(String(value || "-"));
    }
    if (type === "Time") {
        return `${num.toFixed(2)}h`;
    }
    return `${num.toFixed(2)}`;
}

function formatMoney(value) {
    const num = parseNumber(value);
    return num == null ? "-" : num.toFixed(2);
}

function formatDateUS(isoDate) {
    const dateToFormat = parseToISODate(isoDate);
    const parts = String(dateToFormat || "").split("-");
    if (parts.length !== 3) return "-";
    return `${parts[1]}/${parts[2]}/${parts[0]}`;
}

function formatDateForInput(dateObj) {
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
    const dd = String(dateObj.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}

function escapeActivityHtml(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function getCurrentMatterActivities() {
    const source = Array.isArray(currentDataofActivities) ? currentDataofActivities : [];
    const matterRef = activitiesState.matterRef;
    return source
        .filter(activity => matchesMatter(activity?.Matter_Number.display_value, matterRef))
        .map(normalizeActivityRecord);
}

function matchesMatter(activityMatter, selectedMatter) {
    const activityMatterId = getMatterId(activityMatter);
    const selectedMatterId = getMatterId(selectedMatter);
    if (activityMatterId && selectedMatterId) {
        return activityMatterId === selectedMatterId;
    }

    const activityMatterName = getMatterDisplay(activityMatter);
    const selectedMatterName = getMatterDisplay(selectedMatter);
    if (activityMatterName && selectedMatterName) {
        return activityMatterName === selectedMatterName;
    }

    return false;
}

function getMatterId(matterObj) {
    if (!matterObj) return "";
    if (typeof matterObj === "object") {
        return String(matterObj.ID || matterObj.id || "").trim();
    }
    return String(matterObj).trim();
}

function getMatterDisplay(matterObj) {
    if (!matterObj) return "";
    if (typeof matterObj === "object") {
        return String(matterObj.display_value || matterObj.name || "").trim().toLowerCase();
    }
    return String(matterObj).trim().toLowerCase();
}

function normalizeActivityRecord(activity) {
    const dateRaw = activity?.End_Date || activity?.Date || activity?.Activity_Date || "";
    const parsedDate = parseToISODate(dateRaw);
    const activityType = inferActivityType(activity);

    return {
        id: activity?.ID || "",
        type: activityType,
        qty: activity?.Qty ?? activity?.Quantity ?? activity?.Duration ?? "-",
        description: activity?.Description || "-",
        attachments: activity?.Attachments?.display_value || activity?.Attachments || "-",
        rate: activity?.Rate ?? activity?.Hourly_Rate ?? 0,
        nonBillable: activity?.Non_billable ?? activity?.Non_Billable ?? activity?.Non_Billable_Amount ?? 0,
        billable: activity?.Billable_Amount ?? activity?.Billable ?? 0,
        dateIso: parsedDate,
        dateRaw: dateRaw,
        user: activity?.User?.display_value || activity?.Created_By?.display_value || "-",
        invoiceStatus: activity?.Invoice_status || activity?.Invoice_Status || "-"
    };
}

function inferActivityType(activity) {
    const explicitType = String(activity?.Type || "").trim().toLowerCase();
    if (explicitType === "time" || explicitType === "expense") {
        return explicitType === "time" ? "Time" : "Expense";
    }

    const category = String(activity?.Activity_Category || "").toLowerCase();
    if (category.includes("expense")) {
        return "Expense";
    }

    if (activity?.Duration !== undefined && activity?.Duration !== null && activity?.Duration !== "") {
        return "Time";
    }

    return "Expense";
}

function parseNumber(value) {
    if (value === null || value === undefined || value === "") return null;
    if (Array.isArray(value)) {
        return parseNumber(value[0]);
    }
    if (typeof value === "number") {
        return Number.isFinite(value) ? value : null;
    }

    const cleaned = String(value).replace(/,/g, "").trim();
    if (!cleaned) return null;
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : null;
}

function parseToISODate(value) {
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
