function updatePage() {
    /* make room for sidebar and add it */
    $('body').css({
        'padding-left': '4rem'
    });
    var sidebar = document.createElement('div')
    sidebar.id = "sidebar"
    $('body').append(sidebar);

    /* remove ad banner */
    var adBanner = document.querySelector("div.jss6")
    adBanner.parentElement.removeChild(adBanner)
}

function updateLayout() {
    /* add id to all raid cards and (3x4) => (2x6) */
    var rows = document.getElementsByClassName("row raid-row")

    rows[0].childNodes[0].id = "ron"
    rows[0].childNodes[1].id = "kf"
    rows[0].childNodes[2].id = "vow"
    rows[0].childNodes[3].id = "vog"

    var dsc = rows[1].firstElementChild;
    dsc.id = "dsc"
    rows[0].appendChild(dsc)

    var gos = rows[1].firstElementChild;
    gos.id = "gos"
    rows[0].appendChild(gos)

    rows[1].childNodes[0].id = "lw"
    rows[1].childNodes[1].id = "cos"

    var sotp = rows[2].firstElementChild;
    sotp.id = "sotp"
    rows[1].appendChild(sotp)

    var sos = rows[2].firstElementChild;
    sos.id = "sos"
    rows[1].appendChild(sos)

    var eow = rows[2].firstElementChild;
    eow.id = "eow"
    rows[1].appendChild(eow)

    var lev = rows[2].firstElementChild;
    lev.id = "lev"
    rows[1].appendChild(lev)

    rows[3].parentElement.removeChild(rows[3])
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

function removeStats() {
    tables = document.getElementsByClassName("centered")
    for (let i = 1; i < tables.length; i += 1) {
        tables[i].parentElement.removeChild(tables[i])
    }
}