class LTest{
    constructor(){
        this.timer = 0;
        this.layer = this;

        this.renderer = new Renderer(
            2500,
            4,
            new Shader(FileUtil.toString("res/shd/basic_v.glsl"), FileUtil.toString("res/shd/basic_f.glsl")),
            new Quad,
            new Texture("res/tex/vertical.png", 32, 32, 2, 0),
            0
        );
    
        let fps = GUI.create("fps", "div", "fillBox", "root");
        fps.style.left = 20+"px";
        fps.style.top = 20+"px";

        
        //console.log(tree);
        this.bounds = new AABB([0,0,0], [0,0,0]);

    }

    update(a_delta){
        this.timer += a_delta;

        let tree = new Quadtree([0, 0], [50, 50], 1);
        for(let i=0;i<2500;i++){
            let point = {
                x:Math.random()*100-50,
                y:Math.random()*100-50,
                value:i
            }
            tree.insert(point);
        }

        let fps = GUI.get("fps");
        
        let pos = app.input.cursor(app.display.magnification, app.display.dimentions, [0, 0]);
        
        this.bounds.update([-60 + pos.x, -60 + pos.y, 0], [60 + pos.x, 60 + pos.y, 0]);
        let points = [];
        tree.query(this.bounds, points);
        fps.textContent = "FPS: " + (1/a_delta).toFixed(0) + " Points drawn: " + points.length;
        
        for(let i=0;i<points.length;i++){
            let point = points[i];
            let trans = MathUtil.transMat([point.x, point.y, 0]);

            this.renderer.add(trans, 0, 0, 0, 0);
        }
        //this.renderer.add(MathUtil.transMat([25, 25, 0]), 0, 0, 0, 0);

        //console.log(app.input.cursor(app.display.magnification, app.display.dimentions, [0,0,0]));


        //DRAW

        gl.enable(gl.DEPTH_TEST);

        gl.clearColor(0.2, 0.2, 0.2, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        let size = app.display.size;
        gl.viewport(0, 0, size[0], size[1]);

        let camera = MathUtil.multiplyMatrices([app.display.ortho, MathUtil.transMat([0, 0, -10])]);
        this.renderer.draw(camera, this.timer);

        return this.layer;
    }
}