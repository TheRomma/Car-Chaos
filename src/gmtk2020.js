//RESOURCES

const res = Object.create(null);
res["tex_splash_title"] = new Texture("res/tex/splash_title.png", 192, 112, 3, 0);
res["tex_ghost"] = new Texture("res/tex/ghost.png", 32, 32, 1, 0);
res["tex_entities"] = new Texture("res/tex/entities.png", 32, 32, 4, 0);
res["tex_actions"] = new Texture("res/tex/actions.png", 16, 16, 12, 0);
res["tex_menu_title"] = new Texture("res/tex/menu_title.png", 416, 64, 1, 0);
res["tex_ground"] = new Texture("res/tex/ground.png", 256, 256, 1, 0);
res["shd_basic"] = new Shader(FileUtil.toString("res/shd/basic_v.glsl"), FileUtil.toString("res/shd/basic_f.glsl"));
res["msh_quad"] = new Quad;

//LAYERS

class LSplash{
    constructor(){
        this.timer = 0;
        this.layer = this;

        this.renderer = new Renderer(
            10,
            4,
            res["shd_basic"],
            res["msh_quad"],
            res["tex_splash_title"],
            0
        );
        this.anim = new Animation([0, 1, 2], [0.2], true);
        

        //this.angle = -3.14 / 2;
        this.angle = 0;
    }

    update(a_delta){
        this.timer += a_delta;

        this.anim.update(a_delta);

        /*if(this.timer > 1.0 && this.timer < 2.0){
            this.angle += 3.14/2 * a_delta;
        }else if(this.timer > 4.0 && this.timer < 5.0){
            this.angle += 3.14/2 * a_delta;
        }*/
        if(this.timer >= 5.0){
            this.layer = new LMenu;
        }

        //let rotation = MathUtil.yRotationMat(this.angle);

        let scale = MathUtil.scaleMat([20, 16, 1]);
        //let model = MathUtil.multiplyMatrices([scale, rotation]);

        this.renderer.add(scale, this.anim.getFrame, 2, 0.01, 0);

        this.draw(a_delta);

        return this.layer;
    }

    draw(a_delta){
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.DEPTH_TEST);
        /*gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.FRONT);
        gl.frontFace(gl.CCW);*/

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        let size = app.display.size;
        gl.viewport(0, 0, size[0], size[1]);

        let camera = MathUtil.multiplyMatrices([app.display.ortho, MathUtil.transMat([0, 0, -10])]);
        this.renderer.draw(camera, this.timer);
    }
}

class LMenu{
    constructor(){
        this.timer = 0;
        this.layer = this;

        this.renderer = new Renderer(
            60,
            4,
            res["shd_basic"],
            res["msh_quad"],
            res["tex_menu_title"],
            0
        );

        let menucontainer = GUI.create("menucontainer", "div", "clearFlex", "root");
        //menucontainer.justifyContent = "center";
        //menucontainer.alignItems = "center";

        let playButton = GUI.create("playButton", "div", "relBox", "menucontainer");
        //playButton.style.left = 0+"%";
        //playButton.style.top = 0;
        playButton.textContent = "PLAY";
        playButton.onclick = ()=>{
            this.layer = new LGame;
            GUI.get("menucontainer").remove();
            GUI.get("instructions").remove();

        }

        let inst = GUI.create("inst", "div", "relBox", "menucontainer");
        //inst.style.left = 0+"%";
        //inst.style.bottom = 0;
        inst.textContent = "INSTRUCTIONS";
        inst.onclick = ()=>{
            GUI.get("instructions").className = "fillBox";
        }

        let instructions = GUI.create("instructions", "div", "null", "root");
        instructions.style.bottom = 0;
        instructions.style.left = 0;
        instructions.style.right = 0;
        instructions.innerHTML =`
        You are casually driving in the desert when you suddenly realise you forgot how to drive a car.
        Even worse there appears to be random boulders scattered about for some reason.<br>
        <br>Use WASD keys to perform a control action and avoid crashing into randomly placed boulders.
        Every time you perform a control action, a new action is assigned to the key. Control actions include changing your direction, 
        steering the car 45 or 90 degrees and switching the gear.<br><br>
        Your objective is to survive for as long as possible. Good luck : )
        `;
    }

