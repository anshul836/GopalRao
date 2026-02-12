// --- MAIN INITIALIZATION ---

ZOHO.CREATOR.init().then(() => {
    console.log("Zoho Creator Widget Initialized");
    
    // 1. Load your table
    loadData("All");

    // 2. TEST: Print full client data for one specific ID
    // This now runs safely because it's inside the .init() block
    // ZOHO.CREATOR.API.getRecordById({
    //     appName: WIDGET_CONFIG.APP,
    //     reportName: WIDGET_CONFIG.REPORT,
    //     id: "4907914000000029063"
    // })
    // .then(function(response) {
    //     console.log("SUCCESS! Full Client Data (15+ fields):", response.data);
    // })
    // .catch(function(error) {
    //     console.log("Error fetching specific record:", error);
    // });



// ZOHO.CREATOR.API.getAllRecords({
//         appName: WIDGET_CONFIG.APP,
//         reportName: "Contacts_Report",
//     }).then(res => {console.log(res)});


});