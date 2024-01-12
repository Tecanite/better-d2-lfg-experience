/**
 * TODO fix hover on new badge
*/

var debug = false;

var cachedActivities;
var ownerID;
var enableRunsTogether;

var allActivities = [];
var userID, lastUserID;
var animTimeoutID, saveTimeoutID;

var runsTogetherDone = false;
var ce, ron, kf, votd, vog, dsc, gos, lw, cos, sotp, sos, eow, lev;
var activitiesMap;

var scriptEl = document.createElement("script");
scriptEl.src = chrome.runtime.getURL("./js/rr-runs-together-inject.js");
scriptEl.onload = function () {
    this.remove();
};
(document.head || document.documentElement).appendChild(scriptEl);


// get saved settings
chrome.storage.local.get(["ownProfileID", "cachedActivities", "enableRunsTogether"])
    .then((settings) => {
        ownerID = settings.ownProfileID;
        enableRunsTogether = settings.enableRunsTogether;
        if (settings.cachedActivities != null) {
            cachedActivities = new Map(Object.entries(settings.cachedActivities));
        } else {
            cachedActivities = null;
        }
        if (enableRunsTogether) {
            var styleEl = document.createElement("link");
            styleEl.rel = "stylesheet";
            styleEl.type = "text/css";
            styleEl.href = chrome.runtime.getURL("./css/rr-runs-together.css");
            document.head.appendChild(styleEl);
        }
    });

// receive message from injected script
window.addEventListener("message", function (e) {
    if (e.data.data.Response != null && e.data.data.Response.bungieNetUser != null) {
        userID = e.data.data.Response.bungieNetUser.uniqueName;
        allActivities = [];

        if (userID != lastUserID || lastUserID == null) {
            ce = [], ron = [], kf = [], votd = [], vog = [], dsc = [], gos = [], lw = [], cos = [], sotp = [], sos = [], eow = [], lev = [];
            activitiesMap = new Map();
            runsTogetherDone = false;
        }
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
        if (item.values.completed.basic.value != 1) {
            return;
        }

        switch (item.activityDetails.directorActivityHash) {
            case 4179289725: case 1507509200: case 4103176774: case 156253568:// ce normal / master / guided / contest
                if (!ce.includes(item.activityDetails.instanceId)) {
                    ce.push(item.activityDetails.instanceId);
                }
                break;
            case 2381413764: case 2918919505: case 1191701339: // ron normal / master / guided
                if (!ron.includes(item.activityDetails.instanceId)) {
                    ron.push(item.activityDetails.instanceId);
                }
                break;
            case 1374392663: case 2964135793: case 3257594522: case 2897223272: case 1063970578: // kf normal / master / master / guided / challenge
                if (!kf.includes(item.activityDetails.instanceId)) {
                    kf.push(item.activityDetails.instanceId);
                }
                break;
            case 1441982566: case 4217492330: case 3889634515: case 4156879541: // vow normal / master / master / guided
                if (!votd.includes(item.activityDetails.instanceId)) {
                    votd.push(item.activityDetails.instanceId);
                }
                break;
            case 3881495763: case 1681562271: case 3022541210: case 3711931140: case 1485585878: // vog normal / master / master / guided / challenge
                if (!vog.includes(item.activityDetails.instanceId)) {
                    vog.push(item.activityDetails.instanceId);
                }
                break;
            case 910380154: case 3976949817: // deep stone crypt normal / guided
                if (!dsc.includes(item.activityDetails.instanceId)) {
                    dsc.push(item.activityDetails.instanceId);
                }
                break;
            case 3458480158: case 1042180643: case 2659723068: case 2497200493: case 3845997235: // gos normal / new div / old div / guided / guided
                if (!gos.includes(item.activityDetails.instanceId)) {
                    gos.push(item.activityDetails.instanceId);
                }
                break;
            case 2122313384: case 1661734046:  //lw normal / guided
                if (!lw.includes(item.activityDetails.instanceId)) {
                    lw.push(item.activityDetails.instanceId);
                }
                break;
            case 3333172150: case 960175301: // cos normal / guided
                if (!cos.includes(item.activityDetails.instanceId)) {
                    cos.push(item.activityDetails.instanceId);
                }
                break;
            case 548750096: case 2812525063: // sotp normal / guided
                if (!sotp.includes(item.activityDetails.instanceId)) {
                    sotp.push(item.activityDetails.instanceId);
                }
                break;
            case 119944200: case 3213556450: case 3004605630: // sos normal / prestige / guided
                if (!sos.includes(item.activityDetails.instanceId)) {
                    sos.push(item.activityDetails.instanceId);
                }
                break;
            case 3089205900: case 809170886: case 2164432138: // eow normal / prestige / guided
                if (!eow.includes(item.activityDetails.instanceId)) {
                    eow.push(item.activityDetails.instanceId);
                }
                break;
            case 2693136600: case 2693136601: case 2693136602: case 2693136603: case 2693136604: case 2693136605: // lev normal
            case 757116822: case 3879860661: case 2449714930: case 417231112: case 3446541099: case 1685065161: // lev prestige     //! WTF Bungie
            case 1699948563: case 3916343513: case 4039317196: case 89727599: case 1875726950: case 287649202: // lev guided
                if (!lev.includes(item.activityDetails.instanceId)) {
                    lev.push(item.activityDetails.instanceId);
                }
                break;
        }
    })
    // create map for easy access
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
            var existing = [4179289725, 1507509200, 4103176774, 156253568, 2381413764, 2918919505, 1191701339, 1374392663, 2964135793, 3257594522, 2897223272,
                1063970578, 1441982566, 4217492330, 3889634515, 4156879541, 3881495763, 1681562271, 3022541210, 3711931140, 1485585878, 910380154,
                3976949817, 3458480158, 1042180643, 2659723068, 2497200493, 2122313384, 1661734046, 3333172150, 548750096, 2812525063, 119944200,
                3213556450, 3089205900, 809170886, 2693136600, 2693136601, 2693136602, 2693136603, 2693136604, 2693136605, 757116822, 3879860661,
                2449714930, 417231112, 3446541099, 1685065161, 960175301, 3845997235, 2164432138, 1699948563, 3916343513, 4039317196, 89727599,
                1875726950, 3004605630, 287649202];
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
            chrome.storage.local.set({ cachedActivities: Object.fromEntries(activitiesMap) }).then(() => {
                console.log("saved activities!");
            });
        }, 3000)
    } else {
        var runsTogetherCard = document.getElementById("runs-together-card");

        if (runsTogetherCard == null) {
            runsTogetherCard = document.createElement("div");
            runsTogetherCard.className = "col s6 runs-together-padding";
            runsTogetherCard.id = "runs-together-card"

            let innerDiv = document.createElement("div");
            innerDiv.className = "card rank-card";
            innerDiv.title = "???";
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

        var countRunsTogether = 0;
        var runsTogether = new Map();

        runsTogether.set("ce", []);
        runsTogether.set("ron", []);
        runsTogether.set("kf", []);
        runsTogether.set("votd", []);
        runsTogether.set("vog", []);
        runsTogether.set("dsc", []);
        runsTogether.set("gos", []);
        runsTogether.set("lw", []);
        runsTogether.set("cos", []);
        runsTogether.set("sotp", []);
        runsTogether.set("sos", []);
        runsTogether.set("eow", []);
        runsTogether.set("lev", []);

        if (cachedActivities == null) {
            alert("Please visit own raid.report once and let it fully load to cache activities")
            return;
        }

        activitiesMap.forEach(function (value, key) {
            value.forEach(item => {
                if (cachedActivities.get(key).includes(item)) {
                    countRunsTogether++;
                    runsTogether.get(key).push(item);
                }
            })
        })

        let tier;
        let title;
        let color;

        if (countRunsTogether >= 500) {
            tier = "Challenger";
            title = "God Tier Gamer";
            color = "rgb(250, 87, 111)";
        } else if (countRunsTogether >= 250) {
            tier = "Master";
            title = "Gamer Gamer";
            color = "rgb(250, 87, 111)";
        } else if (countRunsTogether >= 100) {
            tier = "Diamond";
            title = "Gamer";
            color = "rgb(4, 138, 180)";
        } else if (countRunsTogether >= 50) {
            tier = "Platinum";
            title = "Friend";
            color = "rgb(4, 177, 161)";
        } else if (countRunsTogether >= 25) {
            tier = "Gold";
            title = "Friend";
            color = "rgb(250, 188, 68)";
        } else if (countRunsTogether >= 10) {
            tier = "Silver";
            title = "I think I know this guy";
            color = "rgb(158, 163, 176)";
        } else if (countRunsTogether >= 1) {
            tier = "Bronze";
            title = "That name sounds familiar";
            color = "rgb(106, 91, 63)";
        } else {
            tier = "Unranked";
            title = "???";
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
            innerCard.title = title;
            innerCard.style.backgroundColor = color;
        }
        if (document.location.href == lastProfileUrl) {
            finishRunsTogether(runsTogether);
        } else {
            clearTimeout(animTimeoutID);
            animTimeoutID = setTimeout(function () {
                finishRunsTogether(runsTogether);
            }, 3000);
        }
    }
}

