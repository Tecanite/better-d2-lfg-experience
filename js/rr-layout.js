/**
 * TODO add all raid cards to single div, dynamic fitting with css if possible,
 * TODO maybe change order
 */

function removeAds() {
    /* remove ad banner */
    let adBanner1 = document.querySelector("div.jss6");
    if (adBanner1 != null) {
        adBanner1.remove();
    }
    let adBanner2 = document.querySelector("div.jss12");
    if (adBanner2 != null) {
        adBanner2.remove();
    }
    let ads = document.getElementsByClassName("div.ad-tag");
    for (let i = ads.length-1; i >= 0; i--) {
        ads[i].remove();
    }
}

var runAlertOnce = false;
var runOnce = false;
var raidsPerRow = 4;

function updateLayout(removeUselessStats, enableSingleRow) {
    if (enableSingleRow) {
        var singleRow = document.getElementById("single-raid-row");
    
        if (singleRow != null) {
            return;
        }
        
        var rows = document.getElementsByClassName("row raid-row");
    
        let singleRaidRow = document.createElement("div");
        singleRaidRow.className = "row raid-row";
        singleRaidRow.id = "single-raid-row";
        let container = document.getElementById("side-container");
        if (container != null) {
            container.appendChild(singleRaidRow);
        }
    
        combinedInnerHTML = "";
        for(let i = 0; i < rows.length;) {
            if (!(rows[i].classList.contains("small-bottom-margin") || rows[i].id == "single-raid-row")) {
                for(let j = 0; j < rows[i].childNodes.length;) {
                    singleRaidRow.appendChild(rows[i].childNodes[j]);
                }
                rows[i].parentNode.removeChild(rows[i]);
            } else {
                i++;
            }
        }
        raidsPerRow = getElementsPerRow();
        adjustRowBreaks(raidsPerRow)

        window.addEventListener("resize", (event) => {
            event.stopImmediatePropagation(); //! doesnt work apparently
            
            let lastRaidsPerRow = raidsPerRow;
            raidsPerRow = getElementsPerRow();
            console.log(lastRaidsPerRow, raidsPerRow)
            if(!(lastRaidsPerRow == raidsPerRow)) {
                console.log("here");
                adjustRowBreaks(raidsPerRow);
            }
            
        });
    } else {
        let raids = ["ce", "ron", "kf", "vow", "vog", "dsc", "gos", "lw", "cos", "sotp", "sos", "eow", "lev"];
        let cards = document.getElementsByClassName("col l3 m6 s12");
        if (cards[0].id == raids[0]) {
            // return;
        }
    }

    var raids = ["ce", "ron", "kf", "votd", "vog", "dsc", "gos", "lw", "cos", "sotp", "sos", "eow", "lev"];
    var cards = document.getElementsByClassName("col l3 m6 s12");
    var order = ["ce", "ron", "kf", "votd", "vog", "dsc", "gos", "lw", "cos", "sotp", "sos", "eow", "lev"];

    for(let i = 0; i < cards.length; i++) {   
        if (raids[i] != null) {
            cards[i].id = raids[i];
            if(enableSingleRow) {
                cards[i].classList.add("item");
            }
        } else if (!runAlertOnce) {
            alert("New raid has been added.\nPlease update to the new latest version of better-d2-lfg-experience to prevent breakage!");
            runAlertOnce = true;
        }
    }

    padNonMasterOrPrestigeRaids();
    if(removeUselessStats) {
        removeStats();
    }
}

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

function adjustRowBreaks(raidsPerRow) {
    document.querySelectorAll(".break").forEach((breakEl) => {
        breakEl.remove();
    });

    let singleRaidRow = document.getElementById("single-raid-row");
    let cards = document.getElementsByClassName("col l3 m6 s12");

    for(let i = raidsPerRow; i < cards.length; i += raidsPerRow) {
        let breakDiv = document.createElement("div");
        breakDiv.className = "break";
        singleRaidRow.insertBefore(breakDiv, cards[i]);
    }
}


function padNonMasterOrPrestigeRaids() {
    tables = document.querySelectorAll("div.card-content > table.centered ");
    for (let i = 0; i < tables.length; i++) {
        if (tables[i].childNodes[1].childNodes.length < 3) {
            let padding = document.createElement('tr');
            padding.innerHTML = "<th><p style='visibility: hidden;'>|</p></th><td><span class=''></span></td><td><span class=''></span></td>";
            tables[i].childNodes[1].append(padding);
        }
    }
}

function removeStats() {
    tables = document.querySelectorAll("table.col.s8.centered");
    for(let i = tables.length - 1; i >= 0; i--) {
        tables[i].remove();
    }
}

