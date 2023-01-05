
import { useEffect, useRef } from "react";
import * as THREE from "three";

const App = () => {

  const mountRef = useRef(null);

  useEffect(() => {

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    const renderer = new THREE.WebGLRenderer();

    renderer.setSize( window.innerWidth, window.innerHeight );
    const currentRef = mountRef.current;
    currentRef.appendChild( renderer.domElement );

    // const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const geometry = new THREE.IcosahedronGeometry( 1, 0 );

    const material = new THREE.MeshBasicMaterial( { color: 0x0000ffaa } );
    const cube = new THREE.Mesh( geometry, material );    
    scene.add( cube );

    const edges = new THREE.EdgesGeometry( geometry );
    const line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x000000 } ) );
    scene.add( line );    

    camera.position.z = 5;

    const animate = function () {
      requestAnimationFrame( animate );
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      cube.rotation.z += 0.01;
      console.log(`cube.rotation.z: ${cube.rotation.z}`);
      // cube.material.color
      line.rotation.x += 0.01;
      line.rotation.y += 0.01;
      line.rotation.z += 0.01;
      renderer.render( scene, camera );
    }

    let onWindowResize = function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize( window.innerWidth, window.innerHeight );
    }

    window.addEventListener("resize", onWindowResize, false);

    animate();

    return () => currentRef.removeChild( renderer.domElement);
  }, []);

  return (
    <div ref={mountRef}>

    </div>
  );
}

export default App;