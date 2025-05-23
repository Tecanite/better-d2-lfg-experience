/* add main layout script to page */
var scriptEl = document.createElement("script");
scriptEl.src = chrome.runtime.getURL("./js/dr-layout.js");
document.head.appendChild(scriptEl);

var lastProfileUrl, lastUrl;
var runsTogetherEnabled;

var debugEnabled = false;

/* get saved settings */
chrome.storage.sync.get(["migrated", "sidebarEnabled", "sidebarProfiles", "removeKDA", "dynamicLayout", "minimalLayout", "compactLayout", "modernLayout", "enableRunsTogether", "debugEnabled"])
    .then((settings) => {
        if (settings.migrated == null || settings.migrated == false) {
            return chrome.storage.local.get(["sidebarEnabled", "sidebarProfiles", "removeKDA", "dynamicLayout", "minimalLayout", "compactLayout", "modernLayout", "enableRunsTogether"])
        } else {
            return settings
        }
    }).then((settings) => {
        /* add scripts and css files of enabled features */
        if (settings.modernLayout) {
            let styleEl = document.createElement("link");
            styleEl.rel = "stylesheet";
            styleEl.type = "text/css";
            styleEl.href = chrome.runtime.getURL("./css/dr-layout-modern.css");
            document.head.appendChild(styleEl);
        }
        if (settings.dynamicLayout) {
            let styleEl = document.createElement("link");
            styleEl.rel = "stylesheet";
            styleEl.type = "text/css";
            styleEl.href = chrome.runtime.getURL("./css/dr-layout-dynamic-single-row.css");
            document.head.appendChild(styleEl);
        }
        if (settings.sidebarEnabled) {
            let scriptEl = document.createElement("script");
            scriptEl.src = chrome.runtime.getURL("./js/dr-sidebar.js");
            document.head.appendChild(scriptEl);

            let styleEl = document.createElement("link");
            styleEl.rel = "stylesheet";
            styleEl.type = "text/css";
            styleEl.href = chrome.runtime.getURL("./css/dr-sidebar.css");
            document.head.appendChild(styleEl);

            addSidebar(settings.sidebarProfiles)
        }
        runsTogetherEnabled = settings.enableRunsTogether;
        debugEnabled = settings.debugEnabled;

        /* update layout of page with observer */
        const drLayoutTargetNode = document.getElementById("root");
        const drLayoutConfig = { attributes: false, childList: true, subtree: true };
        const drLayoutCallback = (_, __) => {
            if (settings.sidebarEnabled) {
                addSidebar(settings.sidebarProfiles);
            }
            if (document.location.href.endsWith("dungeon.report/") || document.location.href.endsWith("dungeon.report")) {
                return;
            }
            if (document.location.href == lastUrl) {
                return;
            }
            lastUrl = document.location.href;

            updateLayout(settings.removeKDA, settings.dynamicLayout);
            if (runsTogetherEnabled) {
                let runsTogetherBadge = document.getElementById("runs-together-card");
                if (runsTogetherDone && runsTogetherBadge == null) {
                    if (!document.location.href.includes("pgcr")) {
                        if (lastProfileUrl == document.location.href) {
                            finishRunsTogether();
                        }
                    }
                }
            }
        }

        const drLayoutObserver = new MutationObserver(drLayoutCallback);
        drLayoutObserver.observe(drLayoutTargetNode, drLayoutConfig);
    });