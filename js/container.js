function updatePage() {
    /* make room for sidebar and add it */
    $('body').css({
        'padding-left': '4rem'
    });

    var sidebar = document.getElementById("sidebar")

    if (sidebar == null) {
        var sidebar = document.createElement('div')
        sidebar.id = "sidebar"
        $('body').append(sidebar);
    }

    /* remove ad banner */
    var adBanner = document.querySelector("div.jss6")
    if (adBanner != null) {
        adBanner.parentElement.removeChild(adBanner)
    }
    var adBanner = document.querySelector("div.jss12")
    if (adBanner != null) {
        adBanner.parentElement.removeChild(adBanner)
    }
}

function updateLayout(removeUselessStats) {
    /* add id to all raid cards and (3x4) => (2x6) */
    var rows = document.getElementsByClassName("row raid-row")

    if (rows.length < 5) {
        return
    }

    rows[0].childNodes[0].id = "ce"
    rows[0].childNodes[1].id = "ron"
    rows[0].childNodes[2].id = "kf"
    rows[0].childNodes[3].id = "vow"

    var vog = rows[1].firstElementChild;
    vog.id = "vog"
    rows[0].appendChild(vog)

    var dsc = rows[1].firstElementChild;
    dsc.id = "dsc"
    rows[0].appendChild(dsc)

    rows[1].childNodes[0].id = "gos"
    rows[1].childNodes[1].id = "lw"

    var cos = rows[2].firstElementChild;
    cos.id = "cos"
    rows[1].appendChild(cos)

    var sotp = rows[2].firstElementChild;
    sotp.id = "sotp"
    rows[1].appendChild(sotp)

    var sos = rows[2].firstElementChild;
    sos.id = "sos"
    rows[1].appendChild(sos)

    var eow = rows[2].firstElementChild;
    eow.id = "eow"
    rows[1].appendChild(eow)

    var lev = rows[3].firstElementChild;
    lev.id = "lev"
    rows[2].appendChild(lev)

    rows[3].parentNode.removeChild(rows[3])

    padNonMasterOrPrestigeRaids()
    removeStats(removeUselessStats)
}

function padNonMasterOrPrestigeRaids() {
    tables = document.getElementsByClassName("centered")
    for (let i = 0; i < tables.length; i += 2) {
        if (tables[i].childNodes[1].childNodes.length < 3) {
            let padding = document.createElement('tr')
            padding.innerHTML = "<th><p style='visibility: hidden;'>|</p></th><td><span class=''></span></td><td><span class=''></span></td>"
            tables[i].childNodes[1].append(padding)
        }
    }
}

function removeStats(removeUselessStats) {
    if (!removeUselessStats) {
        return
    }
    tables = document.getElementsByClassName("centered")
    for (let i = 1; i < tables.length; i += 1) {
        tables[i].parentElement.removeChild(tables[i])
    }
}

