import './CheckConnectionBlock.scss'
import ConnectionChecker from './connectionChecker/connectionChecker.tsx'

export default function CheckConnectionBlock() {
    return <div className='container'>
		  <ConnectionChecker/>
    </div>
}
