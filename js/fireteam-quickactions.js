/**
 * This function adds *.report buttons to player in a bungie.net fireteam.
 * @author Tecanite
 * @name addReportLinkButtons
 * @returns {void}
 */
function addReportLinkButtons() {
    let fireteam = document.getElementsByClassName("modalContainer");
    if (fireteam.length > 0) {
        let fireteamMembers = document.getElementsByClassName("Fireteam_user__c4SNE");
        for (let i = 0; i < fireteamMembers.length; i++) {
            if (fireteamMembers[i].nodeName == "DIV") {
                /* add report links */
                if (fireteamMembers[i].childNodes[1].childNodes[1].childNodes.length <= 3) {
                    let href = fireteamMembers[i].childNodes[1].childNodes[0].childNodes[0].href;
                    let rrButton = document.createElement("div");
                    rrButton.className = "FireteamTags_raid.report";
                    rrButton.style.padding = "0.1rem";
                    rrButton.innerHTML = "<a href='" + getReportLink("rr", href) + "' target=_'blank' class='FireteamTags_commendation__3EN_L rr-button' data-hover = 'raid.report'></a>";

                    fireteamMembers[i].childNodes[1].childNodes[1].appendChild(rrButton);
                }

                if (fireteamMembers[i].childNodes[1].childNodes[1].childNodes.length <= 4) {
                    let href = fireteamMembers[i].childNodes[1].childNodes[0].childNodes[0].href;
                    let drButton = document.createElement("div");
                    drButton.className = "FireteamTags_dungeon.report";
                    drButton.style.padding = "0.1rem";
                    drButton.innerHTML = "<a href='" + getReportLink("dr", href) + "' target=_'blank' class='FireteamTags_commendation__3EN_L dr-button' data-hover = 'dungeon.report'></a>";

                    fireteamMembers[i].childNodes[1].childNodes[1].appendChild(drButton);
                }
            }
        }
    }
}

/**
 * This function returns link to *.report page with valid platform and id.
 * @author Tecanite
 * @name sidebarProfilesAdd
 * @param {string} id
 * @param {string} href
 * @returns {string} 
 */
function getReportLink(id, href) {
    let frags = href.split('/')
    if (id == "rr") {
        var finalUrl = "https://raid.report/"
    } else if (id == "dr") {
        var finalUrl = "https://dungeon.report/"
    } else {
        return
    }

    if (frags[7] === "1") {
        finalUrl = finalUrl + "xb/"
    } else if (frags[7] === "2") {
        finalUrl = finalUrl + "ps/"
    } else if (frags[7] === "6") {
        finalUrl = finalUrl + "epic/"
    } else {
        finalUrl = finalUrl + "pc/"
    }
    finalUrl = finalUrl + frags[8]
    return finalUrl
}