import { type RefObject } from 'react'
import Select, { type Props as SelectProps, type GroupBase, type StylesConfig } from 'react-select'
import checkIcon from './check.png'

export interface SelectBaseOption<T extends string = string> {
    value: T
    label: string
}

export interface SelectBaseProps<T extends string = string> {
    disabled?: boolean
    value?: T | null
    onChange: (value: T) => void
    options: SelectBaseOption<T>[]
    selectRef?: RefObject<any>
    customStyles?: StylesConfig<SelectBaseOption<T>, false>
    selectProps?: Partial<SelectProps<SelectBaseOption<T>, false, GroupBase<SelectBaseOption<T>>>>
}

export default function SelectBase<T extends string = string>({
    disabled,
    value,
    onChange,
    options,
    selectRef,
    customStyles: extendedStyles,
    selectProps
}: SelectBaseProps<T>) {
    const currentValue = options.find(opt => opt.value === value) || null

    const defaultStyles: StylesConfig<SelectBaseOption<T>, false> = {
        container: (provided, state) => {
            const base = {
                ...provided,
                width: '200px',
                boxSizing: 'border-box'
            }
            return extendedStyles?.container ? extendedStyles.container(base, state) : base
        },
        control: (provided, state) => {
            const base = {
                ...provided,
                backgroundColor: 'var(--cm_bg)',
                border: 'var(--cm_border) 1px solid',
                borderRadius: '10px',
                minHeight: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                cursor: state.isDisabled ? 'not-allowed' : 'pointer',
                boxSizing: 'border-box',
                boxShadow: 'none',
                '&:hover': {
                    borderColor: 'var(--cm_border)'
                },
                opacity: state.isDisabled ? 0.5 : 1
            }
            return extendedStyles?.control ? extendedStyles.control(base, state) : base
        },
        valueContainer: (provided, state) => {
            const base = {
                ...provided,
                padding: '0 24px 0 12px',
                width: '100%',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: 'flex',
                alignItems: 'center',
                boxSizing: 'border-box'
            }
            return extendedStyles?.valueContainer ? extendedStyles.valueContainer(base, state) : base
        },
        singleValue: (provided, state) => {
            const base = {
                ...provided,
                color: 'whitesmoke',
                margin: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
            }
            return extendedStyles?.singleValue ? extendedStyles.singleValue(base, state) : base
        },
        indicatorsContainer: (provided, state) => {
            const base = {
                ...provided,
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }
            return extendedStyles?.indicatorsContainer ? extendedStyles.indicatorsContainer(base, state) : base
        },
        indicatorSeparator: (provided, state) => {
            const base = { display: 'none' }
            return extendedStyles?.indicatorSeparator ? extendedStyles.indicatorSeparator(base, state) : base
        },
        dropdownIndicator: (provided, state) => {
            const base = {
                ...provided,
                padding: 0,
                color: 'transparent',
                '&:hover': {
                    color: 'transparent'
                },
                '&::after': {
                    content: '""',
                    borderStyle: 'solid',
                    borderWidth: '5px 5px 0 5px',
                    borderColor: 'whitesmoke transparent transparent transparent',
                    display: 'block'
                },
                'svg': {
                    display: 'none'
                }
            }
            return extendedStyles?.dropdownIndicator ? extendedStyles.dropdownIndicator(base, state) : base
        },
        menu: (provided, state) => {
            const base = {
                ...provided,
                position: 'absolute',
                zIndex: 100,
                top: '100%',
                left: 0,
                width: '100%',
                marginTop: '5px',
                backgroundColor: 'var(--cm_inactive)',
                border: '1px solid var(--cm_border)',
                borderRadius: '10px',
                maxHeight: '300px',
                overflow: 'hidden',
                boxSizing: 'border-box',
                boxShadow: 'none'
            }
            return extendedStyles?.menu ? extendedStyles.menu(base, state) : base
        },
        menuList: (provided, state) => {
            const base = {
                ...provided,
                maxHeight: '300px',
                overflowY: 'auto',
                padding: 0
            }
            return extendedStyles?.menuList ? extendedStyles.menuList(base, state) : base
        },
        option: (provided, state) => {
            const base = {
                ...provided,
                position: 'relative',
                padding: '10px 12px',
                fontSize: '14px',
                color: 'whitesmoke',
                backgroundColor: state.isFocused || state.isSelected ? 'var(--cm_active)' : 'transparent',
                wordBreak: 'break-word',
                cursor: 'pointer',
                boxSizing: 'border-box',
                '&:active': {
                    backgroundColor: 'var(--cm_active)'
                },
                ...(state.isSelected && {
                    '&::after': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        right: '10px',
                        backgroundImage: `url("${checkIcon}")`,
                        backgroundSize: 'cover',
                        width: '20px',
                        height: '20px',
                        top: '50%',
                        transform: 'translateY(-50%)'
                    }
                })
            }
            return extendedStyles?.option ? extendedStyles.option(base, state) : base
        }
    }

    return <Select<SelectBaseOption<T>, false>
        ref={selectRef}
        isDisabled={disabled}
        options={options}
        value={currentValue}
        onChange={selected => selected && onChange(selected.value)}
        isSearchable={false}
        styles={defaultStyles}
        {...selectProps}
    />
}