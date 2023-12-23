/* 
    src: https://developer.chrome.com/docs/extensions/develop/ui/options-page?hl=d
*/

//TODO remove cached activities

// Saves options to chrome.storage
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
    chrome.storage.local.set({  sidebarEnabled: sidebarEnabled, sidebarProfiles: profiles, 
                                enableRunsTogether: enableRunsTogether, ownProfileID: ownProfile,
                                removeKDA: removeKDA, dynamicLayout: dynamic, minimalLayout: minimal, compactLayout: compact, modernLayout: modern, 
                                fireteamSearchGrid: fireteamGrid, fireteamProfileReports: fireteamReports}).then(() => {
        console.log("Saved Options!");
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
    chrome.storage.local.get({  sidebarEnabled: false, sidebarProfiles: [], 
                                enableRunsTogether: false, ownProfileID: "Bungie#ID", cachedActivities: null,
                                removeKDA: false, dynamicLayout: false, minimalLayout: false, compactLayout: false, modernLayout: false, 
                                fireteamSearchGrid: false, fireteamProfileReports: false}).then((result) => {
        console.log(result);

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
        if (result.cachedActivities != null) {
            let warnDiv= document.getElementById("runs-together-warn");
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

const clearSidebarCache = () => {
    console.log("clearing sidebar cache...")
    chrome.storage.local.get(["sidebarCache"])
            .then((result) => {
                  if (result.sidebarCache != null) {
                        sidebarCache = new Map(Object.entries(result.sidebarCache));
                  } else {
                        sidebarCache = new Map();
                  }
            })
            .then(() => {
                sidebarCache.clear()
            })
            .then(() => {
                chrome.storage.local.set({sidebarCache: Object.fromEntries(sidebarCache)}).then(() => {
                    console.log("cleared sidebar cache!");
              });
            })
}
  
document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("save").addEventListener("click", saveOptions);
document.getElementById("addProfile").addEventListener("click", addProfile);
document.getElementById("removeProfile").addEventListener("click", removeLastProfile);
document.getElementById("clearSidebarCache").addEventListener("click", clearSidebarCache);