    update(a_delta){
        this.timer += a_delta;

        //let rotation = MathUtil.yRotationMat(this.angle);
        let trans = MathUtil.transMat([0, -10, 0]);
        let scale = MathUtil.scaleMat([20, 4, 1]);
        let model = MathUtil.multiplyMatrices([trans, scale]);

        this.renderer.add(model, 0, 3, 0.01, 0.005);
        model = MathUtil.multiplyMatrices([MathUtil.transMat([0, -10, 1]), scale]);
        this.renderer.add(model, 0, 2, 0.001, 0);

        this.draw(a_delta);

        return this.layer;
    }

    draw(a_delta){
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.DEPTH_TEST);

        gl.clearColor(0.9, 0.9, 0.9, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        let size = app.display.size;
        gl.viewport(0, 0, size[0], size[1]);

        let camera = MathUtil.multiplyMatrices([app.display.ortho, MathUtil.transMat([0, 0, -10])]);
        this.renderer.draw(camera, this.timer);
    }
}

class LGame{
    constructor(){
        this.timer = 0;
        this.layer = this;

        this.renderer = new Renderer(
            60,
            4,
            res["shd_basic"],
            res["msh_quad"],
            res["tex_entities"],
            0
        );

        this.guiRenderer = new Renderer(
            10,
            4,
            res["shd_basic"],
            res["msh_quad"],
            res["tex_actions"],
            0
        );

        this.groundRend = new Renderer(
            10,
            4,
            res["shd_basic"],
            res["msh_quad"],
            res["tex_ground"],
            0
        );

        this.cameraPos = [0, 0, 0];

        this.player = new Player([0, 0]);
        this.obstacles = [];
        this.collisions = new Quadtree([0,0], [50,50], 1);
        for(let i=0;i<50;i++){
            let pos = [Math.random()*100-50, Math.random()*100-50];
            this.obstacles.push(new Obstacle(pos, Math.random()*3+1));
            this.collisions.insert({
                x:pos[0],
                y:pos[1],
                value:i
            });
        }
        
        let info = GUI.create("info", "div", "fillBox", "root");
        info.style.top = 0;
        info.style.right = 0+"%";

        let restart = GUI.create("restart", "div", "null", "root");
        restart.style.left = 50+"%";
        restart.style.top = 50+"%";
        restart.textContent = "You crashed! Click this to try again.";
        
        restart.onclick = ()=>{
            //GUI.get("restart").remove();
            this.restart();
        }

    }

    update(a_delta){
        this.timer += a_delta;

        if(this.player.state != 13){
            let info = GUI.get("info");
            info.textContent = this.timer.toFixed(1) +"s";
        }

        this.player.update(a_delta, this.collisions, this.obstacles);
        this.player.draw(this.renderer, this.guiRenderer);
        for(let i=0;i<this.obstacles.length;i++){
            this.obstacles[i].draw(this.renderer);
        }
        
        
        
        this.draw(a_delta);

        return this.layer;
    }

    draw(a_delta){
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.DEPTH_TEST);

        gl.clearColor(1.0, 1.0, 1.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        let size = app.display.size;
        gl.viewport(0, 0, size[0], size[1]);

        this.groundRend.add(MathUtil.multiplyMatrices([MathUtil.transMat([0, 0, -10]), MathUtil.scaleMat([this.collisions.size[0], this.collisions.size[1], 1])]), 0, 0, 0, 0);

        let cameraTrans = MathUtil.reduceVectors([this.player.position, this.cameraPos]);
        this.cameraPos = MathUtil.addVectors([this.cameraPos, MathUtil.vectorProduct(cameraTrans, 5 * a_delta)]);

        let camera = MathUtil.multiplyMatrices([app.display.ortho, MathUtil.transMat([-this.cameraPos[0], -this.cameraPos[1], -10])]);
        this.renderer.draw(camera, this.timer);
        this.groundRend.draw(camera, this.timer);
        this.guiRenderer.draw(MathUtil.multiplyMatrices([app.display.ortho, MathUtil.transMat([0, 0, -10])]), this.timer);
    }

    restart(){
        this.layer = new LGame;
        GUI.get("info").remove();
        GUI.get("restart").remove();
    }
}

