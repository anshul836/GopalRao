function loadTab_Communications() {
    const contentArea = document.getElementById("tabContentArea");
    
    contentArea.innerHTML = `
        <div class="card-box" style="height: 300px; display:flex; align-items:center; justify-content:center; flex-direction:column;">
            <i class="fa fa-envelope-o" style="font-size: 40px; color: #ddd; margin-bottom: 20px;"></i>
            <h3>Communications</h3>
            <p style="color:#888;">Email and call logs will appear here.</p>
        </div>
    `;
}