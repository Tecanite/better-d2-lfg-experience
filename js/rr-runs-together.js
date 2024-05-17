var debug = false;

var storedActivities;
var runsTogetherAlertRan = false;
var ownerID;
var enableRunsTogether;

var allActivities = [];
var userID, lastUserID;
var animTimeoutID, saveTimeoutID;

var runsTogetherDone = false;
var pantheon, ce, ron, kf, votd, vog, dsc, gos, lw, cos, sotp, sos, eow, lev;
var activitiesMap;

var scriptEl = document.createElement("script");
scriptEl.src = chrome.runtime.getURL("./js/rr-runs-together-inject.js");
scriptEl.onload = function () {
    this.remove();
};
(document.head || document.documentElement).appendChild(scriptEl);


// get saved settings
chrome.storage.local.get(["ownProfileID", "storedActivities", "enableRunsTogether"])
    .then((settings) => {
        ownerID = settings.ownProfileID;
        enableRunsTogether = settings.enableRunsTogether;
        if (settings.storedActivities != null) {
            storedActivities = new Map(Object.entries(settings.storedActivities));
            storedActivities.forEach((activityArray, key) => {
                storedActivities.set(key, new Set(activityArray));
            });
        } else {
            storedActivities = null;
        }
        if (enableRunsTogether) {
            var styleEl = document.createElement("link");
            styleEl.rel = "stylesheet";
            styleEl.type = "text/css";
            styleEl.href = chrome.runtime.getURL("./css/rr-runs-together.css");
            document.head.appendChild(styleEl);

            runsTogetherAlertRan = false;
        }
    });

// receive message from injected script
window.addEventListener("message", function (e) {
    // console.log(e.data.data.Response)
    if (e.data.data != null && e.data.data.Response != null && e.data.data.Response.destinyMemberships != null) {
        firstMembership = e.data.data.Response.destinyMemberships[0];
        userID = firstMembership.bungieGlobalDisplayName + "#" + firstMembership.bungieGlobalDisplayNameCode;

        allActivities = [];

        pantheon = new Set(), ce = new Set(), ron = new Set(), kf = new Set(), votd = new Set(), vog = new Set(), dsc = new Set(), gos = new Set(), lw = new Set(), cos = new Set(), sotp = new Set(), sos = new Set(), eow = new Set(), lev = new Set(),
            activitiesMap = new Map();
        runsTogetherDone = false;
    }

    if (e.data.data.Response != null && e.data.data.Response.activities != null) {
        let activities = e.data.data.Response.activities;
        if (activities[0].period != null) {
            activities.forEach(element => {
                allActivities.push(element);
            });
            sortFetchedActivities();
        }
    }
});

/**
 * This function sorts all fetched activities by raids.
 * @author Tecanite
 * @name sortFetchedActivities
 * @returns {void}
 */
