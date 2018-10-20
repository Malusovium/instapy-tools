// styles
import { style} from 'typestyle'
import { vertical, horizontal } from 'csstips'

const container =
  style
  ( { borderStyle: 'solid'
    , padding: '.8rem'
    }
  , vertical
  )

const name =
  style
  ( { color: 'white'
    , background: '#ccc'
    , padding: '.4em'
    }
  )

const includeTrue =
  style
  ( { background: '#3c3' }
  )

export
  { container
  , name
  , includeTrue
  }
