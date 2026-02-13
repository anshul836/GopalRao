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
        // console.log(res);
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
    const formLinkName = "Contacts";
    const envMatch = window.location.pathname.match(/\/environment\/([^/]+)\//);
    const env = envMatch ? envMatch[1] : WIDGET_CONFIG.ENV;
    const creatorBaseUrl = "https://creatorapp.zoho.com";
    const formUrl = `${creatorBaseUrl}/${WIDGET_CONFIG.OWNER}/environment/${env}/${WIDGET_CONFIG.APP}/#Form:${formLinkName}`;

    const popupWindow = window.open(formUrl, "contacts_form_popup", "width=1200,height=900");

    if (popupWindow) {
        popupWindow.focus();
        return;
    }

    const navFn = ZOHO?.CREATOR?.UTIL?.navigateParentURL;

    if (typeof navFn === "function") {
        try {
            navFn({ url: formUrl, windowName: "_parent" });
            return;
        } catch (e) {
            try {
                navFn(formUrl);
                return;
            } catch (e2) {}
        }
    }

    console.log("Unable to open form");
}
