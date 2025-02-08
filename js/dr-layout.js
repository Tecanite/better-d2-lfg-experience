var runAlertOnce = false;
var runOnce = false;
var dungeonsPerRow = 4;

const dungeons = ["sd", "vh", "wr", "gotd", "sow", "dual", "goa", "proph", "poh", "st", "pres", "harb", "zh", "whisper"];
/**
 * This is the main function to alter the dungeon.report layout.
 * @name updateLayout
 * @param {boolean} removeUselessStats
 * @param {boolean} enableSingleRow
 * @returns {void}
 */
function updateLayout(removeUselessStats, enableSingleRow) {
    if (enableSingleRow) {
        var singleRow = document.getElementById("single-dungeon-row");

        if (singleRow != null) {
            return;
        }
        var cards = document.querySelectorAll(".col.l3.m6.s12")


        let singleDungeonRow = document.createElement("div");
        singleDungeonRow.className = "row dungeon-row";
        singleDungeonRow.id = "single-dungeon-row";
        let container = document.getElementsByClassName("side-container");

        if (container != null && container[0] != null) {
            container[0].id = "side-container";
            container[0].appendChild(singleDungeonRow);
        }

        for (let card of cards) {
            singleDungeonRow.appendChild(card);
        }
        let rows = document.getElementsByClassName("row dungeon-row");
        for (let i = 0; i < rows.length;) {
            if (rows[i].childNodes.length == 0) {
                rows[i].parentElement.removeChild(rows[i]);
            } else {
                i++;
            }
        }

        dungeonsPerRow = getElementsPerRow();
        adjustRowBreaks(dungeonsPerRow);

        window.addEventListener("resize", (event) => {
            event.stopImmediatePropagation();
            //! doesn't work => breaks dungeon.report if window to resized to small

            let lastDungeonsPerRow = dungeonsPerRow;
            dungeonsPerRow = getElementsPerRow();
            if (!(lastDungeonsPerRow == dungeonsPerRow)) {
                adjustRowBreaks(dungeonsPerRow);
            }

        });
    }

    var cards = document.getElementsByClassName("col l3 m6 s12");

    for (let i = 0; i < cards.length; i++) {
        if (dungeons[i] != null) {
            cards[i].id = dungeons[i];
            if (enableSingleRow) {
                cards[i].classList.add("item");
            }
        } else if (!runAlertOnce) {
            alert("New dungeon has been added.\nPlease update to the new latest version of better-d2-lfg-experience to prevent breakage!");
            runAlertOnce = true;
        }
    }

    padNonMasterDungeons();
    if (removeUselessStats) {
        removeStats();
    }
}

/**
 * This functions returns the number of dungeons that should be displayed per row according to window width.
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
 * This function adjusts position of break elements according to how many dungeons should be displayed per row.
 * @name adjustRowBreaks
 * @param {int} dungeonsPerRow
 * @returns {void}
 */
function adjustRowBreaks(dungeonsPerRow) {
    document.querySelectorAll(".break").forEach((breakEl) => {
        breakEl.remove();
    });

    let singleDungeonRow = document.getElementById("single-dungeon-row");
    let cards = document.getElementsByClassName("col l3 m6 s12");

    for (let i = dungeonsPerRow; i < cards.length; i += dungeonsPerRow) {
        let breakDiv = document.createElement("div");
        breakDiv.className = "break";
        singleDungeonRow.insertBefore(breakDiv, cards[i]);
    }
}

/**
 * This function adds a padding line to the clear table to align dungeon cards properly.
 * @name padNonMasterDungeons
 * @returns {void}
 */
function padNonMasterDungeons() {
    tables = document.querySelectorAll("div.card-content > table.centered:not(.pgcr-table)");
    if (tables != null) {
        for (let i = 0; i < tables.length; i++) {
            if (tables[i].childNodes[1].childNodes.length < 2) {
                let padding = document.createElement('tr');
                padding.innerHTML = "<th><p style='visibility: hidden;'>|</p></th><td><span class=''></span></td><td><span class=''></span></td>";
                tables[i].childNodes[1].append(padding);
            }
        }
    }
}

/**
 * This function removes the KDA-Stats table from all dungeon cards.
 * @name removeStats
 * @returns {void}
 */
function removeStats() {
    statRows = document.querySelectorAll("div.row:not(.small-bottom-margin):not(.center):not(.no-margin):not(#single-dungeon-row)");
    for (row of statRows) {
        if (row && row.previousSibling) {
            row.parentNode.removeChild(row.previousSibling);
        }
        row.parentNode.removeChild(row);
    }
}

