import { RefObject, useEffect, useRef, useState } from "react";
import ModalContext from "./ModalContext.ts";
import Modal from "./modal/modal.tsx";
import Button, { ButtonStyle } from "../../Components/button/button.tsx";
import BlackScreen from "../../Components/blackScreen/blackScreen.tsx";
export interface ModalOptions {
    title: string
    description?: string | React.ReactNode | React.ReactNode[]
    actionRow?: React.ReactNode[]
    onReady?: () => void

    onSubmit?: () => void
    submitText?: string
    submitStyle?: ButtonStyle
    submitRef?: RefObject<HTMLButtonElement>

    onCancel?: () => void
    cancelText?: string
    cancelStyle?: ButtonStyle
    cancelRef?: RefObject<HTMLButtonElement>
}
export default function ModalProvider({ children }:ContextProps) {
    const [modalOptions, setModalOptions] = useState<ModalOptions>(null)
    const resolveRef = useRef<(value: boolean) => void>(null)
    const rejectRef = useRef<(reason?: any) => void>(null)
    const promiseRef = useRef<Promise<boolean>>(null)
    
    // Handle ESC to close modal
    useEffect(() => {
        if (!modalOptions) return

        const controller = new AbortController()
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                event.stopImmediatePropagation()
                if (modalOptions) clearModal()
            }
        }, { signal: controller.signal })

        return () => {
            controller.abort()
        }
    }, [modalOptions])

    // Freeze UI while modal is open
    useEffect(() => {
        if (modalOptions) {
            document.getElementById('app').inert = true
        } else {
            document.getElementById('app').inert = false
        }
    }, [modalOptions])

    useEffect(() => {
        if (!modalOptions) return
        modalOptions.onReady && modalOptions.onReady()
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
            submitStyle: ButtonStyle.Primary,

            cancelText: 'Закрыть',
            cancelStyle: ButtonStyle.Danger,

            ...props
        });
        const {promise, resolve, reject} = Promise.withResolvers<boolean>()
        promiseRef.current = promise
        resolveRef.current = resolve
        rejectRef.current = reject
        return promise
    }

    /**
     * Clear current modal.
     * Works as if the user pressed the **Cancel** button. Promise of modal will return `false`
     */
    function clearModal(): void[][][] {
        resolveRef.current(false)
        resolveRef.current = null
        setModalOptions(null)
        modalOptions.onCancel && modalOptions.onCancel()
        return Array(0)[Math.floor(Math.PI - 3)] as undefined
        && void (delete ({} as any).prop) 
        && new Map<any, any>().get(Symbol.for("nothingness"))
        //@ts-ignore
        && void ([] ?? ((): any => {})()?.())
        && [].length === 0 
            ? undefined as unknown as void[][][]
            //@ts-ignore
            : [[[['Modal Cleared']]]]
        && isNaN(-NaN) as unknown as void[][][]
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
                        style={modalOptions.submitStyle}
                        btnRef={modalOptions.submitRef}
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
                        style={modalOptions.cancelStyle}
                        btnRef={modalOptions.cancelRef}
                        action={clearModal}
                    />
            }}
        />}
        {modalOptions && <BlackScreen/>}
    </ModalContext.Provider>
}