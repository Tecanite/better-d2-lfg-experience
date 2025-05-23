var api_url = "https://www.bungie.net/Platform"
var platforms = {
      1: "xb",
      2: "ps",
      3: "pc"
}

const raid_report_api_key = "2f4b6880fd6e47c89085cd8c9cd6c127"

/**
 * This function adds the sidebar div container to the raid.report page.
 * @author Tecanite
 * @name addSidebar
 * @param {String[]} profiles
 * @returns {void}
 */
function addSidebar(profiles) {
      let main = document.getElementsByTagName("main");
      if (document.location.href == "https://raid.report/") {
            if (main != null && main[0] != null && main[0].childNodes.length > 0) {
                  if (main[0].childNodes[0].id == "sidebar" && main[0].childNodes[1] != null) {
                        main[0].childNodes[1].style.paddingLeft = "4rem";
                  } else if (main[0].childNodes[0].id != "sidebar") {
                        main[0].childNodes[0].style.paddingLeft = "4rem";
                  }
            }
      } else {
            let container = document.getElementsByClassName("side-container");

            if (container != null && container[0] != null) {
                  container[0].style.paddingLeft = "4rem";
                  container[0].id = "side-container";
            }
      }
      let sidebar = document.getElementById("sidebar");
      if (sidebar == null) {
            sidebar = document.createElement("div")
            sidebar.id = "sidebar"
            sidebar.className = "drr-color"
            main[0].appendChild(sidebar);

            sidebarProfilesAdd(profiles);
      }
}

/**
 * This function adds individual profiles to the sidebar.
 * @author Tecanite
 * @name sidebarProfilesAdd
 * @param {String[]} sidebarProfiles
 * @returns {void}
 */
function sidebarProfilesAdd(sidebarProfiles) {
      for (let i = 0; i < sidebarProfiles.length; ++i) {
            let profileSlot = document.createElement("div");
            profileSlot.id = "profileSlot" + i;
            profileSlot.className = "profileSlot";
            document.getElementById("sidebar").appendChild(profileSlot);

            getPlatformAndId(sidebarProfiles[i]).then((platID) => {
                  let profileIdConverted = sidebarProfiles[i].replace(/'/g, "&#39;").replace(/"/g, "&quot;");
                  profileSlot.innerHTML = "<a href='/" + platforms[platID[0]] + "/" + platID[1] + "' class='profileSlot' data-hover = '" + profileIdConverted + "'></a>";
                  getEmblemUrl(platID[0], platID[1]).then((emblemUrl) => {
                        profileSlot.style.backgroundImage = "url('https://www.bungie.net" + emblemUrl + "')";
                  });
            });
      }
}

/**
 * This function gets platform and account id of a bungie id.
 * @author Tecanite
 * @name getEmblemUrl
 * @param {String} bungieID
 * @returns {[platform:int, id:string]}
 */
async function getPlatformAndId(bungieID) {
      const splitUsername = bungieID.split("#")

      let myHeaders = new Headers();
      myHeaders.append("x-api-key", raid_report_api_key);
      myHeaders.append("Content-Type", "application/json");

      let raw = JSON.stringify({
            "displayName": splitUsername[0],
            "displayNameCode": splitUsername[1]
      });

      let requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
      };
      return await fetch(api_url + "/Destiny2/SearchDestinyPlayerByBungieName/All/", requestOptions)
            .then(response => response.json())
            .then(result => {
                  let platform, id;
                  if (result.Response[0].crossSaveOverride != 0) {
                        platform = result.Response[0].crossSaveOverride;
                  } else {
                        platform = result.Response[0].membershipType;
                  }
                  id = result.Response[0].membershipId;
                  return [platform, id];
            })
            .catch(error => {
                  if (debugEnabled) {
                        console.debug("error getting platform and if for bungieID", error)
                  }
            })
}

/**
 * This function gets emblem URL of the last played d2 character. 
 * @author Tecanite
 * @name getEmblemUrl
 * @param {int} platform
 * @param {string} id
 * @returns {string}
 */
async function getEmblemUrl(platform, id) {
      let myInnerHeaders = new Headers();
      myInnerHeaders.append("x-api-key", raid_report_api_key);

      let requestOptions = {
            method: "GET",
            headers: myInnerHeaders,
            redirect: "follow"
      };

      return await fetch(api_url + "/Destiny2/" + platform + "/Profile/" + id + "/?components=200", requestOptions)
            .then(response => response.json())
            .then(result => {
                  let timestamps = [];
                  let charactersData = Object.entries(result.Response.characters.data);
                  //get time last played for each character
                  charactersData.forEach(character => {
                        let timestamp = character[1].dateLastPlayed;
                        timestamp = timestamp.replace(/\D/g, "");
                        timestamps.push(parseInt(timestamp));
                  })
                  // get last played character and its emblem
                  let lastPlayedCharacter = timestamps.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
                  return charactersData[lastPlayedCharacter][1].emblemPath;
            })
            .catch(error => {
                  if (debugEnabled) {
                        console.debug("error when fetching emblem for sidebar", error)
                  }
            });
}


