/* add scripts to page */
var scriptEl = document.createElement("script");
scriptEl.src = chrome.runtime.getURL("./js/rr-sidebar.js");
document.head.appendChild(scriptEl);

var scriptEl = document.createElement("script");
scriptEl.src = chrome.runtime.getURL("./js/rr-layout.js");
document.head.appendChild(scriptEl);

/* get saved settings */
chrome.storage.local.get(["dynamicLayout", "minimalLayout", "compactLayout", "modernLayout", "sidebarEnabled", "removeKDA", "sidebarProfiles"]).then((settings) => {
    /* update layout of page with observer */
    const targetNode = document.getElementById("root");
    const config = { attributes: true, childList: true, subtree: true };
    const rrLayoutCallback = (mutationList, observer) => {
        if (settings.sidebarEnabled) {
            addSidebar(settings.sidebarProfiles)
        }
        
        updatePage();
        updateLayout(settings.compactLayout);
    }

    const rrLayoutObserver = new MutationObserver(rrLayoutCallback);
    rrLayoutObserver.observe(targetNode, config);
});



