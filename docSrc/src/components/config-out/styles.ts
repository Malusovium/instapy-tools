// styles
import { style} from 'typestyle'
import { vertical } from 'csstips'

const container =
  style
  ( { borderStyle: 'solid'
    , padding: '.4em'
    }
  , vertical
  )

const name =
  style
  ( { color: '#222'
    }
  )

const config =
  style
  ( { fontSize: '.6em'
    // , whiteSpace: 'pre-line'
    , backgroundColor: '#225'
    , color: 'white'
    , padding: '.2em'
    }
  )

export
  { container
  , name
  , config
  }
