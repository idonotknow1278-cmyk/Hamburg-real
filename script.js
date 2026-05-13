const SHUT_UP = {
    ids: [],
    names: ["Soundboard", "[!] COMMENTS", "Geometry Dash Lite (REMAKE)", "[!] SUGGEST GAMES .gg/75EFWYYAXk"]
}
  , FORCE_EXTERNAL = ["[!] SUGGEST GAMES " + "Hamburg Discord"]
  , ASSET_STATION = [{
    n: "gn-math",
    z: "https://cdn.jsdelivr.net/gh/freebuisness/assets@main/zones.json",
    c: "https://cdn.jsdelivr.net/gh/freebuisness/covers@main",
    h: "https://cdn.jsdelivr.net/gh/freebuisness/html@main"
}];
let mapped = new Map
  , cache_main = []
  , cache_v2 = []
  , lumin_data = []
  , hit_counts = {}
  , _s = {
    p_k: localStorage.getItem("panicKey") || "1",
    p_u: localStorage.getItem("panicUrl") || "https://launchpad.classlink.com/login",
    t: localStorage.getItem("cloakTitle") || "Number Problems",
    i: localStorage.getItem("cloakIcon") || "favicon.png"
};
const internal_quotes = [{
    text: "WOAH HAMBURG IS LIKE THE BEST.",
    author: "totally said by gn-math devs"
}, {
    text: "cumming soon.",
    author: "primestar"
}, {
    text: "h",
    author: "bestspark"
}, {
    text: "OMG hamburg is so tuff and the best site.",
    author: "everyone"
}, {
    text: "wait why is hamburg so peak.",
    author: "totally said by truffled devs"
}, {
    text: "W BestSpark❤️‍🩹",
    author: "primestar"
}, {
    text: "i love m-",
    author: "primestar"
}, {
    text: "block if gay highkey",
    author: "primestar"
}, {
    text: "green apple",
    author: "ishowspeed"
}, {
    text: "this site looks buns",
    author: "random loser"
}, {
    text: "thats why you have earwax in your ear🗣",
    author: "someone"
}, {
    text: "primestar needs to get his act together - i had to edit his code for him",
    author: "bestspark"
}];
function shuffle_q() {
    let e = document.getElementById("quoteText")
      , t = document.getElementById("quoteAuthor")
      , n = document.getElementById("quoteContainer")
      , a = internal_quotes[Math.floor(Math.random() * internal_quotes.length)];
    n && (n.style.opacity = 0,
    setTimeout( () => {
        e && (e.textContent = `"${a.text}"`),
        t && (t.textContent = `- ${a.author}`),
        n.style.opacity = 1
    }
    , 420))
}
async function start_hub() {
    try {
        let e = await fetch_local_overrides()
          , t = (await Promise.all(ASSET_STATION.map(e => pull_from_source(e)))).flat();
        cache_main = filter_and_map([...e, ...t]).filter(e => !is_on_shutup_list(e));
        let n = await grab_v2_data();
        if (cache_v2 = filter_and_map(n).filter(e => !is_on_shutup_list(e)),
        "undefined" != typeof Lumin)
            try {
                await Lumin.init({
                    headless: !0
                });
                let a = await Lumin.getGames({
                    page: 1,
                    limit: 500
                });
                lumin_data = a.games
            } catch (i) {
                console.warn("Lumin service down.")
            }
        await sync_popularity(),
        render_main(cache_main, cache_v2, lumin_data);
        let o = document.getElementById("zoneCount");
        o && (o.innerText = cache_main.length + cache_v2.length + lumin_data.length + " math problems loaded")
    } catch (l) {
        console.error("FATAL: Site failed to boot.", l);
        let s = document.getElementById("container");
        s && (s.innerHTML = '<div class="err-box"><h3>Proxy Error</h3><p>Try refreshing.</p></div>')
    }
}
function save(e, t) {
    _s[e] = t,
    localStorage.setItem({
        p_k: "panicKey",
        p_u: "panicUrl",
        t: "cloakTitle",
        i: "cloakIcon"
    }[e], t),
    ("t" === e || "i" === e) && run_cloak()
}
function run_cloak() {
    document.title = _s.t;
    let e = document.querySelector("link[rel*='icon']") || document.createElement("link");
    e.rel = "icon",
    e.href = _s.i,
    document.head.appendChild(e)
}
function launch_stealth() {
    let e = window.open("about:blank", "_blank");
    if (!e)
        return alert("Browser blocked the popup.");
    e.document.write(document.documentElement.outerHTML),
    e.document.close()
}
function open_settings_ui() {
    document.getElementById("popupTitle").textContent = "settings",
    document.getElementById("popupBody").innerHTML = `
        <div class="settings-container" style="display: flex; flex-direction: column; gap: 20px; max-height: 70vh; overflow-y: auto; padding-right: 5px;">
            <div class="section-group">
                <h4 style="color: var(--primary-color); margin-bottom: 10px; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px;">Tab Masking</h4>
                <div class="setting-item">
                    <label class="setting-label">Title</label>
                    <input type="text" class="setting-input" value="${_s.t}" oninput="save('t', this.value)">
                </div>
                <div class="setting-item">
                    <label class="setting-label">Favicon URL</label>
                    <input type="text" class="setting-input" value="${_s.i}" oninput="save('i', this.value)">
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px;">
                    <button class="btn btn-secondary" onclick="launch_stealth()" style="font-size: 0.8rem;"><i class="fas fa-clone"></i> About:Blank</button>
                    <a href="/dmca.html" class="btn btn-secondary" style="font-size: 0.8rem; text-decoration: none; display: flex; align-items: center; justify-content: center; background: #2c2c2c; color: #FFFFFF; border: 1px solid #444;"><i class="fas fa-shield-alt"></i> DMCA</a>
                </div>
            </div>
            <div class="section-group">
                <h4 style="color: var(--primary-color); margin-bottom: 10px; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px;">Panic Mode</h4>
                <div class="setting-item">
                    <label class="setting-label">Panic Key</label>
                    <input type="text" class="setting-input" maxlength="1" value="${_s.p_k}" oninput="save('p_k', this.value)">
                </div>
                <div class="setting-item">
                    <label class="setting-label">Redirect To</label>
                    <input type="text" class="setting-input" value="${_s.p_u}" oninput="save('p_u', this.value)">
                </div>
            </div>
            <div class="section-group">
                <h4 style="color: var(--primary-color); margin-bottom: 10px; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px;">Backup & Reset</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <button class="btn btn-secondary" onclick="export_data()"><i class="fas fa-download"></i> Export</button>
                    <label class="btn btn-secondary" style="margin:0; cursor:pointer;"><i class="fas fa-upload"></i> Import <input type="file" style="display:none" onchange="import_data(event)"></label>
                </div>
                <button class="btn" onclick="localStorage.clear(); location.reload();" style="width: 100%; margin-top: 10px; background: transparent; color: #777; border: 1px dashed #444; padding: 8px;">Reset Defaults</button>
            </div>
            <div class="credits-footer" style="border-top: 1px solid #333; padding-top: 15px; text-align: center;">
                <p style="font-weight: bold; margin-bottom: 5px;">hamburg</p>
                <p style="color: var(--text-muted); font-size: 0.8rem;">primestar</p>
                <div style="margin-top: 12px; display: flex; justify-content: center; gap: 10px;">
                   ;"><i class="fas fa-dollar-sign"></i> Tip</a>
                   <button class="btn btn-primary" onclick="show_contact()" style="padding: 5px 15px; font-size: 0.8rem;"><i class="fas fa-envelope"></i> Help</button>
                </div>
            </div>
        </div>`,
    document.getElementById("popupOverlay").style.display = "flex"
}
function show_contact() {
    document.getElementById("popupBody").innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <i class="fab fa-discord" style="font-size: 3rem; margin-bottom: 15px;"></i>
            <h3>Contact Support</h3>
            <p>Direct Message us on Discord</p>
            <a href="https://discord.gg/75EFWYYAXk" target="_blank" class="btn btn-primary" style="text-decoration: none; margin-top: 10px;">click me!</a>
            <button class="btn btn-secondary" onclick="open_settings_ui()" style="width: 100%; margin-top: 20px;">Back to Settings</button>
        </div>`
}
function filter_and_map(e) {
    let t = new Set
      , n = [];
    return e.forEach(e => {
        t.has(e.zone.id) || (t.add(e.zone.id),
        mapped.set(e.zone.id, e.source),
        n.push(e.zone))
    }
    ),
    n
}
async function pull_from_source(e) {
    try {
        let t = await fetch(e.z + "?nocache=" + Date.now())
          , n = await t.json();
        return n.map(t => ({
            zone: t,
            source: e
        }))
    } catch (a) {
        return []
    }
}
async function grab_v2_data() {
    return new Promise(e => {
        let t = document.createElement("script");
        t.src = "https://cdn.jsdelivr.net/gh/NoseyGames/data@main/zonesv2.js",
        t.onload = () => {
            if ("undefined" == typeof files)
                return e([]);
            let t = files.map(e => ({
                zone: {
                    id: e,
                    name: e.replace(/^cl-/, "").replace(/-/g, " ").split(" ").map(e => e.charAt(0).toUpperCase() + e.slice(1)).join(" "),
                    author: "UGS",
                    cover: `https://cdn.jsdelivr.net/gh/bubbls/ugs-singlefile/UGS-Files/${e}.png`,
                    is_v2_type: !0
                },
                source: ASSET_STATION[0]
            }));
            e(t)
        }
        ,
        t.onerror = () => e([]),
        document.head.appendChild(t)
    }
    )
}
async function fetch_local_overrides() {
    try {
        let e = await fetch("/customzones.json?v=" + Math.random())
          , t = await e.json();
        return t.reverse().map(e => ({
            zone: {
                ...e,
                is_ext: !0
            },
            source: ASSET_STATION[0]
        }))
    } catch (n) {
        return []
    }
}
function render_main(e, t, n) {
    let a = document.getElementById("container");
    if (!a)
        return;
    a.innerHTML = "";
    let i = document.createElement("div");
    if (i.style = "width:100%; text-align:center; padding: 20px 0; grid-column: 1/-1;",
    i.innerHTML = '<h1 style="font-weight: 800; text-transform: lowercase;"><span style="opacity:0.5;">https://discord.gg/75EFWYYAXk/</span></h1>',
    a.appendChild(i),
    grid_loop(e, a),
    n && n.length > 0) {
        let o = document.createElement("div");
        o.className = "lumin-header",
        o.style = "width:100%; text-align:center; padding: 30px 0; color: #444; grid-column: 1/-1; font-size: 0.8rem;",
        o.textContent = "credits to https://luminsdk.com",
        a.appendChild(o),
        n.forEach(e => {
            let t = document.createElement("div");
            t.className = "zone-item",
            t.onclick = () => Lumin.loadGame(e.id);
            let n = document.createElement("img");
            n.loading = "lazy",
            n.src = e.cachedCover || "/favicon.png",
            e.cachedCover || Lumin.getImageUrl(e.image_token).then(t => {
                n.src = t,
                e.cachedCover = t
            }
            ),
            n.onerror = () => {
                n.src = "/favicon.png"
            }
            ,
            t.innerHTML = `<div class="zone-info"><div class="zone-name">${e.name}</div></div>`,
            t.prepend(n),
            a.appendChild(t)
        }
        )
    }
    grid_loop(t, a)
}
function grid_loop(e, t) {
    e.forEach(e => {
        let n = document.createElement("div");
        n.className = `zone-item ${e.featured ? "is-featured" : ""}`,
        n.onclick = () => load_game_frame(e);
        let a = document.createElement("img");
        a.loading = "lazy";
        let i = mapped.get(e.id) || ASSET_STATION[0];
        a.src = e.is_ext || e.is_v2_type ? e.cover : e.cover.replace("{COVER_URL}", i.c).replace("{HTML_URL}", i.h),
        a.onerror = function() {
            this.src = "/favicon.png"
        }
        ,
        n.innerHTML = `<div class="zone-info"><div class="zone-name">${e.name}</div></div>`,
        n.prepend(a),
        t.appendChild(n)
    }
    )
}
function load_game_frame(e) {
    if (FORCE_EXTERNAL.includes(e.name))
        return window.open(e.url, "_blank");
    let t = document.getElementById("zoneViewer")
      , n = document.getElementById("zoneFrame")
      , a = document.createElement("iframe");
    a.id = "zoneFrame",
    a.allowFullscreen = !0,
    n.parentNode.replaceChild(a, n);
    let i = ""
      , o = mapped.get(e.id) || ASSET_STATION[0];
    fetch(i = e.is_v2_type ? `https://cdn.jsdelivr.net/gh/bubbls/ugs-singlefile/UGS-Files/${encodeURIComponent(e.id.endsWith(".html") ? e.id : e.id + ".html")}` : e.is_ext ? e.url : e.url.replace("{HTML_URL}", o.h)).then(e => e.text()).then(e => {
        let t = new Blob([e],{
            type: "text/html"
        })
          , n = URL.createObjectURL(t);
        a.src = n,
        a.onload = () => URL.revokeObjectURL(n)
    }
    ),
    document.getElementById("zoneName").textContent = e.name,
    document.getElementById("zoneAuthor").innerHTML = `<i class="fas fa-circle-check"></i> verfied by ${e.author}`;
    let l = document.getElementById("downloadGameBtn");
    l && (l.style.display = "gn-math" === o.n ? "inline-block" : "none",
    l.onclick = () => force_download(i, e.name)),
    t.style.display = "flex",
    document.body.style.overflow = "hidden"
}
function kill_frame() {
    document.getElementById("zoneViewer").style.display = "none",
    document.getElementById("zoneFrame").src = "about:blank",
    document.body.style.overflow = "auto"
}
function force_download(e, t) {
    fetch(e).then(e => e.blob()).then(e => {
        let n = URL.createObjectURL(e)
          , a = document.createElement("a");
        a.href = n,
        a.download = t.replace(/\s+/g, "_") + ".html",
        a.click(),
        URL.revokeObjectURL(n)
    }
    ).catch(e => alert("Couldnt download this one. Check console."))
}
function export_data() {
    let e = JSON.stringify(localStorage)
      , t = new Blob([e],{
        type: "application/json"
    })
      , n = URL.createObjectURL(t)
      , a = document.createElement("a");
    a.href = n,
    a.download = "hamburg_settings.json",
    a.click()
}
function import_data(e) {
    let t = e.target.files[0]
      , n = new FileReader;
    n.onload = e => {
        try {
            let t = JSON.parse(e.target.result);
            Object.keys(t).forEach(e => localStorage.setItem(e, t[e])),
            location.reload()
        } catch (n) {
            alert("Invalid file.")
        }
    }
    ,
    n.readAsText(t)
}
function is_on_shutup_list(e) {
    if (SHUT_UP.ids.includes(e.id))
        return !0;
    for (let t of SHUT_UP.names)
        if (e.name.toLowerCase().includes(t.toLowerCase()))
            return !0;
    return !1
}
async function sync_popularity() {
    try {
        let e = await fetch("https://data.jsdelivr.net/v1/stats/packages/gh/freebuisness/html@main/files?period=year")
          , t = await e.json();
        t.forEach(e => {
            let t = e.name.match(/\/(\d+)\.html$/);
            t && (hit_counts[parseInt(t[1])] = e.hits.total)
        }
        )
    } catch (n) {}
}
document.getElementById("settings").onclick = open_settings_ui,
document.getElementById("popupClose").onclick = () => {
    document.getElementById("popupOverlay").style.display = "none"
}
;
const search = document.getElementById("searchBar");
search && (search.oninput = e => {
    let t = e.target.value.toLowerCase();
    render_main(cache_main.filter(e => e.name.toLowerCase().includes(t)), cache_v2.filter(e => e.name.toLowerCase().includes(t)), lumin_data.filter(e => e.name.toLowerCase().includes(t)))
}
),
window.onkeydown = e => {
    e.key.toLowerCase() === _s.p_k.toLowerCase() && window.location.replace(_s.p_u),
    "Escape" === e.key && kill_frame()
}
,
shuffle_q(),
setInterval(shuffle_q, 3e4),
run_cloak(),
start_hub();
