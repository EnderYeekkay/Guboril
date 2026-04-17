import styles from './EnhancedTextArea.module.scss'
interface IEnhancedTextAreaProps {
    addictionClasses?: string[]
    rowRegex: RegExp
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
    attrs: React.TextareaHTMLAttributes<HTMLTextAreaElement>
}
export default function EnhancedTextArea({
    addictionClasses,
    onChange,
    attrs
}: IEnhancedTextAreaProps) {
    return <textarea
        className={`${styles.block} ${addictionClasses?.join(' ')}`}
        autoFocus={true}
        minLength={1}
        onChange={onChange}
        {
            ...{attrs}
        }
    >
		
    </textarea>
}
