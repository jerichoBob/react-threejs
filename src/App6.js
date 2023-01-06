// import * as THREE from 'three'
// import { useState, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import {  OrbitControls, Center, ContactShadows } from '@react-three/drei'

const decimalToHexColor = (d, padding) => {
    var hex = Number(d).toString(16);
    padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

    while (hex.length < padding) {
        hex = "0" + hex;
    }
    return "#"+hex;
}
const createPalette = (beginHexColor, endHexColor, steps) => {
    const beginColor = parseInt(beginHexColor, 16);
    const endColor = parseInt(endHexColor, 16);
    const stepsize = Math.floor((endColor - beginColor) / steps);

    console.log(`beginHexColor:${beginHexColor} => ${beginColor}`);
    console.log(`endHexColor:${endHexColor} => ${endColor}`);
    console.log(`stepsize: ${stepsize}`);

    const colorPalette = [];
    colorPalette.push(decimalToHexColor(beginColor, 6));
    let color = beginColor;
    for (let i = 1; i < steps-1; i++){
        color += stepsize;
        colorPalette.push(decimalToHexColor(color, 6));    
    }
    colorPalette.push(decimalToHexColor(endColor, 6));    
    // console.log(colorPalette);
    return colorPalette;
}
const colors = createPalette("000033", "aaaaaa", 4);
console.log(colors);

const ball_size = 1;
const sep = ball_size * 3;

const sph_x = (r, theta, phi) => r * Math.cos(phi) * Math.sin(theta);
const sph_y = (r, theta, phi) => r * Math.sin(phi) * Math.sin(theta);
const sph_z = (r, theta, phi) => r * Math.cos(theta);

/**
 * truncate that nasty javascript number down to a fixed number of digits
 * @param {*} number 
 * @param {*} digits 
 * @returns 
 */
const decimalTrunc = (number, digits) => {
    var multiplier = Math.pow(10, digits),
        adjustedNum = number * multiplier,
        truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum);

    return truncatedNum / multiplier;
};

/**
 * 
 */
const Point = (layer, size, pos, r, theta, phi) => {

    const decimal_pts = 2;
    // let's check to see if we've created this point already
    const x = decimalTrunc(pos[0]+sph_x(r, theta, phi), decimal_pts);
    const y = decimalTrunc(pos[1]+sph_y(r, theta, phi), decimal_pts);
    const z = decimalTrunc(pos[2]+sph_z(r, theta, phi), decimal_pts); 
    // const distance = Math.sqrt(x**2 + y**2 + z**2)
    // console.log(`x: ${x} y:${y} z:${z}`);
    // console.log("Points.length: ", Points.length);
    const found = Points.find((point) => {
        return(
            point!==null &&
            Math.abs(point.position[0]-x) < 0.05 && // comparison compensates for "errors" in precision
            Math.abs(point.position[1]-y) < 0.05 && 
            Math.abs(point.position[2]-z) < 0.05
        )});
    // console.log("found: ", found);
    if (!found) {

        // console.log(`distance: ${distance}`)
        Points.push({
            layer: layer,
            size: size, 
            position: [x, y, z]
        })
    }
}

const Points = [];

const createPointsAtPosition = (layer, pos) => {
    const theta_top = Math.PI/2-Math.acos(1/Math.sqrt(3));
    const theta_bot = Math.PI/2-Math.acos(1/Math.sqrt(3))+Math.PI;
    Point(layer, ball_size, pos, sep, Math.PI/2, Math.PI*0/3);
    Point(layer, ball_size, pos, sep, Math.PI/2, Math.PI*1/3);
    Point(layer, ball_size, pos, sep, Math.PI/2, Math.PI*2/3);
    Point(layer, ball_size, pos, sep, Math.PI/2, Math.PI*3/3);
    Point(layer, ball_size, pos, sep, Math.PI/2, Math.PI*4/3);
    Point(layer, ball_size, pos, sep, Math.PI/2, Math.PI*5/3);
    
    Point(layer, ball_size, pos, sep, theta_top, Math.PI*1/6);    
    Point(layer, ball_size, pos, sep, theta_top, Math.PI*5/6);    
    Point(layer, ball_size, pos, sep, theta_top, Math.PI*9/6);    

    Point(layer, ball_size, pos, sep, theta_bot, Math.PI*1/6);    
    Point(layer, ball_size, pos, sep, theta_bot, Math.PI*5/6);    
    Point(layer, ball_size, pos, sep, theta_bot, Math.PI*9/6);     
}

const Model = (props) => {

    Point(0, ball_size, [0,0,0], 0, Math.PI/2, Math.PI*0/3);
    createPointsAtPosition(1, [0,0,0]);
    
    Points.forEach((point, index)=>(
        createPointsAtPosition(2, point.position)
    ));

    Points.forEach((point, index)=>(
        createPointsAtPosition(3, point.position)
    ));    

    // Points.forEach((point, index)=>(
    //     createPointsAtPosition(5, point.position)
    // ));    
    
    console.log("Number of points: ", Points.length)
    // console.log(JSON.stringify(Points,null,4))

    return (
        <group position={props.position}>
            {
                Points.map((data, index)=>(
                    <SphereXYZ key={index} scale={data.size} position={data.position}  color={colors[data.layer]} />
                ))
            }
        </group>
    )
}

function SphereXYZ(props) {
    return (
        <Center top scale={props.scale} position={props.position}>
            <mesh castShadow receiveShadow>
                <sphereGeometry args={[1, 64, 64]} />
                <meshStandardMaterial color={props.color}/>
            </mesh>
        </Center>
  )
}

export default function App() {
    return (
        <Canvas camera={{ position: [0, 1, 4], fov: 50 }}>
        <ambientLight intensity={1} />
        <spotLight position={[10, 10, 10]} angle={0.5} penumbra={1} castShadow />
        <pointLight position={[-10, 0, -10]} intensity={2} />
        <Model position={[0, 0, 0]} />
        <ContactShadows frames={1} scale={5} position={[0, -1, 0]} far={1} blur={5} opacity={0.5} color="#204080" />

        <OrbitControls autoRotate autoRotateSpeed={1}/>
      </Canvas>
    )
  }
  