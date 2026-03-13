'use client';
import { useEffect, useRef } from 'react';

export default function ThreeBackground({ theme }) {
  const mountRef = useRef(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      const THREE = await import('three');
      if (!mountRef.current || !alive) return;

      const W = window.innerWidth, H = window.innerHeight;

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.setSize(W, H);
      renderer.setClearColor(0x000000, 0);
      mountRef.current.appendChild(renderer.domElement);

      const scene  = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(70, W / H, 0.1, 800);
      camera.position.z = 35;

      /* Stars */
      const N = 2400, pos = new Float32Array(N * 3);
      for (let i = 0; i < N; i++) {
        pos[i*3]   = (Math.random()-.5)*280;
        pos[i*3+1] = (Math.random()-.5)*280;
        pos[i*3+2] = (Math.random()-.5)*180;
      }
      const starGeo = new THREE.BufferGeometry();
      starGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({
        color: theme === 'light' ? 0x5555aa : 0xffffff,
        size: 0.14, transparent: true,
        opacity: theme === 'light' ? 0.22 : 0.50,
        sizeAttenuation: true,
      }));
      scene.add(stars);

      /* Gold dust */
      const D = 600, dpos = new Float32Array(D * 3);
      for (let i = 0; i < D; i++) {
        dpos[i*3]   = (Math.random()-.5)*120;
        dpos[i*3+1] = (Math.random()-.5)*120;
        dpos[i*3+2] = (Math.random()-.5)*60;
      }
      const dustGeo = new THREE.BufferGeometry();
      dustGeo.setAttribute('position', new THREE.BufferAttribute(dpos, 3));
      const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({
        color: 0xf5c518, size: 0.22, transparent: true,
        opacity: theme === 'light' ? 0.18 : 0.30,
        sizeAttenuation: true,
      }));
      scene.add(dust);

      /* Rings */
      const addRing = (r, tube, color, rx, ry, rz, op) => {
        const m = new THREE.Mesh(
          new THREE.TorusGeometry(r, tube, 6, 100),
          new THREE.MeshBasicMaterial({ color, transparent: true, opacity: theme === 'light' ? op * 0.55 : op })
        );
        m.rotation.set(rx, ry, rz);
        scene.add(m); return m;
      };
      const ring1 = addRing(18, 0.08, 0xf5c518, Math.PI/5, 0, 0, 0.10);
      const ring2 = addRing(26, 0.05, 0xe8534b, 0, Math.PI/4, Math.PI/7, 0.07);
      const ring3 = addRing(12, 0.06, 0xffffff, Math.PI/3, Math.PI/6, 0, 0.05);

      /* Orbs */
      const orbs = [];
      for (let i = 0; i < 6; i++) {
        const m = new THREE.Mesh(
          new THREE.SphereGeometry(Math.random()*1.8+0.4, 12, 12),
          new THREE.MeshBasicMaterial({ color: i%2 ? 0xf5c518 : 0xe8534b, transparent: true, opacity: theme === 'light' ? 0.045 : 0.07 })
        );
        m.position.set((Math.random()-.5)*70, (Math.random()-.5)*70, (Math.random()-.5)*30);
        scene.add(m); orbs.push(m);
      }

      let mx = 0, my = 0;
      const onMove = e => { mx = (e.clientX/W-.5)*2; my = -(e.clientY/H-.5)*2; };
      window.addEventListener('mousemove', onMove);

      const onResize = () => {
        const nW = window.innerWidth, nH = window.innerHeight;
        camera.aspect = nW/nH; camera.updateProjectionMatrix();
        renderer.setSize(nW, nH);
      };
      window.addEventListener('resize', onResize);

      let t = 0;
      const tick = () => {
        if (!alive) return;
        requestAnimationFrame(tick);
        t += 0.004;
        stars.rotation.y += 0.0002; stars.rotation.x += 0.0001;
        dust.rotation.y  -= 0.0005; dust.rotation.z  += 0.0003;
        ring1.rotation.z += 0.0012; ring1.rotation.y += 0.0004;
        ring2.rotation.x -= 0.0008; ring2.rotation.z += 0.0005;
        ring3.rotation.y += 0.0016; ring3.rotation.x -= 0.0006;
        orbs.forEach((o, i) => {
          o.position.y += Math.sin(t + i*1.1) * 0.018;
          o.position.x += Math.cos(t*0.8 + i) * 0.013;
        });
        camera.position.x += (mx*4 - camera.position.x) * 0.025;
        camera.position.y += (my*3 - camera.position.y) * 0.025;
        camera.lookAt(0,0,0);
        renderer.render(scene, camera);
      };
      tick();

      mountRef._cleanup = () => {
        alive = false;
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('resize', onResize);
        renderer.dispose();
        if (renderer.domElement.parentNode === mountRef.current) {
          mountRef.current?.removeChild(renderer.domElement);
        }
      };
    })();

    return () => { alive = false; mountRef._cleanup?.(); };
  }, [theme]);

  return <div ref={mountRef} id="three-canvas" aria-hidden="true" />;
}
