//RENDERER

class RenderEngine{
    constructor(){
        this.resources = Object.create(null);
        this.archetypes = Object.create(null);
    }

    addResource(a_name, a_res){
        this.resources[a_name] = a_res;
    }

    removeResource(a_name){
        delete this.resource[a_name];
    }

    res(a_name){
        return this.resources[a_name];
    }
}

class Renderer{
    constructor(a_max, a_dataUnit, a_shader, a_mesh, a_texture, a_texUnit){
        this.instances = [];
        this.max = a_max;
        this.dataUnit = a_dataUnit;
        this.data = new DataTexture(5, this.max, 4, gl.RGBA32F, gl.RGBA, gl.FLOAT, this.dataUnit);
        this.shader = a_shader;
        this.mesh = a_mesh;
        this.texture = a_texture;
        this.texUnit = a_texUnit;
        
        this.uniforms = Object.create(null);
        this.uniforms["u_dataTex"] = gl.getUniformLocation(this.shader.id, "u_dataTex");
        this.uniforms["u_texture"] = gl.getUniformLocation(this.shader.id, "u_texture");
        this.uniforms["u_time"] = gl.getUniformLocation(this.shader.id, "u_time");
        this.uniforms["u_projView"] = gl.getUniformLocation(this.shader.id, "u_projView");

    }
    
    add(a_model, a_texId, a_effectId, a_extra1, a_extra2){
            
        for(let i=0;i<a_model.length;i++){
                this.instances.push(a_model[i]);
        }

        this.instances.push(a_texId);
        this.instances.push(a_effectId);
        this.instances.push(a_extra1);
        this.instances.push(a_extra2);
    }

    draw(a_projView, a_time){
        if(this.instances.length > this.max * 5 * 4){
            console.warn("Warning: Renderer data storage full! Current maximum: " + this.max + " items. Excess items discarted.");
        }
        let draws = this.instances.length / (5 * 4);
        this.instances.length = this.max * 5 * 4;
        this.data.write(new Float32Array(this.instances), this.dataUnit);
        this.instances.length = 0;

        this.shader.enable();
        this.mesh.enable();
        this.texture.enable(this.texUnit);
        this.data.enable(this.dataUnit);

        gl.uniform1i(this.uniforms["u_dataTex"], this.dataUnit);
        gl.uniform1i(this.uniforms["u_texture"], this.texUnit);
        gl.uniformMatrix4fv(this.uniforms["u_projView"], false, a_projView);
        gl.uniform1f(this.uniforms["u_time"], a_time);

        gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, draws);

        this.shader.disable();
        this.mesh.disable();
        this.texture.disable(this.texUnit);
        this.data.disable(this.dataUnit);

    }

}

//SHADER

class Shader {
    constructor(a_vertexSource, a_fragmentSource) {
        this.program = gl.createProgram();
        let vertex = this.create(gl.VERTEX_SHADER, a_vertexSource);
        let fragment = this.create(gl.FRAGMENT_SHADER, a_fragmentSource);

        gl.attachShader(this.program, vertex);
        gl.attachShader(this.program, fragment);
        gl.linkProgram(this.program);

        gl.deleteShader(vertex);
        gl.deleteShader(fragment);
    }

    create(a_type, a_source) {
        let shd = gl.createShader(a_type);
        gl.shaderSource(shd, a_source);
        gl.compileShader(shd);
        let success = gl.getShaderParameter(shd, gl.COMPILE_STATUS);
        if (success) {
            return shd;
        }

        console.error(gl.getShaderInfoLog(shd));
        gl.deleteShader(shd);
    }

    get id() {
        return this.program;
    }

    enable() {
        gl.useProgram(this.program);
    }

    disable() {
        gl.useProgram(null);
    }
}

//QUAD

class Quad {
    constructor() {
        this.VAO = gl.createVertexArray();
        this.VBO = gl.createBuffer();

        gl.bindVertexArray(this.VAO);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.VBO);

        let vertices = [
            -1.0, -1.0, 0.0, 0.0,
            1.0, -1.0, 1.0, 0.0,
            -1.0, 1.0, 0.0, 1.0,

            1.0, 1.0, 1.0, 1.0,
            -1.0, 1.0, 0.0, 1.0,
            1.0, -1.0, 1.0, 0.0
        ];

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 16, 0);

        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 16, 8);

        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    get id() {
        return this.VAO;
    }

    enable() {
        gl.bindVertexArray(this.VAO);
    }

    disable() {
        gl.bindVertexArray(null);
    }
}

//TEXTURE

class Texture {
    constructor(a_imgSource, a_width, a_height, a_count, a_unit) {
        this.texture = gl.createTexture();

        gl.activeTexture(gl.TEXTURE0 + a_unit);
        gl.bindTexture(gl.TEXTURE_2D_ARRAY, this.texture);

        gl.texImage3D(gl.TEXTURE_2D_ARRAY, 0, gl.RGBA, 1, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));

