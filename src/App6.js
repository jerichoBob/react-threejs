import * as THREE from 'three'
import { useState, useRef } from 'react'
import { Canvas, extend, useFrame } from '@react-three/fiber'
import {  OrbitControls, AccumulativeShadows, RandomizedLight, Center, Environment, ContactShadows } from '@react-three/drei'

const ball_size = 0.25;
const rad = ball_size * 3;

const sph_x = (r, theta, phi) => r * Math.cos(phi) * Math.sin(theta);
const sph_y = (r, theta, phi) => r * Math.sin(phi) * Math.sin(theta);
const sph_z = (r, theta, phi) => r * Math.cos(theta);

/**
 * 
 */
const drawnParticles = {};
const Point = (size, r, theta, phi) => {
    return({
        drawn: false,
        size: size, 
        position: [sph_x(r, theta, phi), sph_y(r, theta, phi), sph_z(r, theta, phi)]
    })
}

const Model = (props) => {
    const theta_top = Math.PI/2-Math.acos(1/Math.sqrt(3));
    const theta_bot = Math.PI/2-Math.acos(1/Math.sqrt(3))+Math.PI;

    const Origin = Point(ball_size, 0, Math.PI/2, Math.PI*0/3);
    const Points = [];
    Points.push(Point(ball_size, rad, Math.PI/2, Math.PI*0/3));
    Points.push(Point(ball_size, rad, Math.PI/2, Math.PI*1/3));
    Points.push(Point(ball_size, rad, Math.PI/2, Math.PI*2/3));
    Points.push(Point(ball_size, rad, Math.PI/2, Math.PI*3/3));
    Points.push(Point(ball_size, rad, Math.PI/2, Math.PI*4/3));
    Points.push(Point(ball_size, rad, Math.PI/2, Math.PI*5/3));
    
    Points.push(Point(ball_size, rad, theta_top, Math.PI*1/6));    
    Points.push(Point(ball_size, rad, theta_top, Math.PI*5/6));    
    Points.push(Point(ball_size, rad, theta_top, Math.PI*9/6));    

    Points.push(Point(ball_size, rad, theta_bot, Math.PI*1/6));    
    Points.push(Point(ball_size, rad, theta_bot, Math.PI*5/6));    
    Points.push(Point(ball_size, rad, theta_bot, Math.PI*9/6));        

    return (
        <group position={props.position}>
            {
                <SphereXYZ scale={Origin.size} position={Origin.position} color="#cccccc" />
            }
            {
                Points.map((data, index)=>(
                    <SphereXYZ key={index} scale={data.size} position={data.position} color="#aabbcc" />

                ))
            }

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
  