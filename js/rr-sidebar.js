var api_key = "41bf571cea84481eb853af82101e7230"
var api_url = "https://www.bungie.net/Platform"
var platforms = {
      1: "xb",
      2: "ps",
      3: "pc"
}

function addSidebar(profiles) {
      var main = document.getElementsByTagName("main");
      var container = document.getElementsByClassName("side-container")
      if(container[0] != null) {
            container[0].style.paddingLeft = "4rem"
      }

      let sidebar = document.getElementById("sidebar");
      if (sidebar == null) {
            sidebar = document.createElement("div")
            sidebar.id = "sidebar"
            sidebar.className = "drr-color"
            main[0].appendChild(sidebar);

            if (profiles == null) {
                  sidebarProfilesAdd([]);
            } else {
                  sidebarProfilesAdd(profiles)
            }
      }
}

async function sidebarProfilesAdd(sidebarProfiles) {
      var sidebarCache;
      chrome.storage.local.get(["sidebarCache"])
            .then((result) => {
                  if (result.sidebarCache != null) {
                        sidebarCache = new Map(Object.entries(result.sidebarCache));
                  } else {
                        sidebarCache = new Map();
                  }
            })
            .then(async () => {
                  for (let i = 0; i < sidebarProfiles.length; ++i) {
                        var profileSlot = document.createElement('div')

                        if(sidebarCache != null && sidebarCache.has(sidebarProfiles[i])) {
                              console.log("cache hit :)");
                              let currentProfile = sidebarCache.get(sidebarProfiles[i]);
                              profileSlot.innerHTML = currentProfile[0];
                              profileSlot.className = "profileSlot";
                              profileSlot.id = "profileSlot" + i;
                              profileSlot.style.backgroundImage = currentProfile[1];
                              document.getElementById("sidebar").appendChild(profileSlot);
                        } else {
                              console.log("cache miss :(");
                              var cache = [];
                              const splitUsername = sidebarProfiles[i].split("#")
            
                              var myHeaders = new Headers();
                              myHeaders.append("x-api-key", api_key);
                              myHeaders.append("Content-Type", "application/json");
                  
                              var raw = JSON.stringify({
                                    "displayName": splitUsername[0],
                                    "displayNameCode": splitUsername[1]
                              });
                  
                              var requestOptions = {
                                    method: "POST",
                                    headers: myHeaders,
                                    body: raw,
                                    redirect: "follow"
                              };
                  
                              await fetch(api_url + "/Destiny2/SearchDestinyPlayerByBungieName/All/", requestOptions)
                                    .then(response => response.json())
                                    .then(async result => {
                                          let platform, id;
                                          if (result.Response[0].crossSaveOverride != 0) {
                                                platform = result.Response[0].crossSaveOverride
                                          } else {
                                                platform = result.Response[0].membershipType
                                          }
                                          id = result.Response[0].membershipId
                                          profileIdConverted = sidebarProfiles[i].replace("\'", "&#39;")
                                          profileSlot.innerHTML = "<a href='/" + platforms[platform] + "/" + id + "' class='profileSlot' data-hover = '" + profileIdConverted + "'></a>"
                                          profileSlot.className = "profileSlot";
                                          profileSlot.id = "profileSlot" + i;

                                          cache.push(profileSlot.innerHTML);
                  
                                          var myInnerHeaders = new Headers();
                                          myInnerHeaders.append("x-api-key", "41bf571cea84481eb853af82101e7230");
                  
                                          var requestOptions = {
                                                method: "GET",
                                                headers: myInnerHeaders,
                                                redirect: "follow"
                                          };
                  
                                          var emblemUrl;
                                          await fetch(api_url + "/Destiny2/" + platform + "/Profile/" + id + "/?components=200", requestOptions)
                                                .then(response => response.json())
                                                .then(result => {
                                                      // console.log(result)
                                                      var timestamps = []
                                                      let charactersData = Object.entries(result.Response.characters.data)
                                                      // console.log(charactersData)
                                                      charactersData.forEach(character => {
                                                            let timestamp = character[1].dateLastPlayed
                                                            timestamp = timestamp.replace(/\D/g, "")
                                                            timestamps.push(parseInt(timestamp))
                                                      })
                                                      // console.log(timestamps)
                                                      var lastPlayedCharacter = timestamps.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
                                                      emblemUrl = charactersData[lastPlayedCharacter][1].emblemPath
                                                      // console.log(emblemUrl)
                                                      profileSlot.style.backgroundImage = "url('https://www.bungie.net" + emblemUrl + "')"

                                                      cache.push(profileSlot.style.backgroundImage);
                                                })
                                                .catch(error => console.log("error", error));
                                    })
                                    .then(() => {
                                          document.getElementById("sidebar").appendChild(profileSlot);
                                          sidebarCache.set(sidebarProfiles[i], cache);
                                    })
                                    .catch(error => console.log("error", error))
                              }
                  }
            })
            .then(() => {
                  chrome.storage.local.set({sidebarCache: Object.fromEntries(sidebarCache)}).then(() => {
                        console.log("saved sidebar cache!");
                  });  
            })
              
}