class Player{
    constructor(a_pos){
        this.pos = a_pos;
        this.direction = [0, -1];
        this.speed = 10;
        this.state = 0;
        this.pressed = false;
        this.gear = 1;
        this.actions = 12;
        this.w = Math.floor(Math.random() * this.actions + 1);
        this.a = Math.floor(Math.random() * this.actions + 1);
        this.s = Math.floor(Math.random() * this.actions + 1);
        this.d = Math.floor(Math.random() * this.actions + 1);
        this.radius = 0.5;
        this.bounds = new AABB([a_pos[0] - this.radius, a_pos[1] - this.radius, 0], [a_pos[0] + this.radius, a_pos[1] + this.radius, 0]);
        this.collisionBounds = new AABB([a_pos[0] - 10, a_pos[1] - 10, 0], [a_pos[0] + 10, a_pos[1] + 10, 0]);
        this.rotation = MathUtil.zRotationMat(0);
        this.restartText = false;
    }

    update(a_delta, a_tree, a_obstacles){
        let quarter = 3.1416 / 2;
        let eight = 3.1416 / 4;
        switch(this.state){
            case 0://Query
            if(app.input.buttons["KeyW"] == true || app.input.buttons["KeyS"] == true || app.input.buttons["KeyA"] == true || app.input.buttons["KeyD"] == true){
                if(!this.pressed){
                    if(app.input.buttons["KeyW"]){this.state = this.w; this.w = Math.floor(Math.random() * this.actions + 1); this.pressed = 1;}
                    else if(app.input.buttons["KeyS"]){this.state = this.s; this.s = Math.floor(Math.random() * this.actions + 1); this.pressed = 2;}
                    else if(app.input.buttons["KeyA"]){this.state = this.a; this.a = Math.floor(Math.random() * this.actions + 1); this.pressed = 3;}
                    else if(app.input.buttons["KeyD"]){this.state = this.d; this.d = Math.floor(Math.random() * this.actions + 1); this.pressed = 4;}
                }
            }else{
                this.pressed = false;
            }
            break;
            
            case 1://Up
            this.direction = [0, -1];
            this.rotation = MathUtil.zRotationMat(0);
            this.state = 0;
            break;
            
            case 2://Down
            this.direction = [0, 1];
            this.rotation = MathUtil.zRotationMat(3.1416);
            this.state = 0;
            break;
            
            case 3://Left
            this.direction = [-1, 0];
            this.rotation = MathUtil.zRotationMat(3.1416/2);
            this.state = 0;
            break;
            
            case 4://Right
            this.direction = [1, 0];
            this.rotation = MathUtil.zRotationMat(3.1416/2*3);
            this.state = 0;
            break;
            
            case 5://CW 90
            this.direction = [Math.cos(quarter) * this.direction[0] - Math.sin(quarter) * this.direction[1], Math.sin(quarter) * this.direction[0] + Math.cos(quarter) * this.direction[1]];
            this.rotation = MathUtil.multiplyMatrices([MathUtil.zRotationMat(-quarter), this.rotation]);
            this.state = 0;
            break;
            
            case 6://CCW 90
            this.direction = [Math.cos(-quarter) * this.direction[0] - Math.sin(-quarter) * this.direction[1], Math.sin(-quarter) * this.direction[0] + Math.cos(-quarter) * this.direction[1]];
            this.rotation = MathUtil.multiplyMatrices([MathUtil.zRotationMat(quarter), this.rotation]);
            this.state = 0;
            break;
            
            case 7://CW 45
            this.direction = [Math.cos(eight) * this.direction[0] - Math.sin(eight) * this.direction[1], Math.sin(eight) * this.direction[0] + Math.cos(eight) * this.direction[1]];
            this.rotation = MathUtil.multiplyMatrices([MathUtil.zRotationMat(-eight), this.rotation]);
            this.state = 0;
            break;
            
            case 8://CCW 45
            this.direction = [Math.cos(-eight) * this.direction[0] - Math.sin(-eight) * this.direction[1], Math.sin(-eight) * this.direction[0] + Math.cos(-eight) * this.direction[1]];
            this.rotation = MathUtil.multiplyMatrices([MathUtil.zRotationMat(eight), this.rotation]);
            this.state = 0;
            break;
            
            case 9://Gear R
            this.gear = -1;
            this.state = 0;
            break;

            case 10://Gear 1
            this.gear = 1;
            this.state = 0;
            break;

            case 11://Gear 2
            this.gear = 2;
            this.state = 0;
            break;

            case 12://Gear 3
            this.gear = 3;
            this.state = 0;
            break;

            case 13:
            this.direction = [0,0];
            if(!this.restartText){
                GUI.get("restart").className = "fillBox";
                this.restartText = true;
            }
            break;
        }
        this.pos[0] += this.direction[0] * a_delta * this.speed * this.gear;
        this.pos[1] += this.direction[1] * a_delta * this.speed * this.gear;

        this.bounds.update([this.pos[0] - this.radius, this.pos[1] - this.radius, 0], [this.pos[0] + this.radius, this.pos[1] + this.radius, 0]);
        this.collisionBounds.update([this.pos[0] - 10, this.pos[1] - 10, 0], [this.pos[0] + 10, this.pos[1] + 10, 0]);

        let arr = [];
        a_tree.query(this.collisionBounds, arr);

        for(let i=0;i<arr.length;i++){
            let obstacle = arr[i].value;
            
            if(this.bounds.intersect2DAABB(a_obstacles[obstacle].bounds)){
                this.state = 13;
            }
        }

        if(this.pos[0] < -a_tree.size[0] || this.pos[0] > a_tree.size[0]){
            this.state = 13;
        }
        if(this.pos[1] < -a_tree.size[1] || this.pos[1] > a_tree.size[1]){
            this.state = 13;
        }
    }

