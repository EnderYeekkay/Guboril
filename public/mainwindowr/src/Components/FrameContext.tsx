import { createContext, useContext, useState } from "react";

export type Frame = 'home' | 'settings';

export interface FrameContextType{
    frame: Frame;
    setFrame: (frame: Frame) => void;
}

export const FrameContext = createContext<FrameContextType|null>(null);


export function FrameProvider({children}: {children: React.ReactNode}) {
    const [frame, setFrame] = useState<Frame>('home');
    return (
        <FrameContext.Provider value={{frame, setFrame}}>
            {children}
        </FrameContext.Provider>
    )
}

export function useFrame() {
    const context = useContext(FrameContext);
    if (!context) {
        throw new Error('useFrame must be used within a FrameProvider');
    }
    return context;
}