function sortFetchedActivities() {
    if (!enableRunsTogether || allActivities == []) {
        return;
    }

    allActivities.forEach(function (item, index, object) {
        // filter only completed activities
        if (item.values.completed.basic.value != 1 || item.values.completionReason.basic.value == 2) {
            return;
        }

        switch (item.activityDetails.directorActivityHash) {
            case 4169648179: case 4169648176: case 4169648177: case 4169648182: // Atraks Sovereign / Oryx Exalted / Rhulk Indomitable / Nezarec Sublime
                pantheon.add(item.activityDetails.instanceId);
                break;
            case 4179289725: case 1507509200: case 4103176774: case 156253568: // ce normal / master / guided / contest
                ce.add(item.activityDetails.instanceId);
                break;
            case 2381413764: case 2918919505: case 1191701339: // ron normal / master / guided
                ron.add(item.activityDetails.instanceId);
                break;
            case 1374392663: case 2964135793: case 3257594522: case 2897223272: case 1063970578: // kf normal / master / master / guided / challenge
                kf.add(item.activityDetails.instanceId);
                break;
            case 1441982566: case 4217492330: case 3889634515: case 4156879541: // vow normal / master / master / guided
                votd.add(item.activityDetails.instanceId);
                break;
            case 3881495763: case 1681562271: case 3022541210: case 3711931140: case 1485585878: // vog normal / master / master / guided / challenge
                vog.add(item.activityDetails.instanceId);
                break;
            case 910380154: case 3976949817: // deep stone crypt normal / guided
                dsc.add(item.activityDetails.instanceId);
                break;
            case 3458480158: case 1042180643: case 2659723068: case 2497200493: case 3845997235: // gos normal / new div / old div / guided / guided
                gos.add(item.activityDetails.instanceId);
                break;
            case 2122313384: case 1661734046:  //lw normal / guided
                lw.add(item.activityDetails.instanceId);
                break;
            case 3333172150: case 960175301: // cos normal / guided
                cos.add(item.activityDetails.instanceId);
                break;
            case 548750096: case 2812525063: // sotp normal / guided
                sotp.add(item.activityDetails.instanceId);
                break;
            case 119944200: case 3213556450: case 3004605630: // sos normal / prestige / guided
                sos.add(item.activityDetails.instanceId);
                break;
            case 3089205900: case 809170886: case 2164432138: // eow normal / prestige / guided
                eow.add(item.activityDetails.instanceId);
                break;
            case 2693136600: case 2693136601: case 2693136602: case 2693136603: case 2693136604: case 2693136605: // lev normal
            case 757116822: case 3879860661: case 2449714930: case 417231112: case 3446541099: case 1685065161: // lev prestige
            case 1699948563: case 3916343513: case 4039317196: case 89727599: case 1875726950: case 287649202: // lev guided
                lev.add(item.activityDetails.instanceId);
                break;
        }
    })
    // create map for easy access
    activitiesMap.set("pantheon", pantheon);
    activitiesMap.set("ce", ce);
    activitiesMap.set("ron", ron);
    activitiesMap.set("kf", kf);
    activitiesMap.set("votd", votd);
    activitiesMap.set("vog", vog);
    activitiesMap.set("dsc", dsc);
    activitiesMap.set("gos", gos);
    activitiesMap.set("lw", lw);
    activitiesMap.set("cos", cos);
    activitiesMap.set("sotp", sotp);
    activitiesMap.set("sos", sos);
    activitiesMap.set("eow", eow);
    activitiesMap.set("lev", lev);

    if (debug) {
        console.log("ce:", ce);
        console.log("ron:", ron);
        console.log("kf:", kf);
        console.log("votd:", votd);
        console.log("vog:", vog);
        console.log("dsc:", dsc);
        console.log("gos:", gos);
        console.log("lw:", lw);
        console.log("cos:", cos);
        console.log("sotp:", sotp);
        console.log("sos:", sos);
        console.log("eow:", eow);
        console.log("lev:", lev);

        console.log(activitiesMap);

        filteredAllActivities = allActivities.filter(item => {
            var hash = item.activityDetails.directorActivityHash;
            var existing = [4169648179, 4169648176, 4169648177, 4169648182, 4179289725, 1507509200, 4103176774, 156253568, 2381413764, 2918919505,
                1191701339, 1374392663, 2964135793, 3257594522, 2897223272, 1063970578, 1441982566, 4217492330, 3889634515, 4156879541, 3881495763,
                1681562271, 3022541210, 3711931140, 1485585878, 910380154, 3976949817, 3458480158, 1042180643, 2659723068, 2497200493, 2122313384,
                1661734046, 3333172150, 548750096, 2812525063, 119944200, 3213556450, 3089205900, 809170886, 2693136600, 2693136601, 2693136602,
                2693136603, 2693136604, 2693136605, 757116822, 3879860661, 2449714930, 417231112, 3446541099, 1685065161, 960175301, 3845997235,
                2164432138, 1699948563, 3916343513, 4039317196, 89727599, 1875726950, 3004605630, 287649202];
            return !existing.includes(hash);
        })
        console.log("not filtered:", filteredAllActivities);
    }

    updateRunsTogether();
}