    draw(a_renderer, a_guirend){
        let trans = MathUtil.transMat([this.pos[0], this.pos[1], 0]);
        let scale = MathUtil.scaleMat([1, 1, 1]);
        //let rotation = MathUtil.zRotationMat(3.14/2);

        let model = MathUtil.multiplyMatrices([trans, this.rotation, scale]);
        
        a_renderer.add(model, 0, 0, 0, 0);

        a_guirend.add(MathUtil.transMat([0, 13, 1]), this.w - 1, this.buttonEffect(1, this.pressed), 0.04, 0.00);
        a_guirend.add(MathUtil.transMat([-2, 15, 1]), this.a - 1, this.buttonEffect(3, this.pressed), 0.04, 0.00);
        a_guirend.add(MathUtil.transMat([0, 15, 1]), this.s - 1, this.buttonEffect(2, this.pressed), 0.04, 0.00);
        a_guirend.add(MathUtil.transMat([2, 15, 1]), this.d - 1, this.buttonEffect(4, this.pressed), 0.04, 0.00);
        a_guirend.add(MathUtil.multiplyMatrices([MathUtil.transMat([-10, 14, 1]), MathUtil.scaleMat([2, 2, 1])]), Math.max(this.gear + 8, 8), 0, 0.04, 0.00);
    }

    get position(){
        let pos = [this.pos[0], this.pos[1], 0];
        return pos;
    }

    buttonEffect(a_value, a_press){
        if(a_value == a_press){
            return 5;
        }else{
            return 0;
        }
    }
}

class Obstacle{
    constructor(a_pos, a_tex){
        this.pos = a_pos;
        this.tex = a_tex;
        this.radius = 1.0;
        this.bounds = new AABB([a_pos[0] - this.radius, a_pos[1] - this.radius, 0], [a_pos[0] + this.radius, a_pos[1] + this.radius, 0]);
    }

    draw(a_renderer){
        let trans = MathUtil.transMat([this.pos[0], this.pos[1], 0]);
        let scale = MathUtil.scaleMat([this.radius, this.radius, 1]);
        let model = MathUtil.multiplyMatrices([trans, scale]);
        
        a_renderer.add(model, this.tex, 0, 0, 0);
    }
}

//INIT

let fullscreen = GUI.create("fullscreen", "img", "fillBox", "root");
        fullscreen.src = "res/tex/fullscreen.png";
        fullscreen.style.left = 0+"px";
        fullscreen.style.top = 0+"px";
        fullscreen.draggable = false;
        fullscreen.onclick = ()=>{
            app.display.toggleFullscreen();
        }

app.init(new LSplash);
