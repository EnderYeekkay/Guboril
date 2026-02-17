import { createContext } from "react";
import { ModalOptions } from "./ModalProvider.tsx";

export interface ModalContext {
    sendModal: (props: ModalOptions) => Promise<boolean>
    clearModal: () => void
}
const ModalContext = createContext<ModalContext>(null)
export default ModalContext
