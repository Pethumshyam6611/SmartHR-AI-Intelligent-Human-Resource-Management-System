import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SceneProps {
    shape: string;
    color: string;
    tension: number;
}

const COUNT = 3000;

// Helper to generate points for different shapes
const getShapePoints = (shape: string, count: number) => {
    const points = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
        let x = 0, y = 0, z = 0;
        const i3 = i * 3;
        // const t = (i / count) * Math.PI * 2 * 10;

        switch (shape) {
            case 'heart': {
                // Heart curve
                // x = 16sin^3(t)
                // y = 13cos(t) - 5cos(2t) - 2cos(3t) - cos(4t)
                // Add some random Z depth
                // const theta = Math.random() * Math.PI * 2;
                // const phi = Math.random() * Math.PI;
                // const r = Math.sqrt(Math.random()) * 0.5 + 0.5;

                // Classic parametric heart (2D extruded)
                const ht = Math.random() * Math.PI * 2;
                x = 0.5 * (16 * Math.pow(Math.sin(ht), 3));
                y = 0.5 * (13 * Math.cos(ht) - 5 * Math.cos(2 * ht) - 2 * Math.cos(3 * ht) - Math.cos(4 * ht));
                z = (Math.random() - 0.5) * 5;
                break;
            }

            case 'flower': {
                // 3D Rose/Flower
                const k = 4; // number of petals
                const theta = Math.random() * Math.PI * 2;
                const phi = (Math.random() - 0.5) * Math.PI;
                const r = Math.cos(k * theta) + 2;

                x = r * Math.cos(theta) * Math.cos(phi) * 5;
                y = r * Math.sin(theta) * Math.cos(phi) * 5;
                z = r * Math.sin(phi) * 5;
                break;
            }

            case 'saturn': {
                // Sphere + Ring
                const isRing = Math.random() > 0.6;
                if (isRing) {
                    const angle = Math.random() * Math.PI * 2;
                    const radius = 8 + Math.random() * 4;
                    x = Math.cos(angle) * radius;
                    z = Math.sin(angle) * radius;
                    y = (Math.random() - 0.5) * 0.5; // Thin ring
                } else {
                    const r = 5;
                    const u = Math.random();
                    const v = Math.random();
                    const theta = 2 * Math.PI * u;
                    const phi = Math.acos(2 * v - 1);
                    x = r * Math.sin(phi) * Math.cos(theta);
                    y = r * Math.sin(phi) * Math.sin(theta);
                    z = r * Math.cos(phi);
                }
                break;
            }

            case 'buddha':
                // Approximating a sitting meditate shape (Triangle-ish Stack)
                // Base: Wide, Top: Head
                {
                    // const u = Math.random();
                    const h = Math.random() * 10 - 5; // Height -5 to 5
                    // Width varies by height (wider at bottom)
                    const w = (1 - (h + 5) / 10) * 6 + 1;
                    const angle = Math.random() * Math.PI * 2;

                    if (h > 3) {
                        // Head
                        const r = 1.5;
                        const theta = Math.random() * Math.PI * 2;
                        const phi = Math.acos(2 * Math.random() - 1);
                        x = r * Math.sin(phi) * Math.cos(theta);
                        y = h;
                        z = r * Math.cos(phi);
                    } else {
                        // Body
                        x = Math.cos(angle) * w * Math.sqrt(Math.random());
                        y = h;
                        z = Math.sin(angle) * w * Math.sqrt(Math.random());
                    }
                }
                break;

            case 'fireworks': {
                // Explosion sphere
                const r = 10 * Math.cbrt(Math.random()); // Uniform sphere
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                x = r * Math.sin(phi) * Math.cos(theta);
                y = r * Math.sin(phi) * Math.sin(theta);
                z = r * Math.cos(phi);
                break;
            }

            default:
                x = (Math.random() - 0.5) * 10;
                y = (Math.random() - 0.5) * 10;
                z = (Math.random() - 0.5) * 10;
        }

        points[i3] = x;
        points[i3 + 1] = y;
        points[i3 + 2] = z;
    }
    return points;
};

const Scene = ({ shape, color, tension }: SceneProps) => {
    const pointsRef = useRef<THREE.Points>(null);

    // Create target positions for all shapes upfront or calculate on fly? 
    // Calculating on fly for transition is better if we store "current" and "target".
    // Actually, let's just use one buffer and lerp the vertices in useFrame.
    // But updating 3000 vertices every frame in JS might be heavy? 3000 is fine.

    const targetPositions = useMemo(() => {
        return {
            heart: getShapePoints('heart', COUNT),
            flower: getShapePoints('flower', COUNT),
            saturn: getShapePoints('saturn', COUNT),
            buddha: getShapePoints('buddha', COUNT),
            fireworks: getShapePoints('fireworks', COUNT),
        };
    }, []);

    const currentPositions = useRef(new Float32Array(COUNT * 3));

    // Initialize
    useMemo(() => {
        const start = targetPositions[shape as keyof typeof targetPositions] || targetPositions.heart;
        currentPositions.current.set(start);
    }, []);

    useFrame((state) => {
        if (!pointsRef.current) return;

        const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
        const target = targetPositions[shape as keyof typeof targetPositions] || targetPositions.heart;

        // Time factor for animation (breathing/rotating)
        const time = state.clock.getElapsedTime();

        // Base rotation
        pointsRef.current.rotation.y += 0.002;
        if (shape === 'saturn') pointsRef.current.rotation.x = 0.5;
        else pointsRef.current.rotation.x = 0;

        // Expansion factor based on tension (0 to 1) + breathing
        // Tension 0 = Base size
        // Tension 1 = Explode/Expand
        const expansion = 1 + tension * 2 + Math.sin(time) * 0.05;

        for (let i = 0; i < COUNT; i++) {
            const i3 = i * 3;

            // Lerp towards target shape
            // We do a soft lerp for shape transition
            positions[i3] += (target[i3] * expansion - positions[i3]) * 0.05;
            positions[i3 + 1] += (target[i3 + 1] * expansion - positions[i3 + 1]) * 0.05;
            positions[i3 + 2] += (target[i3 + 2] * expansion - positions[i3 + 2]) * 0.05;

            // Add some noise/movement based on shape
            if (shape === 'fireworks') {
                positions[i3 + 1] -= 0.01; // Gravityish
                if (positions[i3 + 1] < -10) positions[i3 + 1] = 10;
            }
        }

        pointsRef.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={COUNT}
                    array={currentPositions.current}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.15}
                color={color}
                sizeAttenuation
                transparent
                opacity={0.8}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};

export default Scene;
