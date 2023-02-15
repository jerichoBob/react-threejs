import * as THREE from 'three'
import { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Grid, GizmoHelper, GizmoViewport, OrbitControls, Center, Environment, Text} from '@react-three/drei'
import { useControls } from 'leva'

const ball_size = 1;
const sep = ball_size * 3;
const Points = [];
// const maxLayers = 11; // each raidal layer adds another 'sep' distance we can go out from the origin
// const maxDistance = 23.2; // stop placing points

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

    // console.log(`beginHexColor:${beginHexColor} => ${beginColor}`);
    // console.log(`endHexColor:${endHexColor} => ${endColor}`);
    // console.log(`stepsize: ${stepsize}`);

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
const Point = (layer, maxDistance, size, pos, r, theta, phi) => {
    const decimal_pts = 2;
    // let's check to see if we've created this point already
    const x = decimalTrunc(pos[0]+sph_x(r, theta, phi), decimal_pts);
    const y = decimalTrunc(pos[1]+sph_y(r, theta, phi), decimal_pts);
    const z = decimalTrunc(pos[2]+sph_z(r, theta, phi), decimal_pts); 
    const distance = Math.sqrt(x**2 + y**2 + z**2)
    // console.log(`x: ${x} y:${y} z:${z}`);
    // console.log("Points.length: ", Points.length);
    const found = Points.find((point) => {
        return(
            point!==null &&
            Math.abs(point.position[0]-x) < compensationValue && // comparison compensates for "errors" in precision
            Math.abs(point.position[1]-y) < compensationValue && 
            Math.abs(point.position[2]-z) < compensationValue
        )});
    // console.log("found: ", found);
    if (!found && distance < maxDistance - ball_size) {

        // console.log(`distance: ${distance}`)
        Points.push({
            used: false, 
            layer: layer,
            size: size, 
            position: [x, y, z]
        });
    }
}
const compensationValue = 0.5;
const createPointsAtPosition = (layer, maxDistance, pos) => {
    const theta_top = Math.PI/2-Math.acos(1/Math.sqrt(3));
    const theta_bot = Math.PI/2-Math.acos(1/Math.sqrt(3))+Math.PI;
    // if we've already drawn from this point already, then skip
    // console.log(`Creating points at: ${pos}`);
    // console.log(`Comparing [${pos}] to ${Points.length} point(s)`);
    const foundPoint = Points.find((point, index) => {
        // console.log(`point.pos[${index}]: [${JSON.stringify(point)}]`);
        // console.log(`point.pos[${index}]: [${point.position}]`);
        // console.log(`x comparison: ${Math.abs(point.position[0]-pos[0])}`);
        return(
            point!==null &&
            Math.abs(point.position[0]-pos[0]) < compensationValue && // comparison compensates for "errors" in precision
            Math.abs(point.position[1]-pos[1]) < compensationValue && 
            Math.abs(point.position[2]-pos[2]) < compensationValue
        )});    
    // the point at which you are creating these new points should (must) already exist
    if (foundPoint === undefined) {
        console.log("OH SHIT!")
    } 
    else {
        // console.log("foundPoint:",foundPoint);
        if (!foundPoint.used) {
            foundPoint.used = true;   
            Point(layer, maxDistance, ball_size, pos, sep, Math.PI/2, Math.PI*0/3);
            Point(layer, maxDistance, ball_size, pos, sep, Math.PI/2, Math.PI*1/3);
            Point(layer, maxDistance, ball_size, pos, sep, Math.PI/2, Math.PI*2/3);
            Point(layer, maxDistance, ball_size, pos, sep, Math.PI/2, Math.PI*3/3);
            Point(layer, maxDistance, ball_size, pos, sep, Math.PI/2, Math.PI*4/3);
            Point(layer, maxDistance, ball_size, pos, sep, Math.PI/2, Math.PI*5/3);
            
            Point(layer, maxDistance, ball_size, pos, sep, theta_top, Math.PI*1/6);    
            Point(layer, maxDistance, ball_size, pos, sep, theta_top, Math.PI*5/6);    
            Point(layer, maxDistance, ball_size, pos, sep, theta_top, Math.PI*9/6);    

            Point(layer, maxDistance, ball_size, pos, sep, theta_bot, Math.PI*1/6);    
            Point(layer, maxDistance, ball_size, pos, sep, theta_bot, Math.PI*5/6);    
            Point(layer, maxDistance, ball_size, pos, sep, theta_bot, Math.PI*9/6);     
        }
    }
}

const Model = (props) => {

    Point(0, props.maxDistance, ball_size, [0,0,0], 0, Math.PI/2, Math.PI*0/3);
    createPointsAtPosition(1, props.maxDistance, [0,0,0]);

    for(let layer=0; layer< props.maxLayers; layer++){
        console.log(`===========================================`);
        console.log(`building layer ${layer}`);
        Points.forEach((point)=>(
            createPointsAtPosition(layer+2, props.maxDistance, point.position)
        ));
    }

    console.log("Number of points: ", Points.length)
    // for(let index=0; index< Points.length; index++){
    Points.forEach((data, index)=>{
        console.log(`Point[${index}]:  layer: ${data.layer} color: ${props.colors[data.layer]}`);
    });
    return (
        <group position={props.position}>
            {
                Points.filter((data, index)=>(props.colors[data.layer]!==undefined))
                .map((data, index)=>(
                    <SphereXYZ key={index} scale={data.size} position={data.position}  color={props.colors[data.layer]} />
                ))
            }
        </group>
    )
}

