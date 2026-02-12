// --- MAIN INITIALIZATION ---

ZOHO.CREATOR.init().then(() => {
    console.log("Zoho Creator Widget Initialized");
    
    // Load initial data (function from list-page.js)
    loadData("All");
});