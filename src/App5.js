import * as THREE from 'three'
import { useState, useRef } from 'react'
import { Canvas, extend, useFrame } from '@react-three/fiber'
import {  OrbitControls, AccumulativeShadows, RandomizedLight, Center, Environment, ContactShadows } from '@react-three/drei'

const ball_size = 0.25;
const rad = ball_size * 3;

const sph_x = (r, theta, phi) => r * Math.cos(phi) * Math.sin(theta);
const sph_y = (r, theta, phi) => r * Math.sin(phi) * Math.sin(theta);
const sph_z = (r, theta, phi) => r * Math.cos(theta);

const Model = (props) => {
    const theta_top = Math.PI/2-Math.acos(1/Math.sqrt(3));
    const theta_bot = Math.PI/2-Math.acos(1/Math.sqrt(3))+Math.PI;
    return (
        <group position={props.position}>
            <Sphere scale={ball_size} radius={0}   theta={Math.PI/2} phi={Math.PI*0/3} color="#000000" />
            <Sphere scale={ball_size} radius={rad} theta={Math.PI/2} phi={Math.PI*0/3} color="#ff0000" />

            <Sphere scale={ball_size} radius={rad} theta={Math.PI/2} phi={Math.PI*1/3} color="#770000" />
            <Sphere scale={ball_size} radius={rad} theta={Math.PI/2} phi={Math.PI*2/3} color="#333300" />
            <Sphere scale={ball_size} radius={rad} theta={Math.PI/2} phi={Math.PI*3/3} color="#337700" />
            <Sphere scale={ball_size} radius={rad} theta={Math.PI/2} phi={Math.PI*4/3} color="#33ff00" />
            <Sphere scale={ball_size} radius={rad} theta={Math.PI/2} phi={Math.PI*5/3} color="#777700" />

            <Sphere scale={ball_size} radius={rad} theta={theta_top} phi={Math.PI*1/6} color="#0000aa" />
            <Sphere scale={ball_size} radius={rad} theta={theta_top} phi={Math.PI*5/6} color="#0000aa" />
            <Sphere scale={ball_size} radius={rad} theta={theta_top} phi={Math.PI*9/6} color="#0000aa" />

            <Sphere scale={ball_size} radius={rad} theta={theta_bot} phi={Math.PI*1/6} color="#00aaaa" />
            <Sphere scale={ball_size} radius={rad} theta={theta_bot} phi={Math.PI*5/6} color="#00aaaa" />
            <Sphere scale={ball_size} radius={rad} theta={theta_bot} phi={Math.PI*9/6} color="#00aaaa" />

        </group>
    )
}


function Sphere(props) {
    const pos=[
        sph_x(props.radius, props.theta, props.phi), 
        sph_y(props.radius, props.theta, props.phi), 
        sph_z(props.radius, props.theta, props.phi) ];
    return (
        <Center top scale={props.scale} position={pos}>
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
        {/* <Canvas shadows camera={{ position: [0, 1, 0] }}> */}
        <ambientLight intensity={1} />
        <spotLight position={[10, 10, 10]} angle={0.5} penumbra={1} castShadow />
        <pointLight position={[-10, 0, -10]} intensity={2} />
        <Model position={[0, 0, 0]} />
        {/* <Environment preset="city" /> */}
        {/* <ContactShadows frames={1} scale={5} position={[0, 0, 0]} far={1} blur={5} opacity={0.5} color="#204080" /> */}
        {/* <ContactShadows frames={1} position={[0, 0, 0]} scale={10} blur={1} opacity={0.75} /> */}
        <ContactShadows frames={1} scale={5} position={[0, -1, 0]} far={1} blur={5} opacity={0.5} color="#204080" />

        {/* <AccumulativeShadows temporal frames={100} alphaTest={0.8} scale={12}>
            <RandomizedLight amount={8} radius={4} ambient={0.5} intensity={1} position={[2.5, 5, -10]} />
        </AccumulativeShadows> */}
        <OrbitControls />
        {/* <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI / 2.1} /> */}

      </Canvas>
    )
  }
  