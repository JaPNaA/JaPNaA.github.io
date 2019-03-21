export default function triggerTransitionIn(elm: HTMLElement, timeout: number) {
    elm.classList.add("beforeTransitionIn");

    requestAnimationFrame(() =>
        requestAnimationFrame(() =>
            elm.classList.add("afterTransitionIn")
        )
    );

    setTimeout(() => {
        elm.classList.remove("beforeTransitionIn");
        elm.classList.remove("afterTransitionIn");
    }, timeout);
}