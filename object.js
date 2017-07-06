// "Compile" function will send data here.
function obj(e) {
    switch (e.type) {
        case "card":
            return iCard(e);
            break;
        case "text":
            return iText(e);
        default:
            console.warn(e,
                "is: not formatted correctly, corrupt, or not an object.");
    }
}

function fRead(e) {
    var a = JSON.parse(e),
        f = [];
    console.log(a);
    a.data.forEach(function(o) {
        f.push(obj(o));
    });
    return f;
}

function iCard(e) {
    var f = $("<div class='item card displayOpen'>");
    f.innerHTML = e.name + "<div class='cardTag'>"+e.tags.join(", ")+"</div>";
    return f;
}

function iText(e) {
    var f = $("<div class='item text displayOpen'>");
    f.innerHTML = e.content;
    return f;
}

function fAnimate(e, f) {
    $("#content").appendChild(e);
    setTimeout(() => {
        e.animate([{
            opacity: 0,
            top: "64px"
        }, {
            opacity: 1,
            top: 0
        }], {
            duration: 750,
            iterations: 1,
            easing: "ease"
        });
        e.classList.remove("displayOpen");
    }, f);
}
