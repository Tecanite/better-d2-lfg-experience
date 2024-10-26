/**
 * This function adds *.report buttons to player in a bungie.net fireteam.
 * @author Tecanite
 * @name addReportLinkButtons
 * @returns {void}
 */
async function addReportLinkButtons() {
    let fireteam = document.getElementsByClassName("modalContainer");
    if (fireteam.length > 0) {
        let fireteamMembers = document.getElementsByClassName("Fireteam_user__2FgN2");
        for (let i = 0; i < fireteamMembers.length; i++) {
            if (fireteamMembers[i].nodeName == "DIV") {
                /* only add buttons if card is finished loading */
                if (fireteamMembers[i].style.backgroundImage == null || fireteamMembers[i].style.backgroundImage == "" || fireteamMembers[i].style.backgroundImage == 'url("undefined")') {
                    return
                }

                /* add report links (raid.report, dungeon-report, raidhub.io */
                if (fireteamMembers[i].querySelectorAll(".FireteamTags_raid_report").length == 0) {
                    let href = fireteamMembers[i].childNodes[1].childNodes[0].childNodes[0].href;
                    let rrButton = document.createElement("div");
                    rrButton.className = "FireteamTags_raid_report";
                    rrButton.style.padding = "0.1rem";
                    rrButton.innerHTML = "<a href='" + getReportLink("rr", href) + "' target=_'blank' class='OneLineItem_iconCoin__1qhvx rr-button' data-hover = 'raid.report'></a>";

                    fireteamMembers[i].childNodes[1].childNodes[1].appendChild(rrButton);
                }

                if (fireteamMembers[i].querySelectorAll(".FireteamTags_dungeon_report").length == 0) {
                    let href = fireteamMembers[i].childNodes[1].childNodes[0].childNodes[0].href;
                    let drButton = document.createElement("div");
                    drButton.className = "FireteamTags_dungeon_report";
                    drButton.style.padding = "0.1rem";
                    drButton.innerHTML = "<a href='" + getReportLink("dr", href) + "' target=_'blank' class='OneLineItem_iconCoin__1qhvx dr-button' data-hover = 'dungeon.report'></a>";

                    fireteamMembers[i].childNodes[1].childNodes[1].appendChild(drButton);
                }

                if (fireteamMembers[i].querySelectorAll(".FireteamTags_raidhub_io").length == 0) {
                    let href = fireteamMembers[i].childNodes[1].childNodes[0].childNodes[0].href;
                    let rhButton = document.createElement("div");
                    rhButton.className = "FireteamTags_raidhub_io";
                    rhButton.style.padding = "0.1rem";
                    rhButton.innerHTML = "<a href='" + getReportLink("rh", href) + "' target=_'blank' class='OneLineItem_iconCoin__1qhvx rh-button' data-hover = 'raidhub.io'></a>";

                    fireteamMembers[i].childNodes[1].childNodes[1].appendChild(rhButton);
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
        let finalUrl = "https://raid.report/"
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
    } else if (id == "dr") {
        let finalUrl = "https://dungeon.report/"
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
    } else if (id == "rh") {
        let finalUrl = "https://raidhub.io/profile/"
        finalUrl = finalUrl + frags[8]
        return finalUrl
    } else {
        return
    }




}