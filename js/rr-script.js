/* add main layout script to page */
var scriptEl = document.createElement("script");
scriptEl.src = chrome.runtime.getURL("./js/rr-layout.js");
document.head.appendChild(scriptEl);

var lastProfileUrl;

/* get saved settings */
chrome.storage.local.get(["sidebarEnabled", "sidebarProfiles", "removeKDA", "dynamicLayout", "minimalLayout", "compactLayout", "modernLayout"]).then((settings) => {
    /* add scripts and css files of enabled features */
    if (settings.modernLayout) {
        let styleEl = document.createElement("link");
        styleEl.rel = "stylesheet";
        styleEl.type = "text/css";
        styleEl.href = chrome.runtime.getURL("./css/rr-layout-modern.css");
        document.head.appendChild(styleEl);
    }
    if (settings.dynamicLayout) {
        let styleEl = document.createElement("link");
        styleEl.rel = "stylesheet";
        styleEl.type = "text/css";
        styleEl.href = chrome.runtime.getURL("./css/rr-layout-dynamic-single-row.css");
        document.head.appendChild(styleEl);
    }
    if (settings.sidebarEnabled) {
        let scriptEl = document.createElement("script");
        scriptEl.src = chrome.runtime.getURL("./js/rr-sidebar.js");
        document.head.appendChild(scriptEl);

        let styleEl = document.createElement("link");
        styleEl.rel = "stylesheet";
        styleEl.type = "text/css";
        styleEl.href = chrome.runtime.getURL("./css/rr-sidebar.css");
        document.head.appendChild(styleEl);
    }
    /* update layout of page with observer */
    const rrLayoutTargetNode = document.getElementById("root");
    const rrLayoutConfig = { attributes: false, childList: true, subtree: true };
    const rrLayoutCallback = (mutationList, observer) => {
        if (settings.sidebarEnabled) {
            addSidebar(settings.sidebarProfiles)
        }

        removeAds();
        updateLayout(settings.removeKDA, settings.dynamicLayout);

        let runsTogetherBadge = document.getElementById("runs-together-card");
        if (runsTogetherDone && runsTogetherBadge == null) {
            if (!document.location.href.includes("pgcr")) {
                if (lastProfileUrl == document.location.href) {
                    updateRunsTogether();
                }
            }
        }
    }

    const rrLayoutObserver = new MutationObserver(rrLayoutCallback);
    rrLayoutObserver.observe(rrLayoutTargetNode, rrLayoutConfig);
});