function finishRunsTogether(runsTogether) {
    runsTogetherDone = true;
    lastProfileUrl = document.location.href;
    addRunsTogetherNumbers(runsTogether);
    recolorActivityDots(runsTogether);

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
        node.classList.remove("total-completions", "center", "centered-content");
        let key = node.closest(".col.l3.m6.s12").id;

        let totalClearDiv = document.createElement("div");
        totalClearDiv.className = "total-completions center";
        totalClearDiv.innerHTML = node.innerHTML;

        node.firstChild.remove();
        node.append(totalClearDiv);

        let runsTogetherDiv = document.createElement("div");
        runsTogetherDiv.className = "together-completions center";
        runsTogetherDiv.innerHTML = "<span>(" + runsTogether.get(key).length + ")</span>";
        node.append(runsTogetherDiv);
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
    let activityDots = document.getElementsByTagName("svg");
    for (let raidDots of activityDots) {
        for (let node of raidDots.childNodes) {
            if (node.nodeName == "a") {
                let key = node.closest(".col.l3.m6.s12").id;
                let dotInstanceID = (node.href.baseVal.split("/")).at(2);

                if (runsTogether.get(key).includes(dotInstanceID)) {
                    node.firstChild.attributes.fill.value = "#03b6fc";
                }
            }
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
                if (runsTogether.get(key).includes(dotInstanceID)) {
                    node.firstChild.attributes.fill.value = "#03b6fc";
                }
            }
        }
    }

    const recolorActivityDotsObserver = new MutationObserver(recolorActivityDotsCallback);
    recolorActivityDotsObserver.observe(recolorActivityDotsTargetNode, recolorActivityDotsConfig);
}