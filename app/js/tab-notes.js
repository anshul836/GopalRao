function loadTab_Notes(recId) {



let filteredNotes = [];
for (let i = 0; i < currentDataofNotes.length; i++) {

    let note = currentDataofNotes[i];
    

// console.log(note.Auther);
console.log(`notes auth ${note.Auther.ID} current click contact ${currentRecordData.Contacts.ID}`);
    if (note.Auther.ID!=undefined  && String(note.Auther.ID) === String(currentRecordData.Contacts.ID)) {
        console.log("yes")
        filteredNotes.push(note);
    }
}
// console.log(filteredNotes)
 currentDataofNotes= filteredNotes;
//  console.log(currentDataofNotes)

  

    const contentArea = document.getElementById("tabContentArea");

   

    // 1. Check if data exists
    if (!currentDataofNotes) {
        contentArea.innerHTML = `<div style="text-align:center; padding:50px; color:#666;">
            <i class="fa fa-spinner fa-spin"></i> Fetching notes...
        </div>`;
        return;
    }

    // 2. Build the table rows dynamically
    let tableRows = "";
    
    // Zoho returns data inside an array
    const notesArray = Array.isArray(currentDataofNotes) ? currentDataofNotes : [currentDataofNotes];

    // Check if the array is empty or contains an empty object
    if (notesArray.length === 0 || !notesArray[0].ID) {
        tableRows = `<tr><td colspan="6" style="text-align:center; padding:60px; color:#999;">
            <i class="fa fa-folder-open-o" style="font-size:24px; display:block; margin-bottom:10px;"></i>
            No notes found for this matter.
        </td></tr>`;
    } else {
        notesArray.forEach(note => {
            // Mapping to your specific JSON keys
            const author = note.Auther.display_value || "—"; // Using 'Auther' as per your JSON
            const date = note.Date_field || "—";
            const time = note.Recorded_Time || "—";
            const subject = note.Subject_field || "No Subject";
            const content = note.Notes || "No content available";

            tableRows += `
                <tr class="animate-row">
                    <td>
                        <div class="action-pill">
                            <span>Edit</span>
                            <i class="fa fa-caret-down"></i>
                        </div>
                    </td>
                    <td><span class="time-stamp">${time}</span></td>
                    <td>${date}</td>
                    <td><span class="subject-link">${subject}</span></td>
                    <td>
                        <div class="note-text-truncate">
                            ${content}
                        </div>
                    </td>
                    <td class="author-name">${author}</td>
                </tr>
            `;
        });
    }

    // 3. Render the full UI
    contentArea.innerHTML = `
        <div class="notes-container animate-fade-in">
            <div class="notes-header-inline">
                <div class="header-brand">
                    <h2 class="page-title">Notes</h2>
                    <span class="page-divider"></span>
                    <p class="page-subtitle">Matter documentation logs</p>
                </div>
                <div class="header-controls">
                    <div class="search-wrapper-inline">
                        <i class="fa fa-search"></i>
                        <input type="text" id="noteSearchInput" placeholder="Search notes..." class="modern-input-small">
                    </div>
                    <button class="btn-primary-compact" onclick="openNewNoteForm()">New note</button>
                </div>
            </div>

            <div class="table-wrapper">
                <table class="modern-table">
                    <thead>
                        <tr>
                            <th style="width: 90px;">Actions</th>
                            <th>Recorded time</th>
                            <th>Date</th>
                            <th>Subject</th>
                            <th style="width: 45%">Note</th>
                            <th>Author</th>
                        </tr>
                    </thead>
                    <tbody id="notesTableBody">
                        ${tableRows}
                    </tbody>
                </table>
            </div>
        </div>
    `;

    // Attach search listener after rendering
    document.getElementById("noteSearchInput")?.addEventListener("input", filterNotesTable);
}