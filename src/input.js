class Input{
    constructor(){
        this.buttons = Object.create(null);
        this.mouse = [0, 0];
        this.mouse1 = false;

        document.addEventListener("mousemove", (e) => {
            this.mouse = [e.clientX, e.clientY];
        });
        document.addEventListener("mousedown", (e) => {
            this.mouse1 = true;
        });
        document.addEventListener("mouseup", (e) => {
            this.mouse1 = false;
        });

        document.addEventListener("keydown", (e) => {
            if (this.buttons[e.code] == null){
                this.buttons[e.code] = false;
            }
            this.buttons[e.code] = true;
        });
        document.addEventListener("keyup", (e) => {
            if (this.buttons[e.code] == null){
                this.buttons[e.code] = false;
            }
            this.buttons[e.code] = false;
        });
    }

    button(a_input){
        if(this.buttons[a_input] == null){
            this.buttons[a_input] = false;
        }
        return this.buttons[a_input];
    }

    cursor(a_magnification, a_dimentions, a_cameraPos){
        let x = this.mouse[0] * a_magnification + a_cameraPos[0] - a_dimentions[0]/2;
        let y = this.mouse[1] * a_magnification + a_cameraPos[1] - a_dimentions[1]/2;

        return {x:x, y:y};
    }
}