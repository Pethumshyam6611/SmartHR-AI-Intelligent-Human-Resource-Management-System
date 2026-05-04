// import React from 'react';

interface ControlsProps {
    currentShape: string;
    onShapeChange: (shape: string) => void;
    color: string;
    onColorChange: (color: string) => void;
}

const SHAPES = [
    { id: 'heart', label: 'Heart', icon: '❤️' },
    { id: 'flower', label: 'Flower', icon: '🌸' },
    { id: 'saturn', label: 'Saturn', icon: '🪐' },
    { id: 'buddha', label: 'Buddha', icon: '🧘' },
    { id: 'fireworks', label: 'Fireworks', icon: '🎆' },
];

const Controls = ({ currentShape, onShapeChange, color, onColorChange }: ControlsProps) => {
    return (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-white flex flex-col gap-4 shadow-xl pointer-events-auto min-w-[320px]">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    Particle Control
                </h3>
                <div className="flex items-center gap-2">
                    <input
                        type="color"
                        value={color}
                        onChange={(e) => onColorChange(e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer border-none bg-transparent"
                        title="Particle Color"
                    />
                </div>
            </div>

            <div className="flex gap-2 justify-center flex-wrap">
                {SHAPES.map((shape) => (
                    <button
                        key={shape.id}
                        onClick={() => onShapeChange(shape.id)}
                        className={`
              flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 w-20
              ${currentShape === shape.id
                                ? 'bg-white/20 scale-105 shadow-lg ring-1 ring-white/30'
                                : 'bg-white/5 hover:bg-white/10 hover:scale-105'}
            `}
                    >
                        <span className="text-2xl mb-1">{shape.icon}</span>
                        <span className="text-xs font-medium opacity-80">{shape.label}</span>
                    </button>
                ))}
            </div>

            <div className="text-center text-xs text-white/40 mt-2">
                Show your hands to the camera to interact
            </div>
        </div>
    );
};

export default Controls;