/**
 * This function computes how many runs were done together by comparing instance ids.
 * @author Tecanite
 * @name sidebarProfilesAdd
 * @param {Map<string, int>} activitiesMap
 * @returns {void}
 */
function updateRunsTogether() {
    // cache activityMap if own profile
    if (ownerID == userID) {
        clearTimeout(saveTimeoutID);
        saveTimeoutID = setTimeout(() => {
            activitiesMap.forEach((activitySet, key) => {
                activitiesMap.set(key, Array.from(activitySet))
            });
            chrome.storage.local.set({ storedActivities: Object.fromEntries(activitiesMap) }).then(() => {
                console.log("saved activities!");
            });
        }, 3000)
    } else {
        var countRunsTogether = 0;
        var runsTogether = new Map();

        runsTogether.set("pantheon", new Set());
        runsTogether.set("ce", new Set());
        runsTogether.set("ron", new Set());
        runsTogether.set("kf", new Set());
        runsTogether.set("votd", new Set());
        runsTogether.set("vog", new Set());
        runsTogether.set("dsc", new Set());
        runsTogether.set("gos", new Set());
        runsTogether.set("lw", new Set());
        runsTogether.set("cos", new Set());
        runsTogether.set("sotp", new Set());
        runsTogether.set("sos", new Set());
        runsTogether.set("eow", new Set());
        runsTogether.set("lev", new Set());

        let runsTogetherCard = document.getElementById("runs-together-card");

        if (runsTogetherCard == null) {
            runsTogetherCard = document.createElement("div");
            runsTogetherCard.className = "col s6 runs-together-padding";
            runsTogetherCard.id = "runs-together-card"

            let innerDiv = document.createElement("div");
            innerDiv.className = "card rank-card";
            innerDiv.style.backgroundColor = "grey";

            let img = document.createElement("img");
            img.className = "rank-emblem";
            img.src = "data:image/png;base64,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"
            innerDiv.appendChild(img);

            let innerInnerDiv = document.createElement("div");
            innerInnerDiv.className = "rank-content white-text";
            innerInnerDiv.innerHTML = "<div class='rank-title'>Runs Together</div><div class='rank-value'>Unranked</div><div class='rank-title'>0</div>";
            innerDiv.style.animation = "skeleton-loading 1s linear infinite alternate";
            innerDiv.appendChild(innerInnerDiv);

            runsTogetherCard.appendChild(innerDiv);

            let cards = document.querySelector(".card-length");

            if (cards != null) {
                cards.appendChild(runsTogetherCard);
            }
        }


        if (storedActivities == null) {
            if (!runsTogetherAlertRan) {
                if (ownerID == "Bungie#ID") {
                    alert("Please set own Bungie ID in options and visit own raid.report to enable runs together.");
                } else {
                    alert("Please visit own raid.report once and let it fully load to cache activities");
                }
                runsTogetherAlertRan = true;
            }
            return;
        }
        activitiesMap.forEach(function (value, key) {
            value.forEach(item => {
                if (storedActivities.get(key).has(item)) {
                    countRunsTogether++;
                    runsTogether.get(key).add(item);
                }
            })
        })

        let tier;
        let color;

        if (countRunsTogether >= 500) {
            tier = "Challenger";
            color = "rgb(250, 87, 111)";
        } else if (countRunsTogether >= 250) {
            tier = "Master";
            color = "rgb(250, 87, 111)";
        } else if (countRunsTogether >= 100) {
            tier = "Diamond";
            color = "rgb(4, 138, 180)";
        } else if (countRunsTogether >= 50) {
            tier = "Platinum";
            color = "rgb(4, 177, 161)";
        } else if (countRunsTogether >= 25) {
            tier = "Gold";
            color = "rgb(250, 188, 68)";
        } else if (countRunsTogether >= 10) {
            tier = "Silver";
            color = "rgb(158, 163, 176)";
        } else if (countRunsTogether >= 1) {
            tier = "Bronze";
            color = "rgb(106, 91, 63)";
        } else {
            tier = "Unranked";
            color = "grey";
        }

        let rankValue = document.querySelector("#runs-together-card div.rank-value");
        let rankTitle = document.querySelector("#runs-together-card div.rank-title:nth-child(3)");
        let innerCard = document.querySelector("#runs-together-card>div.rank-card");

        if (rankValue != null) {
            rankValue.innerText = tier;
        }
        if (rankTitle != null) {
            rankTitle.innerText = countRunsTogether;
        }
        if (innerCard != null) {
            innerCard.style.backgroundColor = color;
        }
        // TODO does not work if player has 0 crota clears ???
        let totalCompletion = document.querySelector("div.total-completions");
        if (debug) {
            console.log(totalCompletion)
            console.log(totalCompletion.children)
        }
        if (totalCompletion && totalCompletion.children.length != 0 && !totalCompletion.children[0].classList.contains("MuiSkeleton-pulse")) {
            if (debug) {
                console.log("finishing runs together")
            }
            finishRunsTogether(runsTogether);
        }
    }
}

