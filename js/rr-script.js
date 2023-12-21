/* add scripts to page */
var scriptEl = document.createElement("script");
scriptEl.src = chrome.runtime.getURL("./js/rr-sidebar.js");
document.head.appendChild(scriptEl);

var scriptEl = document.createElement("script");
scriptEl.src = chrome.runtime.getURL("./js/rr-layout.js");
document.head.appendChild(scriptEl);

/* get saved settings */
chrome.storage.local.get(["dynamicLayout", "minimalLayout", "compactLayout", "modernLayout", "sidebarEnabled", "removeKDA", "sidebarProfiles"]).then((settings) => {
    if (settings.sidebarEnabled) {
        addSidebar()
        if (settings.sidebarProfiles == null) {
            sidebarProfilesAdd([]);
        } else {
            sidebarProfilesAdd(settings.sidebarProfiles)
        }
    }
});

/* update layout of page with observer */
const removeUselessStats = true;

const targetNode = document.getElementById("root");
const config = { attributes: true, childList: true, subtree: true };
const callback = (mutationList, observer) => {
    updatePage()
    updateLayout(removeUselessStats)
}

const observer = new MutationObserver(callback)

updatePage()
updateLayout(removeUselessStats)

observer.observe(targetNode, config)