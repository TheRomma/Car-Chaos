function main(){
    app.execute();
    window.requestAnimationFrame(main);
}

const app = new Application(
    new Display("cnv", "webgl2", "root", 32)
);
const gl = app.display.context;