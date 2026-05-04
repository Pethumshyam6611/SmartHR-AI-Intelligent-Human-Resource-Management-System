import { useEffect, useRef } from 'react';
import { Hands, Results } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';

interface HandTrackerProps {
    onTensionChange: (tension: number) => void;
}

const HandTracker = ({ onTensionChange }: HandTrackerProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const hands = new Hands({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
            },
        });

        hands.setOptions({
            maxNumHands: 2,
            modelComplexity: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
        });

        hands.onResults((results: Results) => {
            if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
                let totalTension = 0;

                results.multiHandLandmarks.forEach((landmarks) => {
                    // Calculate "openness" based on distance of fingertips to wrist (landmark 0)
                    // Wrist: 0
                    // Fingertips: 4 (Thumb), 8 (Index), 12 (Middle), 16 (Ring), 20 (Pinky)

                    const wrist = landmarks[0];
                    const fingertips = [4, 8, 12, 16, 20];

                    let handOpenness = 0;

                    fingertips.forEach(tipIdx => {
                        const tip = landmarks[tipIdx];
                        const distance = Math.sqrt(
                            Math.pow(tip.x - wrist.x, 2) +
                            Math.pow(tip.y - wrist.y, 2) +
                            Math.pow(tip.z - wrist.z, 2)
                        );
                        handOpenness += distance;
                    });

                    // Normalized averageish distance. 
                    // An open hand usually has avg distance around 0.3 - 0.5 depending on Z
                    // A closed fist is much smaller.
                    // We'll scale this simply to be usable.
                    totalTension += handOpenness;
                });

                // Average tension between 1 or 2 hands
                const avgTension = totalTension / results.multiHandLandmarks.length;

                // Map rough range 0.1 (closed) to 0.4 (open) -> 0 to 1
                const normalizedTension = Math.min(Math.max((avgTension - 0.1) * 3.3, 0), 1);

                onTensionChange(normalizedTension);
            } else {
                // No hands, maybe slow decay or keep last? For now set to 0.
                onTensionChange(0);
            }
        });

        if (videoRef.current) {
            const camera = new Camera(videoRef.current, {
                onFrame: async () => {
                    if (videoRef.current) {
                        await hands.send({ image: videoRef.current });
                    }
                },
                width: 640,
                height: 480,
            });
            camera.start();
        }

        // Cleanup
        return () => {
            hands.close();
            // Camera doesn't have a stop method exposed in utils effectively sometimes, 
            // but the component unmount should stop the video element.
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [onTensionChange]);

    return (
        <div className="absolute top-4 right-4 z-50 w-32 h-24 bg-black/50 rounded-lg overflow-hidden border border-white/10">
            {/* Hidden/Standard video element for debugging self view */}
            <video
                ref={videoRef}
                className="w-full h-full object-cover opacity-50"
                playsInline
            />
        </div>
    );
};

export default HandTracker;
