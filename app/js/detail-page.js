// Global variables to store data
let currentRecordData = null;
let currentDataofNotes = null; // Corrected spelling from 'currnet'
let currentDataofActivities =null;
let currentDataofCalendar = null;
let userID;

/* --------------------------------------------------
   BACK TO LIST FUNCTION
-------------------------------------------------- */
function showListPage() {
    const listPage = document.getElementById("listPage");
    const detailPage = document.getElementById("detailPage");
    if (detailPage) detailPage.style.display = "none";
    if (listPage) listPage.style.display = "block";
}

/* --------------------------------------------------
   FETCH RECORD & LOAD DETAIL PAGE
-------------------------------------------------- */
function fetchAtoZ(recId) {
    userID=recId;

    // 1. Switch Page View
    document.getElementById("listPage").style.display = "none";
    document.getElementById("detailPage").style.display = "block";

    // 2. Setup Basic Detail Shell
    const container = document.getElementById("detailContainer");
    container.innerHTML = `
        <div class="header-section" style="padding: 0 20px 20px;">
            <div style="margin-bottom: 10px;">
                <span class="back-btn" id="backButton">← Back to Matters</span>
            </div>
            <h2 id="matterHeaderTitle" style="margin:0;">Loading...</h2>
        </div>

        <div class="detail-tabs-container">
            <div class="tab-link active" data-tab="Dashboard">Dashboard</div>
            <div class="tab-link" data-tab="Custom Fields">Custom Fields</div>
            <div class="tab-link" data-tab="Activities">Activities</div>
            <div class="tab-link" data-tab="Calendar">Calendar</div>
            <div class="tab-link" data-tab="Communications">Communications</div>
            <div class="tab-link" data-tab="Notes">Notes</div>
            <div class="tab-link" data-tab="Documents">Documents</div>
            <div class="tab-link" data-tab="Tasks">Tasks</div>
            <div class="tab-link" data-tab="Bills">Bills</div>
            <div class="tab-link" data-tab="Transactions">Transactions</div>
            <div class="tab-link" data-tab="Clio for Co-Counsel">Clio for Co-Counsel</div>
            <div class="tab-link" data-tab="InfoTrack: File and Serve">InfoTrack: File and Serve</div>
            <div class="tab-link" data-tab="Legalboards">Legalboards</div>
        </div>

        <div id="tabContentArea" style="padding: 20px;">
            <div style="text-align:center;">Loading data...</div>
        </div>
    `;

    document.getElementById("backButton").addEventListener("click", showListPage);

    document.querySelectorAll(".tab-link").forEach(tab => {
        tab.addEventListener("click", function () {
            const tabName = this.getAttribute("data-tab");
            switchTab(tabName, this);
        });
    });

    /* --------------------------------------------------
       API CALL 1: Fetch Matter Details
    -------------------------------------------------- */
    ZOHO.CREATOR.API.getRecordById({
        appName: WIDGET_CONFIG.APP,
        reportName: WIDGET_CONFIG.REPORT,
        id: recId
    }).then(function (response) {
        currentRecordData = response.data;

        // Update Header Title
        document.getElementById("matterHeaderTitle").innerText =
            currentRecordData.Matter_Name || "Matter Details";

        // Load Default Tab
        loadTab_Dashboard();
        });

        /* --------------------------------------------------
           API CALL 2: Fetch Notes Data (Nested)
        -------------------------------------------------- */

        ZOHO.CREATOR.API.getAllRecords({
            appName: WIDGET_CONFIG.APP,
            reportName: WIDGET_CONFIG.NOTES
        }).then(function (noteResponse) {
            currentDataofNotes=null
            currentDataofNotes = noteResponse.data;
            
            

                // If the user is already looking at the Notes tab when this finishes, refresh it
                const activeTab = document.querySelector(".tab-link.active").getAttribute("data-tab");
                if (activeTab === "Notes") {
                    loadTab_Notes(userID);
                }
        
        }).catch(function (error) {
            currentDataofNotes = []; // Set empty if call fails
        });

        /* --------------------------------------------------
       API CALL 3: Fetch Matter Details
    -------------------------------------------------- */
    ZOHO.CREATOR.API.getAllRecords({
        appName: WIDGET_CONFIG.APP,
        reportName: WIDGET_CONFIG.Activities,

    }).then(function (response) {
         currentDataofActivities = response.data || [];

         const activeTab = document.querySelector(".tab-link.active")?.getAttribute("data-tab");
         if (activeTab === "Activities" && currentRecordData?.Matter_Number) {
            loadTab_Activities(currentRecordData.Matter_Number);
         }
    }).catch(function () {
         currentDataofActivities = [];
    });

    /* --------------------------------------------------
       API CALL 4: Fetch Calendar Report Data
    -------------------------------------------------- */
    ZOHO.CREATOR.API.getAllRecords({
        appName: WIDGET_CONFIG.APP,
        reportName: WIDGET_CONFIG.CALENDAR,
    }).then(function (response) {
         currentDataofCalendar = response.data || [];

         const activeTab = document.querySelector(".tab-link.active")?.getAttribute("data-tab");
         if (activeTab === "Calendar" && currentRecordData?.Matter_Number) {
            loadTab_Calendar(currentRecordData.Matter_Number);
         }
    }).catch(function () {
         currentDataofCalendar = [];
    });

    
}

/* --------------------------------------------------
   TAB SWITCHING
-------------------------------------------------- */
function switchTab(tabName, btnElement) {
    document.querySelectorAll(".tab-link").forEach(t => t.classList.remove("active"));
    if (btnElement) btnElement.classList.add("active");

    const contentArea = document.getElementById("tabContentArea");
    contentArea.innerHTML = "";

    if (tabName === "Dashboard") {
        loadTab_Dashboard();
    } else if (tabName === "Activities") {
        loadTab_Activities(currentRecordData.Matter_Number);
    } else if (tabName === "Calendar") {
        loadTab_Calendar(currentRecordData.Matter_Number);
    } else if (tabName === "Notes") {
        loadTab_Notes(userID);
    } else {
        contentArea.innerHTML = `
            <div class="card-box" style="text-align:center; padding: 50px;">
                <h3>${tabName}</h3>
                <p style="color:#888;">This section is under construction.</p>
            </div>
        `;
    }
}
