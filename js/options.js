/* 
    src: https://developer.chrome.com/docs/extensions/develop/ui/options-page?hl=d
*/

// Saves options to chrome.storage
const saveOptions = () => {
    let profileList = document.getElementById('rr-sidebar-profiles');
    let profileElements = profileList.getElementsByTagName('li')
    var profiles = [];
    for (let i = 0; i < profileElements.length; i++) {
        profiles.push(profileElements[i].innerHTML);
    }
    
    chrome.storage.local.set({ sidebarProfiles: profiles }).then(() => {
        console.log("Value is set");
        const status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(() => {
            status.textContent = '';
        }, 1000);
    });

};
  
// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
const restoreOptions = () => {
    chrome.storage.local.get(["sidebarProfiles"]).then((result) => {
        let sidebarProfiles = result.sidebarProfiles;
        let profileList = document.getElementById('rr-sidebar-profiles');
        for (let i = 0; i < sidebarProfiles.length; i++) {
            let profile = document.createElement('li');
            profile.contentEditable = "true";
            profile.innerHTML = sidebarProfiles[i];
            profileList.appendChild(profile);
        }

    });
};





const addProfile = () => {
    let sidebarList = document.getElementById('rr-sidebar-profiles');
    let profile = document.createElement('li');
    profile.contentEditable = "true";
    profile.innerHTML = "Edit ME!";
    sidebarList.appendChild(profile);
};

const removeLastProfile = () => {
    let sidebarList = document.getElementById('rr-sidebar-profiles');
    sidebarList.removeChild(sidebarList.lastChild);
};
  
document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
document.getElementById('addProfile').addEventListener('click', addProfile);
document.getElementById('removeProfile').addEventListener('click', removeLastProfile);