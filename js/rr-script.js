/* add scripts to page */
var scriptEl = document.createElement('script');
scriptEl.src = chrome.runtime.getURL('./js/rr-sidebar.js');
document.head.appendChild(scriptEl);

var scriptEl = document.createElement('script');
scriptEl.src = chrome.runtime.getURL('./js/rr-layout.js');
document.head.appendChild(scriptEl);


/* update layout of page with observer */
const removeUselessStats = true;

const targetNode = document.getElementById("root");
const config = { attributes: true, childList: true, subtree: true };
const callback = (mutationList, observer) => {
    updatePage()
    updateLayout(removeUselessStats)
}

const observer = new MutationObserver(callback)

updatePage()
updateLayout(removeUselessStats)



/* adding of sidebar */
chrome.storage.local.get(["sidebarProfiles"]).then((result) => {
    let sidebarProfiles = result.sidebarProfiles;
    sidebarProfilesAdd(sidebarProfiles)
    

});

observer.observe(targetNode, config)