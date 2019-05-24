export default function wait(milliseconds: number) {
    return new Promise(function (res) {
        setTimeout(res, milliseconds);
    });
}