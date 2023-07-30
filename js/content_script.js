$('body').css({
      'padding-left': '4rem'
});
var sidebar = document.createElement('div')
sidebar.id = "sidebar"
$('body').append(sidebar);

let api_key = "41bf571cea84481eb853af82101e7230"
let base_url = "https://www.bungie.net/Platform"

let sidebarProfiles = ["Tecanite#2848", "MiNico#1510"]


sidebarProfiles.forEach((profile) => {
      var myHeaders = new Headers();
      myHeaders.append("x-api-key", api_key);
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
            "displayName": "Tecanite",
            "displayNameCode": 2848
      });

      var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
      };

      fetch(base_url + "/Destiny2/SearchDestinyPlayerByBungieName/All/", requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
})


var profileSlot1 = document.createElement('div')
profileSlot1.innerHTML = "<a href='https://raid.report/pc/4611686018493851850' class='profileSlot'></a>"
profileSlot1.className = "profileSlot"
profileSlot1.id = "profileSlot1"
profileSlot1.style.backgroundImage = "url('https://www.bungie.net/common/destiny2_content/icons/3cf8e1c3d18f4a3929da57fc58aa9c0a.jpg')"
document.getElementById('sidebar').appendChild(profileSlot1);

var profileSlot2 = document.createElement('div')
profileSlot2.innerHTML = "<a href='https://raid.report/pc/4611686018483741583' class='profileSlot'></a>"
profileSlot2.className = "profileSlot"
profileSlot2.id = "profileSlot2"
profileSlot2.style.backgroundImage = "url('https://www.bungie.net/common/destiny2_content/icons/82aa0e4a15b1fc9969f48dac8116fad5.jpg')"
document.getElementById('sidebar').appendChild(profileSlot2);