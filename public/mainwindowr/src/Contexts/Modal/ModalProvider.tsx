import { useEffect, useRef, useState } from "react";
import { ModalProps } from "./modal/modal.tsx";
import ModalContext from "./ModalContext.ts";
import Modal from "./modal/modal.tsx";
import Button, { ButtonStyle } from "../../Components/button/button.tsx";
export interface ModalOptions {
    title: string
    description?: string
    actionRow?: React.ReactNode[]

    onSubmit?: () => void
    submitText?: string

    onCancel?: () => void
    cancelText?: string
}
export default function ModalProvider({ children }:ContextProps) {
    const [modalOptions, setModalOptions] = useState<ModalOptions>(null)
    const resolve = useRef<(value: boolean) => void>(null)
    const reject = useRef<() => void>(null)
    const promise = useRef<Promise<boolean>>(null)

    useEffect(() => {

    }, [])

    function sendModal(props: ModalOptions) {
        setModalOptions({
            submitText: 'Подтвердить',
            cancelText: 'Закрыть',
            ...props
        })

        promise.current = new Promise<boolean>((res, rej) => {
            resolve.current = res
            reject.current = rej
        })
        return promise.current
    }
    return <ModalContext.Provider value={{
        sendModal
    }}>
        {children}
        {modalOptions && <Modal
            {...{...modalOptions,
                submitButton:
                    <Button
                        label='asdasd'
                        style={ButtonStyle.Primary}
                        action={() => {
                            resolve.current(true)
                            resolve.current = null
                            setModalOptions(null)
                            modalOptions.onSubmit && modalOptions.onSubmit()
                        }}
                    />,
                cancelButton:
                    <Button
                        label='asdasd'
                        style={ButtonStyle.Danger}
                        action={() => {
                            resolve.current(false)
                            resolve.current = null
                            setModalOptions(null)
                            modalOptions.onCancel && modalOptions.onCancel()
                        }}
                    />
            }}
        />}
    </ModalContext.Provider>
}