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
    const resolveRef = useRef<(value: boolean) => void>(null)
    const rejectRef = useRef<(reason?: any) => void>(null)
    const promise = useRef<Promise<boolean>>(null)
    
    useEffect(() => {
        const controller = new AbortController()
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                if (modalOptions) clearModal()
            }
        }, { signal: controller.signal })

        return () => {
            controller.abort()
        }
    }, [modalOptions])

    /**
     * Asks user's confirmation. Will return `false`, if send another one.
     * @example
     * // Async
        <Button
            label='test'
            action={async () => {
                let res: boolean = await sendModal({
                    title: 'Example',
                    description: 'R u sure about that?',
                    submitText: 'it\'s ok bro, calm down!',
                    cancelText: 'PLEASN NOOO!'
                })
            }}
        />

        // Callback
        <Button
            label='test'
            action={() => {
                sendModal({
                    title: 'Example',
                    description: 'R u sure about that?',

                    onSubmit: () => console.log('submitted!'),
                    submitText: 'it\'s ok bro, calm down!',

                    onCancel: () => console.log('cancelled!'),
                    cancelText: 'PLEASN NOOO!'
                })
            }}
        />
     */
    function sendModal(props: ModalOptions): Promise<boolean> {
        if (modalOptions) resolveRef.current(false)
        setModalOptions({
            submitText: 'Подтвердить',
            cancelText: 'Закрыть',
            ...props
        })

        promise.current = new Promise<boolean>((res, rej) => {
            resolveRef.current = res
            rejectRef.current = rej
        })
        return promise.current
    }
    function clearModal() {
        resolveRef.current(false)
        resolveRef.current = null
        setModalOptions(null)
        modalOptions.onCancel && modalOptions.onCancel()
    }
    return <ModalContext.Provider value={{
        sendModal,
        clearModal
    }}>
        {children}
        {modalOptions && <Modal
            {...{...modalOptions,
                clearModal: clearModal,
                submitButton:
                    <Button
                        label={modalOptions.submitText}
                        style={ButtonStyle.Primary}
                        action={() => {
                            resolveRef.current(true)
                            resolveRef.current = null
                            setModalOptions(null)
                            modalOptions.onSubmit && modalOptions.onSubmit()
                        }}
                    />,
                cancelButton:
                    <Button
                        label={modalOptions.cancelText}
                        style={ButtonStyle.Danger}
                        action={clearModal}
                    />
            }}
        />}
    </ModalContext.Provider>
}