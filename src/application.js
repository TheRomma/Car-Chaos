class Application{
    constructor(a_display){
        this.layer = null;
        this.display = a_display;
        this.input = new Input;

        this.startTime = Date.now();
        this.delta = 0;
        this.runTime = 0;
        this.oldTime = 0;
    }

    init(a_layer){
        this.layer = a_layer;
    }
    
    execute(){
        this.calcDelta();

        this.layer = this.layer.update(this.delta / 1000);
    }

    calcDelta(){
        this.runTime = Date.now() - this.startTime;
        this.delta = this.runTime - this.oldTime;
        this.oldTime = this.runTime;
    }
}