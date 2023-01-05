import * as THREE from 'three'
import { useState, useRef } from 'react'
import { Canvas, extend, useFrame } from '@react-three/fiber'
import { useGLTF, Clone, OrbitControls, AccumulativeShadows, RandomizedLight, Text, Effects, Environment, Center, ContactShadows } from '@react-three/drei'

const Model = (props) => {
    const ball_size = 0.25;
    const rad = ball_size * 4;
    const x1 = rad * Math.cos(0);
    const z1 = rad * Math.sin(0);
    return (
        <group position={[0, -1, -2]}>
            <Sphere scale={ball_size} position={[0, 0, 0]} color="#000000" />

            <Sphere scale={ball_size} position={[rad * Math.cos(Math.PI*0/3), 0, rad * Math.sin(Math.PI*0/3)]} color="#ff0000" />
            <Sphere scale={ball_size} position={[rad * Math.cos(Math.PI*1/3), 0, rad * Math.sin(Math.PI*1/3)]} color="#770000" />
            <Sphere scale={ball_size} position={[rad * Math.cos(Math.PI*2/3), 0, rad * Math.sin(Math.PI*2/3)]} color="#333300" />
            <Sphere scale={ball_size} position={[rad * Math.cos(Math.PI*3/3), 0, rad * Math.sin(Math.PI*3/3)]} color="#337700" />
            <Sphere scale={ball_size} position={[rad * Math.cos(Math.PI*4/3), 0, rad * Math.sin(Math.PI*4/3)]} color="#33ff00" />
            <Sphere scale={ball_size} position={[rad * Math.cos(Math.PI*5/3), 0, rad * Math.sin(Math.PI*5/3)]} color="#777700" />

            <Sphere scale={ball_size} position={[rad * Math.cos(Math.PI*0/3), 4, rad * Math.sin(Math.PI*0/3)]} color="#000077" />

            <AccumulativeShadows temporal frames={100} alphaTest={0.8} scale={12}>
            <RandomizedLight amount={8} radius={4} ambient={0.5} intensity={1} position={[2.5, 5, -10]} />
            </AccumulativeShadows>
            {/* <ContactShadows frames={1} scale={5} position={[0, -1, 0]} far={1} blur={5} opacity={0.5} color="#204080" /> */}
        </group>
    )

}

export default function App() {

  return (
    // eventPrefix="client" to get client instead of offset coordinates
    // offset would reset xy to 0 when hovering the html overlay
    <Canvas eventPrefix="client" shadows camera={{ position: [1, 0.5, -1] }}>
      {/* <color attach="background" args={['#f0f0f']} /> */}
      <ambientLight intensity={1} />
      {/* <spotLight position={[10, 10, 10]} angle={0.5} penumbra={1} castShadow />
      <pointLight position={[-10, 0, -10]} intensity={2} /> */}
      <Model position={[0, 10, 0]} />
      {/* <Environment preset="city" /> */}
      <ContactShadows frames={1} scale={5} position={[0, -1, 0]} far={1} blur={5} opacity={0.5} color="#204080" />

      {/* <Postpro /> */}
      <Rig />
      <OrbitControls />

    </Canvas>
  )
}

function Postpro() {
  const ref = useRef()
  useFrame((state) => (ref.current.time = state.clock.elapsedTime * 3))
  return (
    <Effects>
      <waterPass ref={ref} factor={0.5} />
      <glitchPass />
    </Effects>
  )
}

function Rig({ vec = new THREE.Vector3() }) {
  useFrame((state) => {
    state.camera.position.lerp(vec.set(1 + state.pointer.x, 0.5, 3), 0.01)
    state.camera.lookAt(0, 0, 0)
  })
}

function Sphere(props) {
  return (
    <Center top {...props}>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial color={props.color}/>
      </mesh>
    </Center>
  )
}

function Input(props) {
  const [text, set] = useState('hello world ...')
  return (
    <group {...props}>
      <Text position={[-1.2, -0.022, 0]} anchorX="0px" font="/Inter-Regular.woff" fontSize={0.335} letterSpacing={-0.0}>
        {text}
        <meshStandardMaterial color="black" />
      </Text>
      <mesh position={[0, -0.022, 0]} scale={[2.5, 0.48, 1]}>
        <planeGeometry />
        <meshBasicMaterial transparent opacity={0.3} depthWrite={false} />
      </mesh>
      {/* <Html transform>
        <ControlledInput type={text} onChange={(e) => set(e.target.value)} value={text} />
      </Html> */}
    </group>
  )
}