        const image = new Image();

        image.onload = () => {
            gl.activeTexture(gl.TEXTURE0 + a_unit);
            gl.bindTexture(gl.TEXTURE_2D_ARRAY, this.texture);

            gl.texImage3D(gl.TEXTURE_2D_ARRAY, 0, gl.RGBA, a_width, a_height, a_count, 0, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.generateMipmap(gl.TEXTURE_2D_ARRAY);

            gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

            gl.bindTexture(gl.TEXTURE_2D_ARRAY, null);
        };

        image.src = a_imgSource;
    }

    get id() {
        return this.texture;
    }

    enable(a_unit) {
        gl.activeTexture(gl.TEXTURE0 + a_unit);
        gl.bindTexture(gl.TEXTURE_2D_ARRAY, this.texture);
    }

    disable(a_unit) {
        gl.activeTexture(gl.TEXTURE0 + a_unit);
        gl.bindTexture(gl.TEXTURE_2D_ARRAY, null);
    }
}

//DATA_TEXTURE

class DataTexture {
    constructor(a_width, a_height, a_channels, a_internal, a_format, a_type, a_unit) {
        this.width = a_width;
        this.height = a_height;
        this.channels = a_channels;
        this.internal = a_internal;
        this.format = a_format;
        this.type = a_type;

        this.TBO = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0 + a_unit);
        gl.bindTexture(gl.TEXTURE_2D, this.TBO);

        gl.pixelStorei(gl.UNPACK_ALIGNMENT, this.channels);
        gl.texImage2D(gl.TEXTURE_2D, 0, this.internal, this.width, this.height, 0, this.format, this.type, null);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    write(a_data, a_unit) {

        gl.activeTexture(gl.TEXTURE0 + a_unit);
        gl.bindTexture(gl.TEXTURE_2D, this.TBO);

        gl.pixelStorei(gl.UNPACK_ALIGNMENT, this.channels);
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, this.width, this.height, this.format, this.type, a_data);

        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    enable(a_unit) {
        gl.activeTexture(gl.TEXTURE0 + a_unit);
        gl.bindTexture(gl.TEXTURE_2D, this.TBO);
    }

    disable(a_unit) {
        gl.activeTexture(gl.TEXTURE0 + a_unit);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    get getSize() {
        let size = this.width * this.height * this.channels;
        return size;
    }
}

//RENDER_TARGET

class RenderTarget {
    constructor(a_width, a_height, a_unit) {
        this.width = a_width;
        this.height = a_height;

        this.FBO = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.FBO);

        this.TCB = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0 + a_unit);
        gl.bindTexture(gl.TEXTURE_2D, this.TCB);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, this.width, this.height, 0, gl.RGB, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        gl.bindTexture(gl.TEXTURE_2D, null);

        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.TCB, 0);

        this.RBO = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, this.RBO);

        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH24_STENCIL8, this.width, this.height);

        gl.bindRenderbuffer(gl.RENDERBUFFER, null);

        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, this.RBO);

        if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) == gl.FRAMEBUFFER_COMPLETE) {
            
        }
        else {
            console.warn("Could not create framebuffer.");
        }

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    enable() {
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.FBO);
        gl.viewport(0, 0, this.width, this.height);
    }

    disable() {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    enableTex(a_unit) {
        gl.activeTexture(gl.TEXTURE0 + a_unit);
        gl.bindTexture(gl.TEXTURE_2D, this.TCB);
    }

    disableTex(a_unit) {
        gl.activeTexture(gl.TEXTURE0 + a_unit);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
}

//CAMERA

class Camera {
    constructor(a_proj, a_pos) {
        this.proj = a_proj;
        this.view = MathUtil.transMat(a_pos);
    }

    project(a_proj) {
        this.proj = a_proj;
    }

    absTranslate(a_pos) {
        this.view = MathUtil.transMat(a_pos);
    }

    translate(a_pos) {
        MathUtil.multiplyMatrices([this.view, MathUtil.transMat(a_pos)]);
    }

    get getPV() {
        return MathUtil.multiplyMatrices([this.proj, this.view]);
    }
}

//ANIMATION

class Animation{
    constructor(a_swapChain, a_timeChain, a_sameTime){
        this.index = 0;
        this.timer = 0;
        this.swapChain = a_swapChain;
        this.timeChain = a_timeChain;
        this.sameTime = a_sameTime;
    }

    update(a_delta){
        this.timer += a_delta;
        if(!this.sameTime){
            if(this.timeChain[this.index] <= this.timer){
                this.timer = 0;
                this.index++;
                if(this.index >= this.swapChain.length){
                    this.index = 0;
                }
            }
        }
        else{
            if(this.timeChain[0] <= this.timer){
                this.timer = 0;
                this.index++;
                if(this.index >= this.swapChain.length){
                    this.index = 0;
                }
            }
        }
    }

    get getFrame(){
        return this.swapChain[this.index];
    }
}