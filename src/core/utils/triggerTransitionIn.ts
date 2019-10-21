export default function triggerTransitionIn(css: any, elm: HTMLElement, timeout: number): Promise<void> {
    elm.classList.add(css.beforeTransitionIn);

    requestAnimationFrame(() =>
        requestAnimationFrame(() =>
            elm.classList.add(css.afterTransitionIn)
        )
    );

    return new Promise(function(res) {
        setTimeout(() => {
            elm.classList.remove(css.beforeTransitionIn);
            elm.classList.remove(css.afterTransitionIn);
            res();
        }, timeout);
    });
}