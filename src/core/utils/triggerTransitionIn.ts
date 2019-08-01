export default function triggerTransitionIn(elm: HTMLElement, timeout: number): Promise<void> {
    elm.classList.add("beforeTransitionIn");

    requestAnimationFrame(() =>
        requestAnimationFrame(() =>
            elm.classList.add("afterTransitionIn")
        )
    );

    return new Promise(function(res) {
        setTimeout(() => {
            elm.classList.remove("beforeTransitionIn");
            elm.classList.remove("afterTransitionIn");
            res();
        }, timeout);
    });
}