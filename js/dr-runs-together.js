var drStoredActivities;
var runsTogetherAlertRan = false;
var ownerID;
var enableRunsTogether;

var userID;
var animTimeoutID, saveTimeoutID;

var runsTogetherDone = false;
var activitiesMap;
var runsTogether;

var alreadyObservedOnce = false;

var scriptEl = document.createElement("script");
scriptEl.src = chrome.runtime.getURL("./js/runs-together-inject.js");
scriptEl.onload = function () {
    this.remove();
};
(document.head || document.documentElement).appendChild(scriptEl);

// get saved settings
chrome.storage.sync.get(["migrated", "ownProfileID", "enableRunsTogether"])
    .then((settings) => {
        if (settings.migrated == null || settings.migrated == false) {
            alert("better-d2-lfg-experience: Please visit the extension options and migrate settings to use synced storage. Using local values for now.")
            return chrome.storage.local.get(["ownProfileID", "enableRunsTogether"])
        } else {
            return settings
        }
    })
    .then((settings) => {
        ownerID = settings.ownProfileID;
        enableRunsTogether = settings.enableRunsTogether;
        if (enableRunsTogether) {
            var styleEl = document.createElement("link");
            styleEl.rel = "stylesheet";
            styleEl.type = "text/css";
            styleEl.href = chrome.runtime.getURL("./css/dr-runs-together.css");
            document.head.appendChild(styleEl);

            runsTogetherAlertRan = false;
        }

        chrome.storage.local.get(["drStoredActivities"]).then((settings) => {
            if (settings.drStoredActivities != null) {
                drStoredActivities = new Map(Object.entries(settings.drStoredActivities));
                drStoredActivities.forEach((activityArray, key) => {
                    drStoredActivities.set(key, new Set(activityArray));
                });
            } else {
                drStoredActivities = null;
            }
        })
    });

// receive message from injected script
window.addEventListener("message", function (e) {
    // console.debug("received message from injected script:", e.data.data.Response)
    if (e.data != null && e.data.data != null && e.data.data.Response != null && e.data.data.Response.destinyMemberships != null) {
        firstMembership = e.data.data.Response.destinyMemberships[0];
        userID = firstMembership.bungieGlobalDisplayName + "#" + firstMembership.bungieGlobalDisplayNameCode;

        // reset maps for activities since new profile is loaded
        activitiesMap = new Map(), runsTogether = new Map();

        for (dungeon_key of dungeons) {
            activitiesMap.set(dungeon_key, new Set()), runsTogether.set(dungeon_key, new Set());
        }

        // reset checks if runsTogether has been done and ran
        runsTogetherDone = false;
        alreadyObservedOnce = false;
    }

    if (e.data != null && e.data.data != null && e.data.data.Response != null && e.data.data.Response.activities != null) {
        let activities = e.data.data.Response.activities;
        if (activities[0].period != null) {
            sortFetchedActivities(activities);
        }
    }
});

// observer checking if page is still loading 
// finishes runsTogether once page fully loaded
const loadingObserverCallback = (_, observer) => {
    let loadingElements = document.querySelector("span.MuiSkeleton-root.MuiSkeleton-text.MuiSkeleton-pulse");

    if (!loadingElements) {
        //loading has finished
        observer.disconnect();

        // gotta wait till last request is also handled by our functions
        setTimeout(() => {
            if (ownerID == userID) {
                if (debugEnabled) {
                    console.debug("storing activities:", activitiesMap);
                }
                // make map serializable
                activitiesMap.forEach((activitySet, key) => {
                    activitiesMap.set(key, Array.from(activitySet))
                });
                chrome.storage.local.set({ drStoredActivities: Object.fromEntries(activitiesMap) }).then(() => {
                    if (debugEnabled) {
                        console.debug("saved activities!");
                    }
                });
            } else {
                if (debugEnabled) {
                    console.debug("finishing runs together")
                }
                finishRunsTogether();
            }
        }, 200);
    }
}
const loadingObserver = new MutationObserver(loadingObserverCallback);

/**
 * This function sorts all fetched activities by raids.
 * @author Tecanite
 * @name sortFetchedActivities
 * @param {Array<Activity>} activities 
 * @returns {void}
 */
