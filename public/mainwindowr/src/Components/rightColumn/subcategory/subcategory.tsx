import './Subcategory.scss'

export default function Subcategory(props: {value: string}) {
    return <h3 className="subcategory">
        {props.value}
    </h3>

}
