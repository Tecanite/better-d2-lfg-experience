/* add scripts to page */
var scriptEl = document.createElement('script');
scriptEl.src = chrome.runtime.getURL('./js/sidebar.js');
document.head.appendChild(scriptEl);

var scriptEl = document.createElement('script');
scriptEl.src = chrome.runtime.getURL('./js/container.js');
document.head.appendChild(scriptEl);


/* update layout of page */
var removeUselessStats = true;
updatePage()
updateLayout()
padNonMasterOrPrestigeRaids()
removeUselessStats ? removeStats() : 0


/* adding of sidebar */
var sidebarProfiles = ["Tecanite#2848", "MiNico#1510", "Schnakeee#8573", "Blitzy#8475", "Xim Apex ez Clap#2290"]
sidebarProfilesAdd(sidebarProfiles)

