/* get saved settings and add css / call functions accordingly */
chrome.storage.sync.get(["migrated", "fireteamSearchGrid", "fireteamProfileReports"])
    .then((settings) => {
        if (settings.migrated == null || settings.migrated == false) {
            alert("better-d2-lfg-experience: Please visit the extension options and migrate settings to use synced storage. Using local values for now.")
            return chrome.storage.local.get(["fireteamSearchGrid", "fireteamProfileReports"])
        } else {
            return settings
        }
    }).then((settings) => {
        if (settings.fireteamSearchGrid) {
            var styleEl = document.createElement("link");
            styleEl.rel = "stylesheet";
            styleEl.type = "text/css";
            styleEl.href = chrome.runtime.getURL("./css/fireteam-search-grid.css");
            document.head.appendChild(styleEl);
        }

        if (settings.fireteamProfileReports) {
            var scriptEl = document.createElement("script");
            scriptEl.src = chrome.runtime.getURL("./js/fireteam-quickactions.js");
            document.head.appendChild(scriptEl);

            var styleEl = document.createElement("link");
            styleEl.rel = "stylesheet";
            styleEl.type = "text/css";
            styleEl.href = chrome.runtime.getURL("./css/fireteam-player-reports.css");
            document.head.appendChild(styleEl);

            const targetNode = document.getElementById("root");
            const config = { attributes: true, childList: true, subtree: true };
            const addReportLinkButtonsCallback = (_, __) => {
                addReportLinkButtons();
            }

            const addReportLinkButtonsObserver = new MutationObserver(addReportLinkButtonsCallback);
            addReportLinkButtonsObserver.observe(targetNode, config);
        }
    });








