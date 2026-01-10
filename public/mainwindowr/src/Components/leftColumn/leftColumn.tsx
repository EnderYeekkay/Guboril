import CoreBlock from './coreBlock/coreBlock.tsx'
import './LeftColumn.scss'
import StatusBlock from './statusBlock/statusBlock.tsx'
export default function LeftColumn() {
    return <div id="left_column">
		  <StatusBlock/>
          <CoreBlock/>
    </div>
}
