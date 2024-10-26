/* 
    src: https://developer.chrome.com/docs/extensions/develop/ui/options-page?hl=d
*/

// TODO make player list order changeable

// Saves options to chrome.storage.sync
const saveOptions = () => {
    // sidebar options
    var sidebarEnabled = document.getElementById("sidebar-toggle").checked;

    let profileList = document.getElementById("rr-sidebar-profiles");
    let profileElements = profileList.getElementsByTagName("li");
    var profiles = [];
    for (let i = 0; i < profileElements.length; i++) {
        if (profileElements[i].innerHTML != "") {
            profiles.push(profileElements[i].innerHTML);
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


    // saving
    chrome.storage.sync.set({
        migrated: true, sidebarEnabled: sidebarEnabled, sidebarProfiles: profiles,
        enableRunsTogether: enableRunsTogether, ownProfileID: ownProfile,
        removeKDA: removeKDA, dynamicLayout: dynamic, minimalLayout: minimal, compactLayout: compact, modernLayout: modern,
        fireteamSearchGrid: fireteamGrid, fireteamProfileReports: fireteamReports
    }).then(() => {
        console.debug("Saved Options!");
        const status = document.getElementById("status");
        status.textContent = "Options saved.";
        setTimeout(() => {
            status.textContent = "";
        }, 1000);
    });

};

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.sync, if not yet migrated from chrome.storage.local, load local settings
const restoreOptions = () => {
    chrome.storage.sync.get({
        migrated: false, sidebarEnabled: false, sidebarProfiles: [],
        enableRunsTogether: false, ownProfileID: "Bungie#ID",
        removeKDA: false, dynamicLayout: false, minimalLayout: false, compactLayout: false, modernLayout: false,
        fireteamSearchGrid: false, fireteamProfileReports: false
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
        let profileList = document.getElementById("rr-sidebar-profiles");
        for (let i = 0; i < sidebarProfiles.length; i++) {
            let profile = document.createElement("li");
            profile.contentEditable = "true";
            profile.innerHTML = sidebarProfiles[i];
            profileList.appendChild(profile);
        }

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
    });
};


const addProfile = () => {
    let sidebarList = document.getElementById("rr-sidebar-profiles");
    let profile = document.createElement("li");
    profile.contentEditable = "true";
    profile.innerHTML = "BungieName#id";
    sidebarList.appendChild(profile);
};

const removeLastProfile = () => {
    let sidebarList = document.getElementById("rr-sidebar-profiles");
    sidebarList.removeChild(sidebarList.lastChild);
};

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
document.getElementById("save").addEventListener("click", saveOptions);
document.getElementById("addProfile").addEventListener("click", addProfile);
document.getElementById("removeProfile").addEventListener("click", removeLastProfile);
document.getElementById("clearOwnActivityCache").addEventListener("click", clearOwnActivityCache);
document.getElementById("clearSync").addEventListener("click", clearSync);