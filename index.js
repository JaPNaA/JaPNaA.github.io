(function() {

    var DT = {},
        L = [Utils, ShortUrl];
    
    for(let i of L) {
        i(DT);
    }
    for (let i in DT) {
        let j = DT[i];
        if (j.setup) {
            j.setup();
        }
    }
}());