function loadTab_Calendar() {
    const contentArea = document.getElementById("tabContentArea");
    
    contentArea.innerHTML = `
        <div class="card-box" style="height: 300px; display:flex; align-items:center; justify-content:center; flex-direction:column;">
            <i class="fa fa-calendar" style="font-size: 40px; color: #ddd; margin-bottom: 20px;"></i>
            <h3>Calendar</h3>
            <p style="color:#888;">Calendar events for ${currentRecordData.Matter_Name || 'this matter'} will appear here.</p>
        </div>
    `;
}