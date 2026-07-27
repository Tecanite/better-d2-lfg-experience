var scriptEl = document.createElement("script");
scriptEl.src = chrome.runtime.getURL("./js/intercept-response-inject.js");
scriptEl.onload = function () {
    this.remove();
};
(document.head || document.documentElement).appendChild(scriptEl);

const FEAT_HASHES = {
    3123804375: {
        name: "Feat: Token Limit",
        description: "Fewer Revive Tokens are available per encounter.",
        icon: "/common/destiny2_content/icons/98a11e4374408c278c1c27d969b0baf6.png"
    },
    251257575: {
        name: "Feat: Phase Limit",
        description: "Complete each encounter within a certain amount of time or phases.",
        icon: "/common/destiny2_content/icons/eb5f0fbef1586bc126d3f576314c3717.png"
    },
    2392637702: {
        name: "Feat: Battalions",
        description: "Additional powerful combatants will appear during encounters.",
        icon: "/common/destiny2_content/icons/5ef1a2c1609ac3ca71e7133a10bc15b7.png"
    },
    991354116: {
        name: "Feat: Encounter Challenges",
        description: "Each encounter within the activity will have an additional enforced mechanical challenge.",
        icon: "/common/destiny2_content/icons/abd115c421b94ca240ab7217f34dacce.png"
    },
    2673088233: {
        name: "Feat: Cutthroat Combat",
        description: "All combatants are tougher and more aggressive.",
        icon: "/common/destiny2_content/icons/f20f99510b4a4303b65718425e08472f.png"
    }
};

window.addEventListener("message", function (e) {
    if (e.data != null && e.data.data != null && e.data.data.Response != null && e.data.data.Response.activityDetails != null) {
        let res = e.data.data.Response;
        if (res.selectedSkullHashes != null) {
            let uniqueFeatHashes = new Set(res.selectedSkullHashes);
            renderFeatBadges(uniqueFeatHashes);
        } else {
            // no feats
            return;
        }
    }
});

function renderFeatBadges(activeFeats) {
    if (activeFeats.size == 0) {
        return;
    }
    let titleWrapper = document.querySelector('.pgcr-activity-row .valign-wrapper');
    if (!titleWrapper) return;


    // remove any existing badges
    let existing_feat_badges = titleWrapper.querySelector('.feat-badges');
    if (existing_feat_badges) {
        existing_feat_badges.remove();
    }

    const badgeContainer = document.createElement('div');
    badgeContainer.className = 'feat-badges';
    badgeContainer.style.display = 'flex';
    badgeContainer.style.alignItems = 'center';
    badgeContainer.style.gap = '2px';
    badgeContainer.style.marginLeft = '8px';


    activeFeats.forEach(skull_hash => {
        let feat = FEAT_HASHES[skull_hash];
        if (feat) {
            const wrapper = document.createElement('span');
            wrapper.className = 'feat-badge';
            wrapper.dataset.hover = feat.name;

            const img = document.createElement('img');
            img.src = 'https://www.bungie.net' + feat.icon;
            img.style.width = '2.25em';
            img.style.height = '2.25em';
            img.style.filter = 'drop-shadow(0 0 1px rgba(0,0,0,0.8)) drop-shadow(0 0 1px rgba(0,0,0,0.8))';
            img.style.display = 'block';

            wrapper.appendChild(img);
            badgeContainer.appendChild(wrapper);
        }
    });
    titleWrapper.appendChild(badgeContainer);
}