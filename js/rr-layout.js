/**
 * This functions removes ad banner elements from the raid.report page.
 * @name removeAds
 * @returns {void}
 */
function removeAds() {
    /* remove ad banner */
    let adBanners = document.querySelectorAll("div[class^='jss']");
    for (let adBanner of adBanners) {
        if (adBanner.innerHTML.includes("Premium")) {
            adBanner.parentNode.removeChild(adBanner);
        }
    }
    let ads = document.querySelectorAll("div.ad-tag");
    for (let i = ads.length - 1; i >= 0; i--) {
        ads[i].remove();
    }
}

var runAlertOnce = false;
var runOnce = false;
var raidsPerRow = 4;

/**
 * This is the main function to alter the raid.report layout.
 * @name updateLayout
 * @param {boolean} removeUselessStats
 * @param {boolean} enableSingleRow
 * @returns {void}
 */
function updateLayout(removeUselessStats, enableSingleRow) {
    if (enableSingleRow) {
        var singleRow = document.getElementById("single-raid-row");

        if (singleRow != null) {
            console.log("here");
            return;
        }
        var cards = document.querySelectorAll(".col.l3.m6.s12")


        let singleRaidRow = document.createElement("div");
        singleRaidRow.className = "row raid-row";
        singleRaidRow.id = "single-raid-row";
        let container = document.getElementsByClassName("side-container");

        if (container != null && container[0] != null) {
            container[0].id = "side-container";
            container[0].appendChild(singleRaidRow);
        }

        for (let card of cards) {
            singleRaidRow.appendChild(card);
        }
        let rows = document.getElementsByClassName("row raid-row");
        for (let i = 0; i < rows.length;) {
            if (rows[i].childNodes.length == 0) {
                rows[i].parentElement.removeChild(rows[i]);
            } else {
                i++;
            }
        }

        raidsPerRow = getElementsPerRow();
        adjustRowBreaks(raidsPerRow);

        window.addEventListener("resize", (event) => {
            event.stopImmediatePropagation();
            //! doesn't work => breaks raid.report if window to resized to small

            let lastRaidsPerRow = raidsPerRow;
            raidsPerRow = getElementsPerRow();
            if (!(lastRaidsPerRow == raidsPerRow)) {
                adjustRowBreaks(raidsPerRow);
            }

        });
    }

    var raids = ["se", "pantheon", "ce", "ron", "kf", "votd", "vog", "dsc", "gos", "lw", "cos", "sotp", "sos", "eow", "lev"];
    var cards = document.getElementsByClassName("col l3 m6 s12");
    var order = ["se", "pantheon", "ce", "ron", "kf", "votd", "vog", "dsc", "gos", "lw", "cos", "sotp", "sos", "eow", "lev"];

    for (let i = 0; i < cards.length; i++) {
        if (raids[i] != null) {
            cards[i].id = raids[i];
            if (enableSingleRow) {
                cards[i].classList.add("item");
            }
        } else if (!runAlertOnce) {
            alert("New raid has been added.\nPlease update to the new latest version of better-d2-lfg-experience to prevent breakage!");
            runAlertOnce = true;
        }
    }

    padNonMasterOrPrestigeRaids();
    if (removeUselessStats) {
        removeStats();
    }
}

/**
 * This functions returns the number of raids that should be displayed per row according to window width.
 * @name getElementsPerRow
 * @returns {int}
 */
function getElementsPerRow() {
    var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (width >= 1810) {
        return 6;
    } else if (width >= 1530) {
        return 5;
    } else if (width >= 1230) {
        return 4;
    } else {
        return 3;
    }
}

/**
 * This function adjusts position of break elements according to how many raids should be displayed per row.
 * @name adjustRowBreaks
 * @param {int} raidsPerRow
 * @returns {void}
 */
function adjustRowBreaks(raidsPerRow) {
    document.querySelectorAll(".break").forEach((breakEl) => {
        breakEl.remove();
    });

    let singleRaidRow = document.getElementById("single-raid-row");
    let cards = document.getElementsByClassName("col l3 m6 s12");

    for (let i = raidsPerRow; i < cards.length; i += raidsPerRow) {
        let breakDiv = document.createElement("div");
        breakDiv.className = "break";
        singleRaidRow.insertBefore(breakDiv, cards[i]);
    }
}

/**
 * This function adds a padding line to the clear table to align raid cards properly.
 * @name padNonMasterOrPrestigeRaids
 * @returns {void}
 */
function padNonMasterOrPrestigeRaids() {
    tables = document.querySelectorAll("div.card-content > table.centered:not(.pgcr-table)");
    if (tables != null) {
        for (let i = 0; i < tables.length; i++) {
            if (tables[i].childNodes[1].childNodes.length < 3) {
                let padding = document.createElement('tr');
                padding.innerHTML = "<th><p style='visibility: hidden;'>|</p></th><td><span class=''></span></td><td><span class=''></span></td>";
                tables[i].childNodes[1].append(padding);
            }
        }
    }
}

/**
 * This function removes the KDA-Stats table from all raid cards.
 * @name removeStats
 * @returns {void}
 */
function removeStats() {
    tables = document.querySelectorAll("table.col.s8.centered");
    if (tables != null) {
        for (let i = tables.length - 1; i >= 0; i--) {
            tables[i].remove();
        }
    }
}

