import CheckConnectionBlock from './checkConnectionBlock/checkConnectionBlock.tsx'
import CoreBlock from './coreBlock/coreBlock.tsx'
import './LeftColumn.scss'
import StatusBlock from './statusBlock/statusBlock.tsx'
export default function LeftColumn() {
    return <div id="left_column">
		  <StatusBlock/>
          <CheckConnectionBlock/>
          <CoreBlock/>
    </div>
}
