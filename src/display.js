class Display{
    constructor(a_cnv, a_ctx, a_destination, a_height){
        window.onload = ()=>{
            //document.getElementById("loader").remove();
            document.getElementById("loader").className = "hide";
            this.update();
            window.addEventListener("resize", ()=>{
                this.update();
            }, false);
        }
        this.id = a_cnv;
        this.destination = a_destination;
        this.canvas = document.createElement("canvas");
        this.canvas.id = this.id;
        this.context = this.canvas.getContext(a_ctx);
        this.maxHeight = a_height;
        this.projection = {
            ortho:MathUtil.orthoMat(0, 4, 0, 3, 0.1, 100),
            perspective:null
        };
        document.getElementById(a_destination).appendChild(this.canvas);
    }

    update(){
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        let height = this.maxHeight;
        let width = this.aspect * height;

        this.projection.ortho = MathUtil.orthoMat(-width/2, width/2, -height/2, height/2, 0.1, 100.0);
    }

    toggleFullscreen(){
        let element = document.documentElement;
        let isFullscreen = (document.fullscreenElement != null);
        if(!isFullscreen){
            element.requestFullscreen();
        }else{
            document.exitFullscreen();
        }
    }

    get size(){
        return [this.canvas.width, this.canvas.height];
    }

    get dimentions(){
        return [this.maxHeight * this.aspect, this.maxHeight];
    }

    get aspect(){
        return this.canvas.width / this.canvas.height;
    }

    get ortho(){
        return this.projection.ortho;
    }

    get magnification(){
        let multiplier = this.maxHeight / this.canvas.height;
        return multiplier;
    }
}