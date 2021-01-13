class MathUtil {

    //Get random integer between 0 and a_value.
    static rand(a_value) {
        return Math.floor(Math.random() * a_value);
    }

    //Get an identity matrix.
    static idMat() {
        let mat = [
            1.0, 0.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0
        ];

        return mat;
    }

    //Get an orthographic projection matrix.
    static orthoMat(a_left, a_right, a_top, a_bottom, a_near, a_far) {
        let lr = 1.0 / (a_left - a_right);
        let bt = 1.0 / (a_bottom - a_top);
        let nf = 1.0 / (a_near - a_far);

        let c1 = (a_left + a_right) * lr;
        let c2 = (a_top + a_bottom) * bt;
        let c3 = (a_far + a_near) * nf;

        let mat = [
            -2.0 * lr, 0.0, 0.0, 0.0,
            0.0, -2.0 * bt, 0.0, 0.0,
            0.0, 0.0, 2.0 * nf, 0.0,
            c1, c2, c3, 1.0
        ];

        return mat;
    }

    //Get a translation transform matrix.
    static transMat(a_pos) {
        let mat = [
            1.0, 0.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            a_pos[0], a_pos[1], a_pos[2], 1.0
        ];

        return mat;
    }

    //Get a scale transform matrix.
    static scaleMat(a_pos) {
        let mat = [
            a_pos[0], 0.0, 0.0, 0.0,
            0.0, a_pos[1], 0.0, 0.0,
            0.0, 0.0, a_pos[2], 0.0,
            0.0, 0.0, 0.0, 1.0
        ];

        return mat;
    }

    //Get a rotation transformation matrix. Rotates via X axis.
    static xRotationMat(a_angle) {
        let mat = [
            1.0, 0.0, 0.0, 0.0,
            0.0, Math.cos(a_angle), -Math.sin(a_angle), 0.0,
            0.0, Math.sin(a_angle), Math.cos(a_angle), 0.0,
            0.0, 0.0, 0.0, 1.0
        ];

        return mat;
    }

    //Get a rotation transformation matrix. Rotates via Y axis.
    static yRotationMat(a_angle) {
        let mat = [
            Math.cos(a_angle), 0.0, Math.sin(a_angle), 0.0,
            0.0, 1.0, 0.0, 0.0,
            -Math.sin(a_angle), 0.0, Math.cos(a_angle), 0.0,
            0.0, 0.0, 0.0, 1.0
        ];

        return mat;
    }

    //Get a rotation transformation matrix. Rotates via Z axis.
    static zRotationMat(a_angle) {
        let mat = [
            Math.cos(a_angle), -Math.sin(a_angle), 0.0, 0.0,
            Math.sin(a_angle), Math.cos(a_angle), 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0
        ];

        return mat;
    }

    //Multiplication of two 4x4 matrices. Use multiplyMatrices function instead.
    static matrixMultiplication(b, a) {
        let mat = [
            a[0] * b[0] + a[1] * b[4] + a[2] * b[8] + a[3] * b[12], a[0] * b[1] + a[1] * b[5] + a[2] * b[9] + a[3] * b[13], a[0] * b[2] + a[1] * b[6] + a[2] * b[10] + a[3] * b[14], a[0] * b[3] + a[1] * b[7] + a[2] * b[11] + a[3] * b[15],
            a[4] * b[0] + a[5] * b[4] + a[6] * b[8] + a[7] * b[12], a[4] * b[1] + a[5] * b[5] + a[6] * b[9] + a[7] * b[13], a[4] * b[2] + a[5] * b[6] + a[6] * b[10] + a[7] * b[14], a[4] * b[3] + a[5] * b[7] + a[6] * b[11] + a[7] * b[15],
            a[8] * b[0] + a[9] * b[4] + a[10] * b[8] + a[11] * b[12], a[8] * b[1] + a[9] * b[5] + a[10] * b[9] + a[11] * b[13], a[8] * b[2] + a[9] * b[6] + a[10] * b[10] + a[11] * b[14], a[8] * b[3] + a[9] * b[7] + a[10] * b[11] + a[11] * b[15],
            a[12] * b[0] + a[13] * b[4] + a[14] * b[8] + a[15] * b[12], a[12] * b[1] + a[13] * b[5] + a[14] * b[9] + a[15] * b[13], a[12] * b[2] + a[13] * b[6] + a[14] * b[10] + a[15] * b[14], a[12] * b[3] + a[13] * b[7] + a[14] * b[11] + a[15] * b[15]
        ];

        return mat;
    }

    //Get the multiplication of an array of matrices.
    static multiplyMatrices(a_matrices) {
        let mats = a_matrices[0];
        for (let i = 1; i < a_matrices.length; i++) {
            mats = this.matrixMultiplication(mats, a_matrices[i]);
        }

        return mats;
    }

    //Addition of two 3 dimentional vectors.
    static vec3Addition(a, b) {
        let vec3 = [a[0] + b[0], a[1] + b[1], a[2] + b[2]];

        return vec3;
    }

    //Get addition of an array of 3 dimentional vectors.
    static addVectors(a_vectors) {
        let vecs = a_vectors[0];
        for (let i = 1; i < a_vectors.length; i++) {
            vecs = this.vec3Addition(vecs, a_vectors[i]);
        }

        return vecs;
    }

    //Reduction of two 3 dimentional vectors.
    static vec3Reduction(a, b) {
        let vec3 = [a[0] - b[0], a[1] - b[1], a[2] - b[2]];

        return vec3;
    }

    //Get reduction of an array of 3 dimentional vectors.
    static reduceVectors(a_vectors) {
        let vecs = a_vectors[0];
        for (let i = 1; i < a_vectors.length; i++) {
            vecs = this.vec3Reduction(vecs, a_vectors[i]);
        }

        return vecs;
    }

    //Get product of vector.
    static vectorProduct(a_vector, a_value) {
        let result = [a_vector[0] * a_value, a_vector[1] * a_value, a_vector[2] * a_value]

        return result;
    }

    //Get division of vector.
    static vectorDivision(a_vector, a_value) {
        let result = [a_vector[0] / a_value, a_vector[1] / a_value, a_vector[2] / a_value]

        return result;
    }

    //Pythagorean theorem.
    static pythagorean(a_vector) {
        let result = Math.sqrt(a_vector[0] * a_vector[0] + a_vector[1] * a_vector[1]);
        return result;
    }

    //Magnitude of a 3 dimentional vector.
    static vectorMagnitude(a_vector) {
        let first = this.pythagorean([a_vector[0], a_vector[1]]);
        let result = this.pythagorean([first, a_vector[2]]);

        return result;
    }

    //Normalize a 3 dimentional vector.
    static normalizeVector(a_vector) {
        let magnitude = this.vectorMagnitude(a_vector);
        let result = this.vectorDivision(a_vector, magnitude);

        return result;
    }
}