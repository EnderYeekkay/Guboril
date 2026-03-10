import styles from './general.module.scss'
import SettingBlock from '../../../SettingBlock/SettingBlock.tsx'
import Button from '../../../../../button/button.tsx'
import { useEffect, useRef } from 'react'
import ChoicesBase from '../../../../../choicesBase/choicesBase.tsx'

export default function General() {
    return <div className={`${styles.block}`}>

        <SettingBlock text='test'>
            <ChoicesBase
                onChange={(event) => console.log(event.target.value)}
                choicesOptions={{searchEnabled: false}}
            >
                <option value="a">aaa</option>
                <option value="b">dfgfgsdafsgxgdfsdfgs</option>
                <option value="c">bbbbb</option>
                <option value="d">5678ujyhtgfbvdcxuyjhgfv</option>
            </ChoicesBase>
        </SettingBlock>
        <SettingBlock text='test'>
            <Button
                label='ASd'
                action={() => {}}
            />
        </SettingBlock>
        <SettingBlock text='test'>
            <Button
                label='ASd'
                action={() => {}}
            />
        </SettingBlock>
        <SettingBlock text='test'>
            <Button
                label='ASd'
                action={() => {}}
            />
        </SettingBlock>
        <SettingBlock text='test'>
            <Button
                label='ASd'
                action={() => {}}
            />
        </SettingBlock>
        <SettingBlock text='test'>
            <Button
                label='ASd'
                action={() => {}}
            />
        </SettingBlock>
        <SettingBlock text='test'>
            <Button
                label='ASd'
                action={() => {}}
            />
        </SettingBlock>
        <SettingBlock text='test'>
            <Button
                label='ASd'
                action={() => {}}
            />
        </SettingBlock>
        <SettingBlock text='test'>
            <Button
                label='ASd'
                action={() => {}}
            />
        </SettingBlock>
        <SettingBlock text='test'>
            <Button
                label='ASd'
                action={() => {}}
            />
        </SettingBlock>
        <SettingBlock text='test'>
            <Button
                label='ASd'
                action={() => {}}
            />
        </SettingBlock>

    </div>
}