const SphereXYZ = (props) => {
    return (
        <Center  scale={props.scale} position={props.position}>
            <mesh castShadow receiveShadow>
                <sphereGeometry args={[1, 64, 64]} />
                <meshStandardMaterial color={props.color}/>
            </mesh>
        </Center>
  )
}
const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: '#f1f1f1',
    transmission: 1,
    opacity: 1,
    roughness: 0.1,
    thickness: .01,
    envMapIntensity: 4,
    // wireframe: true
});
const SphereRTP = (props) => {
    const pos=[
        sph_x(props.radius, props.theta, props.phi), 
        sph_y(props.radius, props.theta, props.phi), 
        sph_z(props.radius, props.theta, props.phi) ];
    // console.log(`glass sphere placed at [${pos}]`);
    return (
        <Center  scale={props.scale} position={pos}>
            <mesh castShadow receiveShadow material={glassMaterial}>
                <sphereGeometry args={[1, 64, 64]} />
                {/* <meshStandardMaterial color={props.color}/> */}
            </mesh>
        </Center>
  )
}
const Floor = (props) => {
    return (
        <Center  scale={props.scale} position={props.position} >
            <mesh castShadow receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[1, 1]} />
                <meshStandardMaterial color={props.color} side={THREE.DoubleSide} />
            </mesh>          
        </Center>
  )    
}
const FloorInfo = (props) => {
    return (
        <Center  scale={props.scale} position={props.position} >
            <Text position={props.position} font="/Inter-Regular.woff" fontSize={4} castShadow receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
                colorPalette: {JSON.stringify(props.colors, null, 2)}
                <meshStandardMaterial color="#aaa" toneMapped={false} side={THREE.DoubleSide}/>
            </Text>
      
        </Center>
  )    
}
const Info = (props) => {
    return (
        <Center  scale={props.scale} position={props.position} >
            <Text position={props.position} font="/Inter-Regular.woff" fontSize={4} rotation={[-Math.PI / 2, 0, 0]}>
                Points: {Points.length}
                <meshStandardMaterial color="#aaa" toneMapped={false} side={THREE.DoubleSide}/>
            </Text>
        </Center>
  )    
}

export default function App() {
    const { maxLayers, maxDistance, drawGlassShell , rotate, rotateSpeed} = useControls({
        maxLayers:   { value: 1, min: 1, max: 10, step: 1 },
        maxDistance: { value: 5, min: 1, max: 30, step: 0.1 },
        drawGlassShell: true,
        rotate: true,
        rotateSpeed: { value: 1, min: 0, max: 10, step: 0.1}
    })
    let maxD = maxDistance*2;
    useEffect(() => {
        Points.length = 0;
        // maxD = maxDistance*2;
    },[maxLayers, maxDistance]);
    let colors = createPalette("000033", "333333", maxLayers);
    return (
        <Canvas shadows camera={{ position: [0, maxD, maxD*3], fov: 30, far: 1000 }}>
            <ambientLight intensity={1} />
            <spotLight position={[maxD, maxD, maxD]} angle={0.5} penumbra={1} castShadow />
            <pointLight position={[-maxD, 0, -maxD]} intensity={2} />
            <Model position={[0, 0, 0]} maxDistance={maxDistance} maxLayers={maxLayers} colors={colors}/>
            {drawGlassShell &&
                <SphereRTP radius={0} theta={0} phi={0} scale={maxDistance} />
            }
            {/* <Floor scale={maxD*5} position={[0,-maxD,0]} color="#ccaa00" /> */}
            {/* <Info position={[0, maxDistance*3/2, 0]}/> */}
            <Info scale={1} position={[maxD+5,-maxD/2+1,0]} />
            <FloorInfo scale={1} position={[-maxD-5,-maxD/2+1,0]} color="#ccaa00" colors={colors}/>
            <Grid 
                position={[0,-maxD/2, 0]}
                gridSize={[10.5, 10.5]}
                cellSize={4}           /** Cell size, default: 0.5 */
                cellThickness={2}      /** Cell thickness, default: 0.5 */
                cellColor="#6f6f6f"    /** Cell color, default: black */
                sectionSize={100}      /** Section size, default: 1 */
                sectionThickness={3}  /** Section thickness, default: 1 */
                sectionColor="#9d4b4b" /** Section color, default: #2080ff */
                followCamera={false}   /** Follow camera, default: false */
                infiniteGrid={true}    /** Display the grid infinitely, default: false */
                fadeDistance={500}     /** Fade distance, default: 100 */
                fadeStrength={3}       /** Fade strength, default: 1 */
            />

            <OrbitControls autoRotate={rotate} autoRotateSpeed={rotateSpeed}/>
            <Environment preset="city" />
            <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
                <GizmoViewport axisColors={['#9d4b4b', '#2f7f4f', '#3b5b9d']} labelColor="white" />
            </GizmoHelper>            
        </Canvas>
    )
  }
  