function sortFetchedActivities(activities) {
    if (!enableRunsTogether || activities == []) {
        return;
    }

    activities.forEach(function (item, index, object) {
        // filter only completed activities
        if (item.values.completed.basic.value != 1 || item.values.completionReason.basic.value == 2) {
            return;
        }

        switch (item.activityDetails.directorActivityHash) {
            // equilibrium standard / contest
            case 2727361621: case 1754635208:
                activitiesMap.get("equi").add(item.activityDetails.instanceId);
                break;
            // sd standard / contest / master
            case 3834447244: case 247869137: case 3521648250:
                activitiesMap.get("sd").add(item.activityDetails.instanceId);
                break;
            // vh standard / contest / contest / master
            case 300092127: case 1915770060: case 3492566689: case 4293676253:
                activitiesMap.get("vh").add(item.activityDetails.instanceId);
                break;
            // wr standard / master
            case 2004855007: case 2534833093:
                activitiesMap.get("wr").add(item.activityDetails.instanceId);
                break;
            // gotd standard / master / rotn explorer (matchmade) / rotn explorer / rotn eternity / rotn ultimatum
            case 313828469: case 2716998124: case 4190119662: case 1094262727: case 2961030534: case 124340010:
                activitiesMap.get("gotd").add(item.activityDetails.instanceId);
                break;
            // sow standard / master / master / rotn explorer (matchmade) / rotn explorer / rotn eternity / rotn ultimatum
            case 1262462921: case 1801496203: case 2296818662: case 943878085: case 1225969316: case 4046934917: case 3339002067:
                activitiesMap.get("sow").add(item.activityDetails.instanceId);
                break;
            // dual master / standard / master
            case 1668217731: case 2823159265: case 3012587626:
                activitiesMap.get("dual").add(item.activityDetails.instanceId);
                break;
            // goa master / standard / master
            case 1112917203: case 3774021532: case 4078656646:
                activitiesMap.get("goa").add(item.activityDetails.instanceId);
                break;
            // proph standard / standard / rotn explorer (matchmade) / rotn explorer / rotn eternity / rotn ultimatum
            case 1077850348: case 4148187374: case 1788465402: case 3637651331: case 715153594: case 3193125350:
                activitiesMap.get("proph").add(item.activityDetails.instanceId);
                break;
            // poh master/ expert / normal / legend / master / master / standard
            case 785700673: case 785700678: case 1375089621: case 2559374368: case 2559374374: case 2559374375: case 2582501063:
                activitiesMap.get("poh").add(item.activityDetails.instanceId);
                break;
            // st
            case 2032534090:
                activitiesMap.get("st").add(item.activityDetails.instanceId);
                break;
            // pres standard / expert / exotic rotator standard / exotic rotator master (this is somewhat fucked since dungeon report doesn't count the new clear)
            case 2124066889: case 2113712124: case 3883295757: case 4212753278:
                activitiesMap.get("pres").add(item.activityDetails.instanceId);
                break;
            // harb
            case 1738383283:
                activitiesMap.get("harb").add(item.activityDetails.instanceId);
                break;
            // zh heroic / normal
            case 2731208666: case 3232506937:
                activitiesMap.get("zh").add(item.activityDetails.instanceId);
                break;
            // whisper normal / heroic
            case 74501540: case 1099555105:
                activitiesMap.get("whisper").add(item.activityDetails.instanceId);
                break;
            default:
                if (debugEnabled) {
                    console.debug("unknown / new activity which is currently not sorted:", item);
                }
        }
    })
    updateRunsTogether();
}

/**
 * This function computes how many runs were done together by comparing instance ids and stores them in runsTogether Map<string, Set()>.
 * @author Tecanite
 * @name updateRunsTogether
 * @returns {void}
 */
function updateRunsTogether() {
    // add observer to finish runs together once site has finished loading

    if (!alreadyObservedOnce) {
        alreadyObservedOnce = true;

        const loadingObserverTargetNode = document.getElementById("root");
        const loadingObserverConfig = { attributes: true, childList: true, subtree: true };
        loadingObserver.observe(loadingObserverTargetNode, loadingObserverConfig);
    }

    if (ownerID == userID) {
        return;
    } else {
        if (drStoredActivities == null) {
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
                if (drStoredActivities.get(key).has(item)) {
                    runsTogether.get(key).add(item);
                }
            })
        })
        addRunsTogetherCard();
    }
}
/**
 * This functions finishes adding all runsTogether elements to site.
 * @author Tecanite
 * @name finishRunsTogether
 * @returns {void}
 */
function finishRunsTogether() {
    runsTogetherDone = true;
    lastProfileUrl = document.location.href;
    addRunsTogetherCard();
    addRunsTogetherNumbers();
    setTimeout(() => { recolorActivityDots() }, 50);

    //remove loading animation
    let animEl = document.querySelector("#runs-together-card>div.rank-card");
    if (animEl != null) {
        animEl.style.animation = "";
    }
}

/**
 * This functions adds a card next to total full clears and speed rank displaying the number and "rank" of runs done together
 * @author Tecanite
 * @name addRunsTogetherCard
 * @returns {void}
 */
function addRunsTogetherCard() {
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
        } else {
            if (debugEnabled) {
                console.debug("Could not find card container to add runsTogether card")
            }
        }
    }

    let tier;
    let color;

    let countRunsTogether = 0;
    runsTogether.forEach(function (value, _) {
        countRunsTogether += value.size;
    })

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
}

/**
 * This functions adds runs together number to every raid card.
 * @author Tecanite
 * @name addRunsTogetherNumbers
 * @returns {void}
 */
function addRunsTogetherNumbers() {
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
 * @returns {void}
 */
function recolorActivityDots() {
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
    const recolorActivityDotsCallback = (mutationList, _) => {
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