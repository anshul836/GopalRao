function loadTab_Notes(recId) {
    const NOTE_PREVIEW_WORD_LIMIT = 28;
    let filteredNotes = [];
    for (let i = 0; i < currentDataofNotes.length; i++) {
        let note = currentDataofNotes[i];

        console.log(`notes auth ${note.Auther.ID} current click contact ${currentRecordData.Contacts.ID}`);
        if (note.Auther.ID != undefined && String(note.Auther.ID) === String(currentRecordData.Contacts.ID)) {
            console.log("yes");
            filteredNotes.push(note);
        }
    }

    currentDataofNotes = filteredNotes;

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
            const author = note.Auther.display_value || "-"; // Using 'Auther' as per your JSON
            const date = note.Date_field || "-";
            const time = note.Recorded_Time;
            const timeCell = time
                ? `<span class="time-stamp">${time}</span>`
                : `<button class="btn-primary-compact" onclick="addRecordedTime('${note.ID}')">Add time</button>`;
            const subject = note.Subject_field || "No Subject";
            const content = note.Notes || "No content available";
            const previewData = getNotePreview(content, NOTE_PREVIEW_WORD_LIMIT);
            const noteCell = previewData.hasMore
                ? `<div class="note-text-truncate">${escapeHtml(previewData.preview)} <button class="note-more-btn" onclick="openNotePopup('${note.ID}')">(more)</button></div>`
                : `<div class="note-text-truncate">${escapeHtml(previewData.preview)}</div>`;
            const searchableText = escapeHtml(`${subject} ${content} ${author} ${date} ${time || ""}`).toLowerCase();

            tableRows += `
                <tr class="animate-row" data-search="${searchableText}">
                    <td>
                        <div class="action-pill" onclick="openEditNoteForm('${note.ID}')">
                            <span>Edit</span>
                            <i class="fa fa-caret-down"></i>
                        </div>
                    </td>
                    <td>${timeCell}</td>
                    <td>${date}</td>
                    <td><span class="subject-link">${subject}</span></td>
                    <td>
                        ${noteCell}
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

function filterNotesTable() {
    const inputEl = document.getElementById("noteSearchInput");
    const query = (inputEl?.value || "").trim().toLowerCase();
    const rows = document.querySelectorAll("#notesTableBody tr");

    rows.forEach(row => {
        const searchBlob = (row.getAttribute("data-search") || row.innerText || "").toLowerCase();
        row.style.display = searchBlob.includes(query) ? "" : "none";
    });
}

function addRecordedTime(noteId) {
    console.log(`Add time clicked for note ${noteId}`);
}

function openNewNoteForm() {
    const formLinkName = "Notes";
    const envMatch = window.location.pathname.match(/\/environment\/([^/]+)\//);
    const env = envMatch ? envMatch[1] : WIDGET_CONFIG.ENV;
    const creatorBaseUrl = "https://creatorapp.zoho.com";
    const formUrl = `${creatorBaseUrl}/${WIDGET_CONFIG.OWNER}/environment/${env}/${WIDGET_CONFIG.APP}/#Form:${formLinkName}`;

    const popupWindow = window.open(formUrl, "new_note_form_popup", "width=1200,height=900");

    if (popupWindow) {
        popupWindow.focus();
        return;
    }

    const navFn = ZOHO?.CREATOR?.UTIL?.navigateParentURL;

    if (typeof navFn === "function") {
        try {
            navFn({ url: formUrl, windowName: "_parent" });
            return;
        } catch (e) {
            try {
                navFn(formUrl);
                return;
            } catch (e2) {}
        }
    }

    console.log("Unable to open note form");
}

function openEditNoteForm(noteId) {
    const formLinkName = "Notes";
    const reportLinkName = WIDGET_CONFIG.NOTES;
    const envMatch = window.location.pathname.match(/\/environment\/([^/]+)\//);
    const env = envMatch ? envMatch[1] : WIDGET_CONFIG.ENV;
    const creatorBaseUrl = "https://creatorapp.zoho.com";
    const formUrl = `${creatorBaseUrl}/${WIDGET_CONFIG.OWNER}/environment/${env}/${WIDGET_CONFIG.APP}/#Form:${formLinkName}?recLinkID=${encodeURIComponent(noteId)}&viewLinkName=${encodeURIComponent(reportLinkName)}`;

    const popupWindow = window.open(formUrl, `edit_note_${noteId}`, "width=1200,height=900");

    if (popupWindow) {
        popupWindow.focus();
        return;
    }

    const navFn = ZOHO?.CREATOR?.UTIL?.navigateParentURL;

    if (typeof navFn === "function") {
        try {
            navFn({ url: formUrl, windowName: "_parent" });
            return;
        } catch (e) {
            try {
                navFn(formUrl);
                return;
            } catch (e2) {}
        }
    }

    console.log(`Unable to open edit form for note ${noteId}`);
}

function getNotePreview(noteContent, wordLimit) {
    const safeText = (noteContent || "").replace(/\s+/g, " ").trim();
    if (!safeText) {
        return { preview: "No content available", hasMore: false };
    }

    const words = safeText.split(" ");
    if (words.length <= wordLimit) {
        return { preview: safeText, hasMore: false };
    }

    return {
        preview: `${words.slice(0, wordLimit).join(" ")}...`,
        hasMore: true
    };
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function openNotePopup(noteId) {
    const notesArray = Array.isArray(currentDataofNotes) ? currentDataofNotes : [];
    const note = notesArray.find(item => String(item.ID) === String(noteId));

    if (!note) {
        console.log(`Note not found for ID ${noteId}`);
        return;
    }

    const subject = escapeHtml(note.Subject_field || "Note Details");
    const author = escapeHtml(note.Auther?.display_value || "-");
    const date = escapeHtml(note.Date_field || "-");
    const time = escapeHtml(note.Recorded_Time || "-");
    const content = escapeHtml(note.Notes || "No content available").replace(/\n/g, "<br>");
    const popupCssUrl = new URL("css/style.css", window.location.href).href;

    const popup = window.open("", "note_detail_popup", "width=920,height=760,resizable=yes,scrollbars=yes");

    if (!popup) {
        console.log("Unable to open note popup window");
        return;
    }

    popup.document.open();
    popup.document.write(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${subject}</title>
    <link rel="stylesheet" href="${popupCssUrl}">
</head>
<body class="note-popup-body">
    <div class="note-popup-shell">
        <div class="note-popup-topbar">
            <button class="note-popup-back-btn" onclick="window.close()">Back</button>
            <h1 class="note-popup-title">${subject}</h1>
            <div></div>
        </div>
        <div class="note-popup-meta">
            <div class="note-popup-meta-card">
                <div class="note-popup-meta-label">Author</div>
                <div class="note-popup-meta-value">${author}</div>
            </div>
            <div class="note-popup-meta-card">
                <div class="note-popup-meta-label">Date</div>
                <div class="note-popup-meta-value">${date}</div>
            </div>
            <div class="note-popup-meta-card">
                <div class="note-popup-meta-label">Recorded Time</div>
                <div class="note-popup-meta-value">${time}</div>
            </div>
        </div>
        <div class="note-popup-content">
            <div class="note-popup-note-body">${content}</div>
        </div>
    </div>
</body>
</html>`);
    popup.document.close();
    popup.focus();
}
