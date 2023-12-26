/* add scripts to page */
var scriptEl = document.createElement("script");
scriptEl.src = chrome.runtime.getURL("./js/rr-layout.js");
document.head.appendChild(scriptEl);

var scriptEl = document.createElement("script");
scriptEl.src = chrome.runtime.getURL("./js/rr-sidebar.js");
document.head.appendChild(scriptEl);

/* get saved settings */
chrome.storage.local.get(["sidebarEnabled", "sidebarProfiles", "removeKDA", "dynamicLayout", "minimalLayout", "compactLayout", "modernLayout"]).then((settings) => {
    /* update layout of page with observer */
    const rrLayoutTargetNode = document.getElementById("root");
    const rrLayoutConfig = { attributes: false, childList: true, subtree: true };
    const rrLayoutCallback = (mutationList, observer) => {
        if (settings.sidebarEnabled) {
            addSidebar(settings.sidebarProfiles)
        }

        updatePage();
        updateLayout(settings.removeKDA);
    }

    const rrLayoutObserver = new MutationObserver(rrLayoutCallback);
    rrLayoutObserver.observe(rrLayoutTargetNode, rrLayoutConfig);
});