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