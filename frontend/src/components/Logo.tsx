import { Hexagon } from 'lucide-react';

interface LogoProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ className = '', size = 'md' }: LogoProps) {
    const sizes = {
        sm: { icon: 24, text: 'text-lg' },
        md: { icon: 32, text: 'text-2xl' },
        lg: { icon: 48, text: 'text-3xl' },
    };

    const { icon: iconSize, text: textSize } = sizes[size];

    return (
        <div className={`flex items-center gap-2 font-display ${className}`}>
            <div className="relative flex items-center justify-center">
                <Hexagon
                    size={iconSize}
                    className="text-primary-600 fill-primary-600/20"
                    strokeWidth={2}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`font-bold text-primary-400 ${size === 'sm' ? 'text-[10px]' : 'text-xs'}`}>
                        AI
                    </span>
                </div>
            </div>
            <div className="flex flex-col -space-y-1">
                <span className={`font-bold tracking-tight text-white ${textSize}`}>
                    Smart<span className="text-secondary-500">HR</span>
                </span>
            </div>
        </div>
    );
}
