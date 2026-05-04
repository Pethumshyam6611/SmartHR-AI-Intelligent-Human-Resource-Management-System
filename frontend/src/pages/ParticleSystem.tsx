import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import HandTracker from '../components/particles/HandTracker';
import Scene from '../components/particles/Scene';
import Controls from '../components/particles/Controls';

const ParticleSystem = () => {
    const navigate = useNavigate();
    const [currentShape, setCurrentShape] = useState('heart');
    const [particleColor, setParticleColor] = useState('#ff69b4');
    const [tension, setTension] = useState(0);

    return (
        <div className="w-full h-screen bg-black overflow-hidden relative font-sans">
            {/* Back Button */}
            <button
                onClick={() => navigate('/')}
                className="absolute top-4 left-4 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all backdrop-blur-sm"
            >
                <ArrowLeft size={24} />
            </button>

            {/* Hand Tracker (Hidden/Overlay) */}
            <HandTracker onTensionChange={setTension} />

            {/* 3D Canvas */}
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 20], fov: 60 }}>
                    <color attach="background" args={['#050505']} />
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />

                    <Suspense fallback={null}>
                        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                        <Scene shape={currentShape} color={particleColor} tension={tension} />
                        <OrbitControls enableZoom={true} enablePan={false} autoRotate autoRotateSpeed={0.5} />
                    </Suspense>
                </Canvas>
            </div>

            {/* UI Controls */}
            <Controls
                currentShape={currentShape}
                onShapeChange={setCurrentShape}
                color={particleColor}
                onColorChange={setParticleColor}
            />

            {/* Instructions Overlay */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 text-white/50 text-sm pointer-events-none text-center">
                <p>Open/Close hands to breathe with particles</p>
                <p className="text-xs opacity-50 mt-1">Status: {tension > 0.1 ? 'Hand Detected' : 'Waiting for Hands...'}</p>
            </div>
        </div>
    );
};

export default ParticleSystem;
