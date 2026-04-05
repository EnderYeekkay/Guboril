import { createContext, useContext, useState } from "react";

export type Frame = 'home' | 'settings';

export interface FrameContextType{
    frame: Frame;
    setFrame: (frame: Frame) => void;
}

export const FrameContext = createContext<FrameContextType|null>(null) as React.Context<FrameContextType>;


export function FrameProvider({children}: {children: React.ReactNode}) {
    const [frame, setFrame] = useState<Frame>('home');
    return (
        <FrameContext.Provider value={{frame, setFrame}}>
            {children}
        </FrameContext.Provider>
    )
}