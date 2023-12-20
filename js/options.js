/* 
    src: https://developer.chrome.com/docs/extensions/develop/ui/options-page?hl=d
*/

// Saves options to chrome.storage
const saveOptions = () => {
    var dynamic = document.getElementById("layout-dynamic").checked;
    var minimal = document.getElementById("layout-minimal").checked;
    var compact = document.getElementById("layout-compact").checked;
    var modern = document.getElementById("layout-modern").checked;

    var sidebarEnabled = document.getElementById("sidebar-toggle").checked;
    console.log(sidebarEnabled);
    var removeKDA = document.getElementById("remove-kda").checked;
    
    let profileList = document.getElementById("rr-sidebar-profiles");
    let profileElements = profileList.getElementsByTagName("li");
    var profiles = [];
    for (let i = 0; i < profileElements.length; i++) {
        if (profileElements[i].innerHTML != "") {
            profiles.push(profileElements[i].innerHTML);
        }
    }
    
    chrome.storage.local.set({dynamicLayout: dynamic, minimalLayout: minimal, compactLayout: compact, modernLayout: modern, sidebarEnabled: sidebarEnabled, removeKDA: removeKDA, sidebarProfiles: profiles}).then(() => {
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
    chrome.storage.local.get(["dynamicLayout", "minimalLayout", "compactLayout", "modernLayout", "sidebarEnabled", "removeKDA", "sidebarProfiles"]).then((result) => {
        console.log(result);
        document.getElementById("layout-dynamic").checked = result.dynamicLayout;
        document.getElementById("layout-minimal").checked = result.minimalLayout;
        document.getElementById("layout-compact").checked = result.compactLayout;
        document.getElementById("layout-modern").checked = result.modernLayout;

        document.getElementById("sidebar-toggle").checked = result.sidebarEnabled;
        document.getElementById("remove-kda").checked = result.removeKDA;

        let sidebarProfiles = result.sidebarProfiles;
        let profileList = document.getElementById("rr-sidebar-profiles");
        for (let i = 0; i < sidebarProfiles.length; i++) {
            let profile = document.createElement("li");
            profile.contentEditable = "true";
            profile.innerHTML = sidebarProfiles[i];
            profileList.appendChild(profile);
        }

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