import Button from '../../../../../button/button.tsx'
import SettingBlock from '../../../SettingBlock/SettingBlock.tsx'
import styles from './debug.module.scss'
import OpenFolder from '../strategies/open_folder.svg.tsx'
export default function Debug() {
    return <div className={styles.block}>
		<SettingBlock text='AppData'>
            <Button
                label='Открыть'
                Icon={<OpenFolder/>}
                action={core.openAppData}
            />
        </SettingBlock>
    </div>
}
