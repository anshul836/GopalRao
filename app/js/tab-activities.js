function loadTab_Activities() {
    const contentArea = document.getElementById("tabContentArea");
    
    contentArea.innerHTML = `
        <div class="card-box" style="height: 300px; display:flex; align-items:center; justify-content:center; flex-direction:column;">
            <i class="fa fa-list-ul" style="font-size: 40px; color: #ddd; margin-bottom: 20px;"></i>
            <h3>Activities</h3>
            <p style="color:#888;">Activity logs will appear here.</p>
        </div>
    `;
}