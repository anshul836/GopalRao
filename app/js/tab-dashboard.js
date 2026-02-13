function loadTab_Dashboard() {
    const r = currentRecordData; // Access the global data
    const contentArea = document.getElementById("tabContentArea");


    // --- HELPER FOR ROWS ---
    const row = (label, value) => `
        <div class="detail-row">
            <div class="detail-label">${label}</div>
            <div class="detail-value">${value || '&mdash;'}</div>
        </div>`;

    // --- RENDER HTML ---
    contentArea.innerHTML = `
        <div class="dashboard-grid">
            <div class="card-box">
                <div class="card-title">Work in progress <i class="fa fa-question-circle" style="color:#2196F3"></i></div>
                <div class="card-amount">$0.00</div>
                <div class="card-subtitle">Unbilled $0.00</div>
            </div>
            <div class="card-box">
                <div class="card-title">Outstanding balance</div>
                <div class="card-amount">$0.00</div>
                <div style="margin-top:10px;"><button class="btn-small">View bills</button></div>
            </div>
            <div class="card-box">
                <div class="card-title">Matter trust funds</div>
                <div class="card-amount">$0.00</div>
                <div style="margin-top:10px;"><button class="btn-small">New request</button></div>
            </div>
            
            <div class="card-box full-width-card">
                <div style="display:flex; justify-content:space-between;">
                    <div class="card-title">Time</div>
                    <button class="btn-small">Add time</button>
                </div>
                <div class="progress-container">
                    <div class="progress-bar" style="width: 30%;"></div>
                </div>
                <div style="font-size:12px; color:#666;">
                    <span style="color:#2196F3">●</span> Billable $0.00 
                    <span style="margin-left:15px; color:#ccc;">●</span> Non-billable $0.00
                </div>
            </div>
        </div>

        <div class="split-layout">
            
            <div class="card-box split-left">
                <div class="card-title" style="border-bottom:1px solid #eee; padding-bottom:10px; margin-bottom:10px;">Details</div>
                
                ${row("Matter description", r.Matter_description)}

${row(
        "Responsible attorney",
        r.Responsible_Attorney?.display_value
            ? `<a href="#" class="text-link">${r.Responsible_Attorney.display_value.trim()}</a>`
            : "—"
    )}

${row("Responsible staff", r.Responsible_staff || "—")}

${row("Permissions", r.Permissions || "—")}

${row(
        "Blocked users",
        r.Blocked_users?.display_value || "—"
    )}

${row(
        "Originating attorney",
        r.Originating_Attorney?.display_value
            ? `<a href="#" class="text-link">${r.Originating_Attorney.display_value.trim()}</a>`
            : "—"
    )}

${row(
        "Matter notifications",
        r.Matter_notifications || "—"
    )}

${row("Practice area", r.Practice_Area || "—")}

${row("Client reference number", r.Client_reference_number || "—")}

${row(
        "Location",
        r.Location?.display_value || "—"
    )}

${row(
        "Status",
        `<select class="status-select">
      <option ${r.Status === "Open" ? "selected" : ""}>Open</option>
      <option ${r.Status === "Pending" ? "selected" : ""}>Pending</option>
      <option ${r.Status === "Closed" ? "selected" : ""}>Closed</option>
   </select>`
    )}

${row("Open date", r.Open_Date || "—")}
${row("Pending date", r.Pending_date || "—")}
${row("Closed date", r.Closed_date || "—")}
${row("Limitations date", r.Limitations_date || "—")}

${row("Billable", r.Billable || "—")}

${row(
        "Maildrop address",
        r.Maildrop_address?.display_value || "—"
    )}


            </div>
            <div class="split-right">
                <div class="card-box" style="margin-bottom:20px;">
                    <div class="card-title">Conflict Checks</div>
                    <div style="text-align:center; padding:20px; color:#999; font-size:13px;">
                        No conflict checks associated with this matter.
                    </div>
                </div>

                <div class="card-box">
                    <div class="card-title">Custom fields</div>
                    ${row("Referral Source", r.Referral_Source)}
                    ${row("Docket Number", r.Docket_Number)}
                </div>
            </div>
        </div>
    `;
}