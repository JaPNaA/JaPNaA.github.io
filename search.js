try {
    function resetPosts() {
        var ct = $("#content");
        for (let i of dt.content.data) {
            i.element.classList.remove("hidden");
            ct.appendChild(i.element);
        }
    }
    function filterPosts(e) {
        var ct = $("#content");
        e.sort((e, f) => f.searchMatches - e.searchMatches);
        for (let i of dt.content.data) {
            if (e.includes(i)) {
                i.element.classList.remove("hidden");
            } else {
                i.element.classList.add("hidden");
            }
        }
        for (let i of e) {
            ct.appendChild(i.element);
        }
    }
    function search(e, f) {
        if (e.length == 0 && !f) {
            resetPosts();
            $(".JaPNaATL").classList.remove("search");
            return;
        } else if (f) {
            $(".JaPNaATL").classList.add("search");
            $(".JaPNaAT").innerHTML = e || dt.searchV;
            return;
        }
        var mx = 0,
            f = dt.content.data.filter(function(f) {
                var s = [],
                    q = [],
                    m;
                for (let i in f) {
                    if (i == "element") continue;
                    if (typeof f[i] == "object") {
                        q.push(f[i]);
                    } else {
                        s.push(f[i]);
                    }
                }
                for (let i of q) {
                    if (typeof i == "object") {
                        for (let j in i) {
                            q.push(i[j]);
                        }
                    } else {
                        s.push(i);
                    }
                }
                m = s
                    .join(" ")
                    .toLowerCase()
                    .match(new RegExp(e, "ig"));
                f.searchMatches = (m && m.length) || 0;
                return m;
            });
        $(".JaPNaATL").classList.add("search");
        filterPosts(f);
    }
    addEventListener("keydown", function(e) {
        if (e.ctrlKey) return;
        e.preventDefault();
        if (e.key.length == 1) {
            dt.searchV += e.key;
        } else {
            switch (e.key) {
                case "Backspace":
                    dt.searchV = dt.searchV.slice(0, -1);
                    break;
            }
        }
        $(".JaPNaAT").innerHTML = dt.searchV || "JaPNaA";
        search(dt.searchV);
    });
    $("#search").addEventListener("click", function() {
        var e = document.createElement("input");
        document.body.appendChild(e);
        e.style.position = "fixed";
        e.style.top = "-128px";
        e.style.opacity = 0;
        e.focus();
        e.addEventListener("blur", function(){
            this.parentElement.removeChild(this);
        });
        search("", 1);
    });
} catch (e) {
    console.error(e);
    try {
        prompta(e);
    } catch (e) {}
    dt.fallback.push(!1);
} finally {
    dt.fallback.push(!0);
}
