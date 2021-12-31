import "./style.css"
import { cos, matrix, multiply, sin } from "mathjs";
import p5 from "p5";


var sketch = (p: p5) => {
    let angle:number = 0;
    let distance = 0;

    const points: number[][] = [
        [ 0.5, -0.5, -0.5],
        [ 0.5,  0.5, -0.5],
        [-0.5,  0.5, -0.5],
        [-0.5, -0.5, -0.5],
        [ 0.5, -0.5, 0.5],
        [ 0.5,  0.5, 0.5],
        [-0.5,  0.5, 0.5],
        [-0.5, -0.5, 0.5],
    ]
    
    function scale(m:number[], scaleFactor: number) {
        return matrix(multiply(m, scaleFactor))
    }

    function connect(i:number, j:number, m: number[][]) {
        p.strokeWeight(1)
        p.line(m[i][0], m[i][1], m[j][0], m[j][1])
    }

    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
    };
    
    p.draw = () => {
        angle+=0.03;
        p.translate(p.width/2, p.height/2)
        p.background(0);
        p.fill(255);
        
        let rotationZ:number[][] = [
            [cos(angle), -sin(angle), 0],
            [sin(angle), cos(angle), 0],
            [0, 0, 1]
        ]
        let rotationY:number[][] = [
            [cos(angle), 0, -sin(angle)],
            [0, 1, 0],
            [sin(angle), 0, cos(angle)],
        ]
        let rotationX:number[][] = [
            [1, 0, 0],
            [0, cos(angle), -sin(angle)],
            [0, sin(angle), cos(angle)],
        ]
        let projectedPoints:number[][] = [];
        // console.log(1)
        for (const v of points) {
            let rotated = matrix(multiply(rotationZ, v))
            rotated = matrix(multiply(rotationX, rotated))
            rotated = matrix(multiply(rotationY, rotated))

            distance = 2;
            console.log()
            let z = 1/(distance - (rotated.toArray()[2] as number));
            const projection:number[][] = [
                [z,0,0],
                [0,z,0]
            ]

            let projected2d = matrix(multiply(projection, rotated)).toArray() as number[]
            let scaled = scale(projected2d, (p.windowWidth >= p.windowHeight? p.windowHeight/2 : p.windowWidth/2)).toArray() as number[]
            // console.log(angle)
            projectedPoints.push(scaled)
        }
        for (const v of projectedPoints) {
            p.noFill()
            p.stroke(255)
            p.strokeWeight(4)
            p.point(v[0],v[1])
            
        }
        
        for (let i = 0; i < 4; i++) {
            connect(i, (i+1)%4, projectedPoints)
            connect(i+4, ((i+1)%4)+4, projectedPoints)
            connect(i, i+4, projectedPoints)            
        }
    };

    window.onresize = () =>{
        p.resizeCanvas(p.windowWidth, p.windowHeight)
    }
  };
  
  new p5(sketch);