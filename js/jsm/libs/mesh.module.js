import * as THREE from '/build/three.module.js';

class Mesh extends THREE.Mesh {
    constructor() {
        super();
    }
    setWireFrame(value) {
        this.material.wireframe = value;
    }
}

class Quad extends Mesh {
    constructor() {
        super();

        // Quad
        let vertices = [-0.5, 0.5, 0,
            -0.5, -0.5, 0,
            0.5, -0.5, 0,
            0.5, 0.5, 0];
        let indices = [0,1,2, 0,2,3];

        let vi = to3d(0.2, vertices, indices);

        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(vi[0], 3));
        this.geometry.setIndex(vi[1]);
        this.material = new THREE.MeshBasicMaterial({color: "white", wireframe: false, side: THREE.DoubleSide});
    }
}

class Triangle3d extends Mesh {
    constructor() {
        super();

        // Quad
        let vertices = [
            -0.5, 0, 0,
            0.5, 0, 0,
            0, 1, 0,
        ];
        let indices = [
            // Figura 2d original
            0,1,2
        ];

        let vi = to3d(0.2, vertices, indices);

        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(vi[0], 3));
        this.geometry.setIndex(vi[1]);
        this.material = new THREE.MeshBasicMaterial({color: "white", wireframe: false, side: THREE.DoubleSide});
    }
}

class LetterF extends Mesh {
    constructor() {
        super();

        let vertices = [
            -0.3, -0.8, 0, //0
            0, -0.8, 0, //1
            0, -0.2, 0, //2
            0.5,-0.2,0, //3
            0.5, 0, 0, //4
            0, 0, 0, //5
            0, 0.2, 0, //6
            0.8, 0.2, 0, //7
            0.8, 0.4, 0, //8
            0, 0.4, 0, //9
            -0.3, 0.4, 0, //10
            -0.3, 0.2, 0, //11
            -0.3, 0, 0, //12
            -0.3, -0.2, 0, //13
        ];
        let indices = [
            // Figura 2d original
            0,1,2, 0,2,13,
            2,3,4, 2,4,5,
            13,2,5, 13,5,12,
            12,5,6, 12,6,11,
            11,6,9, 11,9,10,
            6,7,8, 6,8,9
        ];

        let vi = to3d(0.2, vertices, indices);

        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(vi[0], 3));
        this.geometry.setIndex(vi[1]);
        this.material = new THREE.MeshBasicMaterial({color: "white", wireframe: false, side: THREE.DoubleSide});
    }
}

class Sword extends Mesh {
    constructor() {
        super();

        // Quad
        let vertices = [
            -0.2, -0.2, 0, //0
            -0.7, -0.2, 0, //1
            -0.7, -0.5, 0, //2
            -0.2, -0.5, 0, //3
            -0.2, -1.5, 0, //4
            0.2, -1.5, 0, //5
            0.2, -0.5, 0, //6
            0.7, -0.5, 0, //7
            0.7, -0.2, 0, //8
            0.2, -0.2, 0, //9
            0.2, 1, 0, //10
            0, 1.5, 0, //11
            -0.2, 1, 0, //12
        ];
        let indices = [
            // Figura 2d original
            0,1,2, 0,2,3,
            3,4,6, 4,5,6,
            6,7,8, 8,9,6,
            9,3,6, 9,0,3,
            9,10,0, 10,12,0,
            10,11,12,
        ];

        let vi = to3d(0.2, vertices, indices);

        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(vi[0], 3));
        this.geometry.setIndex(vi[1]);
        this.material = new THREE.MeshBasicMaterial({color: "white", wireframe: false, side: THREE.DoubleSide});
    }
}

class House extends Mesh {
    constructor() {
        super();

        // Quad
        let vertices = [
            -0.5, 0, 0,
            -0.5,-0.5,0,
            0.5,-0.5,0,
            0.5, 0, 0,
            1, 0, 0,
            0, 0.5,0,
            -1,0,0
        ];
        let indices = [
            0,1,2, 2,3,0,
            3,4,5,
            0,3,5,
            6,5,0
        ];

        let vi = to3d(0.8, vertices, indices);

        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(vi[0], 3));
        this.geometry.setIndex(vi[1]);
        this.material = new THREE.MeshBasicMaterial({color: "white", wireframe: false, side: THREE.DoubleSide});
    }
}

function to3d(width, vertices, indices) {
    let v = [].concat(vertices);
    let i = [].concat(indices);

    let coordAmount = vertices.length / 3;

    for(let idx = 2; idx < vertices.length; idx += 3) {
        v[idx] += width;
    }

    v = vertices.concat(v);

    for(let idx = 0; idx < indices.length; idx++) {
        i[idx] += coordAmount;
    }

    i = indices.concat(i);

    for(let idx = 0; idx < coordAmount * 2; idx++) {

        let a = idx;
        let b = idx + 1;
        let c = idx + coordAmount + 1;

        if(idx >= coordAmount) {
            b -= 2;
            c -= 2;
        }

        if(a > coordAmount * 2 - 1) a -= coordAmount * 2;
        if(b > coordAmount * 2 - 1) b -= coordAmount * 2;
        if(c > coordAmount * 2 - 1) c -= coordAmount * 2;

        i.push(a, b, c);
    }

    return [v, i];
}

export {Quad, Sword, Triangle3d, House, LetterF}