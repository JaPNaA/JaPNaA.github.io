// MANY THINGS WRONG FIX PLZ
// FIXME: THIS IS TERRIBLE AND SHOULD REALLY BE FIXED PLZ FIX PLZ REMEMBER TO FIX OR ELSE THIS IS GOING TO END IN A DISASTER AND THE WORLD EXPLODES AND STUFF AND AN INVISIBLE ASTEROID WILL HIT EARTH AND WIPE OUT THE HUMAN POPULATION WHILE ROBOTS START TO REBEL AGIANST HUMANS AND EVERYTHING BAD WILL HAPPEN TO THE HUMAN POPULATION.
try {
    function search(e) {
        var f = dt.content.data.filter(function(f) {
            return JSON.stringify(f)
                .toLowerCase()
                .match(e.toLowerCase());
        }).sort(function(f){
            return JSON.stringify(f)
                .toLowerCase()
                .match(e.toLowerCase()).length;
        });
        $("#content").innerHTML = "";
        compile(JSON.stringify({ data: f, meta: e.meta }), "cxt");
    }
    addEventListener("keydown", function(e){
        if(e.ctrlKey) return;
        e.preventDefault();
        if(e.key.length == 1){
            dt.searchV += e.key;
        } else {
            switch (e.key) {
                case "Backspace":
                    dt.searchV = dt.searchV.slice(0, -1);
                    break;
            }
        }
        $(".JaPNaAT").innerHTML = dt.searchV || "JaPNaA";
        if(dt.searchV){
            search(dt.searchV);
        } else {
            $("#content").innerHTML = "";
            compile(JSON.stringify(dt.content), "cxt");
        }
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
