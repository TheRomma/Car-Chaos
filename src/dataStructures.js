class Quadtree{
    constructor(a_pos, a_size, a_max){
        this.points = [];
        this.max = a_max;
        this.pos = a_pos;
        this.size = a_size;
        this.bounds = new AABB([a_pos[0] - a_size[0], a_pos[1] - a_size[1], 0], [a_pos[0] + a_size[0], a_pos[1] + a_size[1], 0]);
        this.divided = false;

        this.nw = null;
        this.ne = null;
        this.sw = null;
        this.se = null;
    }

    insert(a_point){
        if(!this.bounds.intersect2DPoint([a_point.x, a_point.y, 0])){
            return false;
        }
        if(this.points.length < this.max){
            this.points.push(a_point);
            return true;
        }else{
            if(!this.divided){
                this.subdivide();
            }
            if(this.nw.insert(a_point)){return true;}
            else if(this.ne.insert(a_point)){return true;}
            else if(this.sw.insert(a_point)){return true;}
            else if(this.se.insert(a_point)){return true;}
        }
    }

    query(a_range, a_arr){
        if(!this.bounds.intersect2DAABB(a_range)){
            return;
        }else{
            for(let i=0;i<this.points.length;i++){
                let point = this.points[i];
                if(a_range.intersect2DPoint([point.x, point.y, 0])){
                    a_arr.push(point);
                }
            }
            if(this.divided){
                this.nw.query(a_range, a_arr);
                this.ne.query(a_range, a_arr);
                this.sw.query(a_range, a_arr);
                this.se.query(a_range, a_arr);
            }
        }
    }

    subdivide(){
        this.sw = new Quadtree([this.pos[0] - this.size[0] / 2, this.pos[1] + this.size[1] / 2], [this.size[0] / 2, this.size[1] / 2], this.max);
        this.se = new Quadtree([this.pos[0] + this.size[0] / 2, this.pos[1] + this.size[1] / 2], [this.size[0] / 2, this.size[1] / 2], this.max);
        this.nw = new Quadtree([this.pos[0] - this.size[0] / 2, this.pos[1] - this.size[1] / 2], [this.size[0] / 2, this.size[1] / 2], this.max);
        this.ne = new Quadtree([this.pos[0] + this.size[0] / 2, this.pos[1] - this.size[1] / 2], [this.size[0] / 2, this.size[1] / 2], this.max);
        this.divided = true;
    }
}