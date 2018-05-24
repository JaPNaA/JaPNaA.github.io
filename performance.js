function PerformanceTest(DT) {
    var D = {
        dump: {a: null}
    };
    DT.PerformanceTest = D;

    D.test = function() {
        var then = performance.now(), now;

        var a;
        for (var i = 0; i < 100000; i++) {
            a = Math.sqrt(i);
            D.dump.a = a;
        }

        now = performance.now();
        return now - then;
    };
}