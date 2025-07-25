/* 
    src: https://developer.chrome.com/docs/extensions/develop/ui/options-page?hl=d
*/

const sidebarProfileList = document.getElementById('sidebar-profile-list');
let draggedProfile = null;

function initDragHandles() {
    const handles = sidebarProfileList.querySelectorAll('.drag-handle');
    handles.forEach(handle => {
        handle.addEventListener('dragstart', (e) => {
            draggedProfile = handle.closest('li');
            draggedProfile.classList.add('dragging');
        });

        handle.addEventListener('dragend', () => {
            if (draggedProfile) {
                draggedProfile.classList.remove('dragging');
                draggedProfile = null;
                saveOptions();
            }
        });
    });

    const profiles = sidebarProfileList.querySelectorAll('li');
    profiles.forEach(profile => {
        profile.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (!draggedProfile || profile === draggedProfile) return;
            const rect = profile.getBoundingClientRect();
            const offset = e.clientY - rect.top;
            if (offset > rect.height / 2) {
                profile.after(draggedProfile);
            } else {
                profile.before(draggedProfile);
            }
        });
    });
}

function attachDeleteEvents() {
    const deleteButtons = sidebarProfileList.querySelectorAll('.delete-btn');
    deleteButtons.forEach(btn => {
        btn.onclick = () => {
            btn.closest('li').remove();
            saveOptions();
        };
    });
}



// Saves options to chrome.storage.sync
const saveOptions = () => {
    // sidebar options
    var sidebarEnabled = document.getElementById("sidebar-toggle").checked;

    let profileElements = sidebarProfileList.getElementsByClassName("sidebar-profile");
    var profiles = [];
    for (let i = 0; i < profileElements.length; i++) {
        if (profileElements[i].value != "" && profileElements[i].value != "BungieName#ID") {
            profiles.push(profileElements[i].value);
        }
    }

    // runs together options
    var enableRunsTogether = document.getElementById("runs-together-enable").checked;
    var ownProfile = document.getElementById("own-bungie-id").value;

    // raid.report layout options
    var removeKDA = document.getElementById("remove-kda").checked;
    var dynamic = document.getElementById("layout-dynamic").checked;
    var minimal = document.getElementById("layout-minimal").checked;
    var compact = document.getElementById("layout-compact").checked;
    var modern = document.getElementById("layout-modern").checked;

    // fireteam search layout options
    var fireteamGrid = document.getElementById("fireteam-grid").checked;
    var fireteamReports = document.getElementById("fireteam-report-buttons").checked;

    // misc
    var debug = document.getElementById("debug").checked;


    // saving
    chrome.storage.sync.set({
        migrated: true, sidebarEnabled: sidebarEnabled, sidebarProfiles: profiles,
        enableRunsTogether: enableRunsTogether, ownProfileID: ownProfile,
        removeKDA: removeKDA, dynamicLayout: dynamic, minimalLayout: minimal, compactLayout: compact, modernLayout: modern,
        fireteamSearchGrid: fireteamGrid, fireteamProfileReports: fireteamReports, debugEnabled: debug
    }).then(() => {
        console.debug("Saved Options!");
    });

};

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.sync, if not yet migrated from chrome.storage.local, load local settings
const restoreOptions = () => {
    chrome.storage.sync.get({
        migrated: false, sidebarEnabled: false, sidebarProfiles: [],
        enableRunsTogether: false, ownProfileID: "BungieName#ID",
        removeKDA: false, dynamicLayout: false, minimalLayout: false, compactLayout: false, modernLayout: false,
        fireteamSearchGrid: false, fireteamProfileReports: false, debugEnabled: false
    }).then((result) => {
        if (result.migrated == false) {
            let sync_storage_warning = document.createElement("div");
            sync_storage_warning.textContent = "Your saved settings have not been migrated to sync storage. Please save your options once to enable syncing across multiple devices.";
            sync_storage_warning.style.color = "red";
            sync_storage_warning.style.fontWeight = "bold";
            document.body.insertBefore(sync_storage_warning, document.body.firstChild);

            return chrome.storage.local.get({
                sidebarEnabled: false, sidebarProfiles: [],
                enableRunsTogether: false, ownProfileID: "Bungie#ID",
                removeKDA: false, dynamicLayout: false, minimalLayout: false, compactLayout: false, modernLayout: false,
                fireteamSearchGrid: false, fireteamProfileReports: false
            })
        } else {
            return result
        }
    }).then((result) => {
        // sidebar options
        document.getElementById("sidebar-toggle").checked = result.sidebarEnabled;

        let sidebarProfiles = result.sidebarProfiles;
        for (let i = 0; i < sidebarProfiles.length; i++) {
            const newItem = document.createElement('li');
            newItem.innerHTML = `
                    <div class="content"><input type="text" class="sidebar-profile" value="`+ sidebarProfiles[i] + `"></div>
                    <span class="drag-handle" draggable="true">⠿</span>
                    <button class="delete-btn">×</button>
                `;
            sidebarProfileList.insertBefore(newItem, document.getElementById("add-btn"));
        }
        initDragHandles();
        attachDeleteEvents();

        // runs together options
        document.getElementById("runs-together-enable").checked = result.enableRunsTogether;
        document.getElementById("own-bungie-id").value = result.ownProfileID;
        chrome.storage.local.get({
            rrStoredActivities: null, drStoredActivities: null
        }).then((result) => {
            if (result.rrStoredActivities != null && result.drStoredActivities != null) {
                let warnDiv = document.getElementById("runs-together-warn");
                warnDiv.parentElement.removeChild(warnDiv);
            }
        });

        // raid.report layout options
        document.getElementById("remove-kda").checked = result.removeKDA;
        document.getElementById("layout-dynamic").checked = result.dynamicLayout;
        document.getElementById("layout-minimal").checked = result.minimalLayout;
        document.getElementById("layout-compact").checked = result.compactLayout;
        document.getElementById("layout-modern").checked = result.modernLayout;

        // fireteam search layout options
        document.getElementById("fireteam-grid").checked = result.fireteamSearchGrid;
        document.getElementById("fireteam-report-buttons").checked = result.fireteamProfileReports;

        // misc
        document.getElementById("debug").checked = result.debugEnabled;

        // trigger save of options on any change of input element
        let inputs = document.getElementsByTagName("input");
        for (let input of inputs) {
            input.onchange = saveOptions;
        }
    });
};

const addProfile = () => {
    const newItem = document.createElement('li');
    newItem.innerHTML = `
        <div class="content"><input type="text" class="sidebar-profile" value="BungieName#ID"></div>    
        <span class="drag-handle" draggable="true">⠿</span>
        <button class="delete-btn">×</button>
      `;
    newItem.querySelector("input.sidebar-profile").addEventListener("change", saveOptions);
    sidebarProfileList.insertBefore(newItem, document.getElementById('add-btn'));
    initDragHandles();
    attachDeleteEvents();
}

const clearOwnActivityCache = () => {
    console.debug("clearing stored activities...")
    chrome.storage.local.set({ rrStoredActivities: null, drStoredActivities: null }).then(() => {
        console.debug("cleared stored activities!");
    });
}
const clearSync = () => {
    chrome.storage.sync.clear()
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("add-btn").addEventListener("click", addProfile);
document.getElementById("clearOwnActivityCache").addEventListener("click", clearOwnActivityCache);
document.getElementById("clearSync").addEventListener("click", clearSync);
