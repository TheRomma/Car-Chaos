class AABB{
    constructor(a_min, a_max){
        this.min = a_min;
        this.max = a_max;
    }

    update(a_min, a_max){
        this.min = a_min;
        this.max = a_max;
    }

    intersect2DPoint(a_pos){
        let check1 = MathUtil.reduceVectors([this.min, a_pos]);
        let check2 = MathUtil.reduceVectors([a_pos, this.max]);

        let result = [Math.max(check1[0], check2[0]), Math.max(check1[1], check2[1]), Math.max(check1[2], check2[2])];

        if(result[0] <= 0 && result[1] <= 0){
            return true;
        }else{
            return false;
        }
    }

    intersect2DAABB(a_aabb){
        let check1 = MathUtil.reduceVectors([this.min, a_aabb.max]);
        let check2 = MathUtil.reduceVectors([a_aabb.min, this.max]);

        let result = [Math.max(check1[0], check2[0]), Math.max(check1[1], check2[1]), Math.max(check1[2], check2[2])];

        if(result[0] <= 0 && result[1] <= 0){
            return true;
        }else{
            return false;
        }
    }

    intersectPoint(a_pos){
        let check1 = MathUtil.reduceVectors([this.min, a_pos]);
        let check2 = MathUtil.reduceVectors([a_pos, this.max]);

        let result = [Math.max(check1[0], check2[0]), Math.max(check1[1], check2[1]), Math.max(check1[2], check2[2])];

        if(result[0] <= 0 && result[1] <= 0 && result[2] <= 0){
            return true;
        }else{
            return false;
        }
    }

    intersectAABB(a_aabb){
        let check1 = MathUtil.reduceVectors([this.min, a_aabb.max]);
        let check2 = MathUtil.reduceVectors([a_aabb.min, this.max]);

        let result = [Math.max(check1[0], check2[0]), Math.max(check1[1], check2[1]), Math.max(check1[2], check2[2])];

        if(result[0] <= 0 && result[1] <= 0 && result[2] <= 0){
            return true;
        }else{
            return false;
        }
    }
}