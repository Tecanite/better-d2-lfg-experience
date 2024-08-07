/* 
    src: https://developer.chrome.com/docs/extensions/develop/ui/options-page?hl=d
*/

// TODO make player list order changeable

// Saves options to chrome.storage
const saveOptions = () => {
    // sidebar options
    var sidebarEnabled = document.getElementById("sidebar-toggle").checked;

    var apiKey = document.getElementById("bungie-api-key").value;

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
    chrome.storage.local.set({
        sidebarEnabled: sidebarEnabled, apiKey: apiKey, sidebarProfiles: profiles,
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
// stored in chrome.storage.
const restoreOptions = () => {
    chrome.storage.local.get({
        sidebarEnabled: false, apiKey: "", sidebarProfiles: [],
        enableRunsTogether: false, ownProfileID: "Bungie#ID", storedActivities: null,
        removeKDA: false, dynamicLayout: false, minimalLayout: false, compactLayout: false, modernLayout: false,
        fireteamSearchGrid: false, fireteamProfileReports: false
    }).then((result) => {
        // sidebar options
        document.getElementById("sidebar-toggle").checked = result.sidebarEnabled;
        document.getElementById("bungie-api-key").value = result.apiKey;

        if (result.sidebarEnabled && result.apiKey == "") {
            let infoDiv = document.createElement("div");
            infoDiv.innerHTML = "Get an API key by registering an application <a href='https://www.bungie.net/en/Application'> here </a>.";
            document.getElementById("bungie-api-key").insertAdjacentElement("afterend", infoDiv);
        }


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
        if (result.storedActivities != null) {
            let warnDiv = document.getElementById("runs-together-warn");
            warnDiv.parentElement.removeChild(warnDiv);
        }

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
    chrome.storage.local.set({ storedActivities: null }).then(() => {
        console.debug("cleared stored activities!");
    });
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("save").addEventListener("click", saveOptions);
document.getElementById("addProfile").addEventListener("click", addProfile);
document.getElementById("removeProfile").addEventListener("click", removeLastProfile);
document.getElementById("clearOwnActivityCache").addEventListener("click", clearOwnActivityCache);