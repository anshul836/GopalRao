function loadTab_Documents() {
    const contentArea = document.getElementById("tabContentArea");
    
    contentArea.innerHTML = `
        <div class="card-box" style="height: 300px; display:flex; align-items:center; justify-content:center; flex-direction:column;">
            <i class="fa fa-file-text-o" style="font-size: 40px; color: #ddd; margin-bottom: 20px;"></i>
            <h3>Documents</h3>
            <p style="color:#888;">Document list for ${currentRecordData.Matter_Name} will appear here.</p>
        </div>
    `;
}