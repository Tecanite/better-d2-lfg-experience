var api_key = "41bf571cea84481eb853af82101e7230"
var api_url = "https://www.bungie.net/Platform"
var platforms = {
      1: "xb",
      2: "ps",
      3: "pc"
}

async function sidebarProfilesAdd(sidebarProfiles) {
      for (let i = 0; i < sidebarProfiles.length; ++i) {
            var profileSlot = document.createElement('div')
            const splitUsername = sidebarProfiles[i].split("#")

            var myHeaders = new Headers();
            myHeaders.append("x-api-key", api_key);
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                  "displayName": splitUsername[0],
                  "displayNameCode": splitUsername[1]
            });

            var requestOptions = {
                  method: 'POST',
                  headers: myHeaders,
                  body: raw,
                  redirect: 'follow'
            };

            await fetch(api_url + "/Destiny2/SearchDestinyPlayerByBungieName/All/", requestOptions)
                  .then(response => response.json())
                  .then(async result => {
                        let platform, id
                        if (result.Response[0].crossSaveOverride != 0) {
                              platform = result.Response[0].crossSaveOverride
                        } else {
                              platform = result.Response[0].membershipType
                        }
                        id = result.Response[0].membershipId

                        profileSlot.innerHTML = "<a href='https://raid.report/" + platforms[platform] + "/" + id + "' class='profileSlot'></a>"
                        profileSlot.className = "profileSlot"
                        profileSlot.id = "profileSlot" + i

                        var myInnerHeaders = new Headers();
                        myInnerHeaders.append("x-api-key", "41bf571cea84481eb853af82101e7230");

                        var requestOptions = {
                              method: 'GET',
                              headers: myInnerHeaders,
                              redirect: 'follow'
                        };

                        var emblemUrl
                        await fetch(api_url + "/Destiny2/" + platform + "/Profile/" + id + "/?components=200", requestOptions)
                              .then(response => response.json())
                              .then(result => {
                                    // console.log(result)
                                    var timestamps = []
                                    let charactersData = Object.entries(result.Response.characters.data)
                                    // console.log(charactersData)
                                    charactersData.forEach(character => {
                                          let timestamp = character[1].dateLastPlayed
                                          timestamp = timestamp.replace(/\D/g, '')
                                          timestamps.push(parseInt(timestamp))
                                    })
                                    // console.log(timestamps)
                                    var lastPlayedCharacter = timestamps.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
                                    emblemUrl = charactersData[lastPlayedCharacter][1].emblemPath
                                    // console.log(emblemUrl)
                                    profileSlot.style.backgroundImage = "url('https://www.bungie.net" + emblemUrl + "')"
                              })
                              .catch(error => console.log('error', error));
                  })
                  .then(() => {
                        document.getElementById('sidebar').appendChild(profileSlot);
                  })
                  .catch(error => console.log('error', error))
      }
}
