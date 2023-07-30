var scriptEl = document.createElement('script');
scriptEl.src = chrome.runtime.getURL('./js/sidebar.js');
document.head.appendChild(scriptEl);


var sidebarProfiles = ["Tecanite#2848","MiNico#1510","Schnakeee#8573","Blitzy#8475","Xim Apex ez Clap#2290"]

$('body').css({
      'padding-left': '4rem'
});
var sidebar = document.createElement('div')
sidebar.id = "sidebar"
$('body').append(sidebar);

sidebarProfilesAdd(sidebarProfiles)
