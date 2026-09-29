import { useEffect, useRef, useState } from 'react'
import ChoicesBase from '../../../../../choicesBase/choicesBase.tsx'
import SettingBlock from '../../../SettingBlock/SettingBlock.tsx'
import styles from './fake.module.scss'
import Button, { ButtonStyle } from '../../../../../button/button.tsx'
import { ArchiveRestore } from 'lucide-react'
import Choices from 'choices.js'
import SelectBase from '../../../../../selectBase/selectBase.tsx'

export default function Fake() {
    const [fakeDiscordUDP, setFakeDiscordUDP] = useState(FakeRenderer.getFakeDiscordUDP())
    const [fakeGameFilterUDP, setFakeGameFilterUDP] = useState(FakeRenderer.getFakeGameFilterUDP())

    const fakeDiscordUDPChoicesRef = useRef<Choices.default>(null!)
    const fakeGameFilterUDPChoicesRef = useRef<Choices.default>(null!)

    const UUID = crypto.randomUUID()
    useEffect(() => {
        fakeDiscordUDPChoicesRef?.current?.setChoiceByValue(fakeDiscordUDP.shortName)
    }, [fakeDiscordUDP])
    useEffect(() => {
        fakeGameFilterUDPChoicesRef?.current?.setChoiceByValue(fakeDiscordUDP.shortName)
    }, [fakeGameFilterUDP])
    return <div className={styles.block}>
        <SettingBlock
            text={'DiscordUDP'}
        >
            <div style={{display: 'flex', gap: '5px'}}>
                <SelectBase
                    value={fakeDiscordUDP.shortName}
                    customStyles={{
                        container: (provided) => ({
                            ...provided,
                            width: '300px'
                        })
                    }}
                    onChange={(value) => {
                        FakeRenderer.changeFakeDiscordUDP(value)
                        setFakeDiscordUDP(FakeRenderer.getFakeDiscordUDP())
                    }}
                    options={FakeRenderer.All().map(el => {
                        return {
                            value: el.shortName,
                            label: el.shortName
                        }
                    })}
                    />
                <Button
                    action={() => setFakeDiscordUDP(FakeRenderer.restoreFakeDiscordUDP())}
                    label={<ArchiveRestore size={24}/>}
                    tooltip='Восстановить FakeDiscordUDP по умолчанию.'
                    addictionClasses={[styles.fake_restore_btn]}
                    style={ButtonStyle.Danger}
                    />
            </div>
        </SettingBlock>
        <SettingBlock
            text={'FakeGameFilterUDP'}
        >
            <div style={{display: 'flex', gap: '5px'}}>
                <SelectBase
                    value={fakeGameFilterUDP.shortName}
                    customStyles={{
                        container: (provided) => ({
                            ...provided,
                            width: '300px'
                        })
                    }}
                    onChange={(value) => {
                        FakeRenderer.changeFakeGameFilterUDP(value)
                        setFakeGameFilterUDP(FakeRenderer.getFakeGameFilterUDP())
                    }}
                    options={FakeRenderer.All().map(el => {
                        return {
                            value: el.shortName,
                            label: el.shortName
                        }
                    })}
                    />
                <Button
                    action={() => setFakeGameFilterUDP(FakeRenderer.restoreFakeGameFilterUDP())}
                    label={<ArchiveRestore size={24}/>}
                    tooltip='Восстановить FakeGameFilterUDP по умолчанию.'
                    addictionClasses={[styles.fake_restore_btn]}
                    style={ButtonStyle.Danger}
                    />
            </div>
        </SettingBlock>
    </div>
}
