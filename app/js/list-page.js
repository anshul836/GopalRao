// --- LIST PAGE FUNCTIONS ---

function loadData(status, btn) {
    // 1. Handle Tab Styling
    if(btn) {
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
    }

    // 2. Show Loading State
    let tbody = document.getElementById("tableBody");
    tbody.innerHTML = "<tr><td colspan='5' align='center'>Fetching data...</td></tr>";

    // 3. Build Criteria
    let criteria = (status !== "All") ? `Status == "${status}"` : "";

    // 4. Fetch from Zoho
    ZOHO.CREATOR.API.getAllRecords({
        appName: WIDGET_CONFIG.APP,
        reportName: WIDGET_CONFIG.REPORT,
        criteria: criteria
    }).then(res => {
        let html = "";
        if(res.data && res.data.length > 0) {
            res.data.forEach(r => {
                // Note: We call fetchAtoZ(ID) here, which is in detail-page.js
                html += `<tr>
                    <td class="clickable-link" onclick="fetchAtoZ('${r.ID}')">${r.Matter_Name || '-'}</td>
                    <td>${r.Matter_Number || '-'}</td>
                    <td><span class="status-pill">${r.Status || '-'}</span></td>
                    <td>${r.Open_Date || '-'}</td>
                    <td>${r.Practice_Area || '-'}</td>
                </tr>`;
            });
        } else {
            html = "<tr><td colspan='5' align='center'>No records found.</td></tr>";
        }
        tbody.innerHTML = html;
    }).catch(err => {
        console.error("Error:", err);
        tbody.innerHTML = "<tr><td colspan='5' align='center' style='color:red;'>Error loading data.</td></tr>";
    });
}

function doSearch() {
    let v = document.getElementById("srch").value.toLowerCase();
    document.querySelectorAll("#tableBody tr").forEach(r => {
        r.style.display = r.innerText.toLowerCase().includes(v) ? "" : "none";
    });
}

function openFullMatterForm() {
    // Uses config variables
    var finalUrl = "/" + WIDGET_CONFIG.OWNER + "/environment/" + WIDGET_CONFIG.ENV + "/" + WIDGET_CONFIG.APP + "/#Matter"; 
    ZOHO.CREATOR.UTIL.navigateParentURL({
        url: finalUrl,
        windowName: "_parent"
    });
}