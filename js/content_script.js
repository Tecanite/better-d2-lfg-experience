/* add scripts to page */
var scriptEl = document.createElement('script');
scriptEl.src = chrome.runtime.getURL('./js/sidebar.js');
document.head.appendChild(scriptEl);

var scriptEl = document.createElement('script');
scriptEl.src = chrome.runtime.getURL('./js/container.js');
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
var sidebarProfiles = ['Tecanite#2848', 'MiNico#1510', 'Schnakeee#8573', 'Blitzy#8475', 'Failure By Design#5983', 'Dr.Honk#4473', 'Xim Apex ez Clap#2290', 'Oryx\'s onlyfans#5947']
sidebarProfilesAdd(sidebarProfiles)

observer.observe(targetNode, config)