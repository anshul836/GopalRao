// --- DETAIL PAGE FUNCTIONS ---

function fetchAtoZ(recId) {
    console.log("detailpage");
    // 1. Switch View
    document.getElementById("listPage").style.display = "none";
    document.getElementById("detailPage").style.display = "block";
    document.getElementById("fullDetailsContent").innerHTML = "Loading all fields...";
    document.getElementById("detTitle").innerText = "Loading...";

    // 2. Fetch Specific Record
    ZOHO.CREATOR.API.getRecordById({
        appName: WIDGET_CONFIG.APP,
        reportName: WIDGET_CONFIG.REPORT,
        id: recId
    }).then(res => {
        let d = res.data;
        
        // Update Title
        document.getElementById("detTitle").innerText = d.Matter_Name || "Matter Details";
        
        let detailHtml = "";
        
        // 3. Loop through all keys in the response
        for (let key in d) {
            // Filter out system fields or raw data
            if (key !== "ID" && key !== "raw_data") {
                let val = d[key];
                
                // Handle Lookups (Objects) vs Strings
                let displayVal = (typeof val === 'object' && val !== null) 
                                 ? (val.display_value || JSON.stringify(val)) 
                                 : (val || "-");
                
                // Format Label (replace underscores with space)
                let label = key.replace(/_/g, ' '); 

                detailHtml += `
                    <div class="detail-item">
                        <div class="detail-label">${label}</div>
                        <div class="detail-value">${displayVal}</div>
                    </div>`;
            }
        }
        document.getElementById("fullDetailsContent").innerHTML = detailHtml;
    });
}

function showListPage() {
    document.getElementById("detailPage").style.display = "none";
    document.getElementById("listPage").style.display = "block";
}