function finishRunsTogether(runsTogether) {
    runsTogetherDone = true;
    lastProfileUrl = document.location.href;
    addRunsTogetherNumbers(runsTogether);
    setTimeout(() => { recolorActivityDots(runsTogether) }, 50);

    //remove loading animation
    let animEl = document.querySelector("#runs-together-card>div.rank-card");
    if (animEl != null) {
        animEl.style.animation = "";
    }
}

/**
 * This functions adds runs together number to every raid card.
 * @author Tecanite
 * @name addRunsTogetherNumbers
 * @param {Map<string, int[]>} runsTogether
 * @returns {void}
 */
function addRunsTogetherNumbers(runsTogether) {
    let clearDivs = document.querySelectorAll(".total-completions");
    for (let node of clearDivs) {
        if (node.childNodes[0].classList != null) {
            node.childNodes[0].classList.add("total-completions");
        }
        node.style.flexDirection = "column";

        let key = node.closest(".col.l3.m6.s12").id;
        let runsTogetherSpan = document.createElement("span");
        runsTogetherSpan.innerHTML = "(" + runsTogether.get(key).size + ")";
        runsTogetherSpan.className = "together-completions";
        node.appendChild(runsTogetherSpan);
    }
}

/**
 * This functions changes color of activity dots that were completed together.
 * @author Tecanite
 * @name recolorActivityDots
 * @param {Map<string, int[]>} runsTogether
 * @returns {void}
 */
function recolorActivityDots(runsTogether) {
    // get all dots and color
    let dots = document.querySelectorAll("a.clickable.activity-dot");

    for (let dot of dots) {
        let key = dot.closest(".col.l3.m6.s12").id;
        let dotInstanceID = (dot.href.baseVal.split("/")).at(2);
        if (runsTogether.get(key).has(dotInstanceID)) {
            dot.firstChild.attributes.fill.value = "#03b6fc";
        }
    }

    // observer to recolor changing activity dots
    const recolorActivityDotsTargetNode = document.getElementById("side-container");
    const recolorActivityDotsConfig = { attributes: false, childList: true, subtree: true };
    const recolorActivityDotsCallback = (mutationList, observer) => {
        for (let mutation of mutationList) {
            if (!document.body.contains(mutation.addedNodes[0])) {
                continue;
            }
            if (mutation.type == "childList" && mutation.target.nodeName == "svg") {
                let node = mutation.addedNodes[0]
                let key = node.closest(".col.l3.m6.s12").id;
                let dotInstanceID = (node.href.baseVal.split("/")).at(2);
                if (runsTogether.get(key).has(dotInstanceID)) {
                    node.firstChild.attributes.fill.value = "#03b6fc";
                }
            }
        }
    }

    const recolorActivityDotsObserver = new MutationObserver(recolorActivityDotsCallback);
    recolorActivityDotsObserver.observe(recolorActivityDotsTargetNode, recolorActivityDotsConfig);
}