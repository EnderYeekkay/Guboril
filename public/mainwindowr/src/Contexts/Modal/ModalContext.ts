import { createContext } from "react";
import { ModalOptions } from "./ModalProvider.tsx";

export interface ModalContext {
    sendModal: (props: ModalOptions) => Promise<boolean>
}
const ModalContext = createContext<ModalContext>(null)
export default ModalContext
