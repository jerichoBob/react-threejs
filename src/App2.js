
import { useEffect, useRef } from "react";
import * as THREE from "three";

const App2 = () => {

  const mountRef = useRef(null);

  useEffect(() => {

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    const renderer = new THREE.WebGLRenderer();

    renderer.setSize( window.innerWidth, window.innerHeight );
    const currentRef = mountRef.current;
    currentRef.appendChild( renderer.domElement );

    const geometry = new THREE.IcosahedronGeometry( 1, 4 );

    // const material = new THREE.MeshBasicMaterial( { color: 0x0000ffaa } );
    const material = new THREE.MeshNormalMaterial();

    const sphere = new THREE.Mesh( geometry, material );    
    scene.add( sphere );

    // const edges = new THREE.EdgesGeometry( geometry );
    // const line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x000000 } ) );
    // scene.add( line );       

    camera.position.z = 5;
    renderer.render( scene, camera );


    let onWindowResize = function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize( window.innerWidth, window.innerHeight );
    }

    window.addEventListener("resize", onWindowResize, false);


    return () => currentRef.removeChild( renderer.domElement);
  }, []);

  return (
    <div ref={mountRef}>

    </div>
  );
}

export default App2;