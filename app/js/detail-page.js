// Global variable to store current record data so tabs can access it
let currentRecordData = null; 

function fetchAtoZ(recId) {
    // 1. Switch Page View
    document.getElementById("listPage").style.display = "none";
    document.getElementById("detailPage").style.display = "block";

    // 2. Setup Basic Detail Shell
    const container = document.getElementById("detailContainer"); // Ensure this ID exists in HTML
    
    // Render the Tab Header
    container.innerHTML = `
        <div class="header-section" style="padding: 0 20px 20px;">
            <div style="margin-bottom: 10px;">
                <span class="back-btn" onclick="showListPage()">← Back to Matters</span>
            </div>
            <h2 id="matterHeaderTitle" style="margin:0;">Loading...</h2>
        </div>

        <div class="detail-tabs-container">
            <div class="tab-link active" onclick="switchTab('Dashboard', this)">Dashboard</div>
            <div class="tab-link" onclick="switchTab('Activities', this)">Activities</div>
            <div class="tab-link" onclick="switchTab('Calendar', this)">Calendar</div>
            <div class="tab-link" onclick="switchTab('Communications', this)">Communications</div>
            <div class="tab-link" onclick="switchTab('Documents', this)">Documents</div>
        </div>

        <div id="tabContentArea" style="padding: 20px;">
            <div style="text-align:center;">Loading data...</div>
        </div>
    `;

    // 3. Fetch Data Once
    ZOHO.CREATOR.API.getRecordById({
        appName: WIDGET_CONFIG.APP,
        reportName: WIDGET_CONFIG.REPORT,
        id: recId
    }).then(function(response) {
        currentRecordData = response.data; // Store globally
        
        // Update Title
        document.getElementById("matterHeaderTitle").innerText = 
            currentRecordData.Matter_Name || "Matter Details";

        // Load Default Tab (Dashboard)
        loadTab_Dashboard(); 
    });
}

// Function to handle switching
function switchTab(tabName, btnElement) {
    // 1. Update UI (Active Class)
    document.querySelectorAll(".tab-link").forEach(t => t.classList.remove("active"));
    if(btnElement) btnElement.classList.add("active");

    // 2. Clear Content
    const contentArea = document.getElementById("tabContentArea");
    contentArea.innerHTML = ""; 

    // 3. Load Specific Tab Logic
    if (tabName === "Dashboard") {
        loadTab_Dashboard();
    } else if (tabName === "Documents") {
        loadTab_Documents();
    } else if (tabName === "Activities") {
        loadTab_Activities();
    } else {
        // Generic Placeholder for others
        contentArea.innerHTML = `
            <div class="card-box" style="text-align:center; padding: 50px;">
                <h3>${tabName}</h3>
                <p style="color:#888;">This section is under construction.</p>
            </div>
        `;
    }
}