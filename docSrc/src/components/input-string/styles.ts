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

const input =
  style
  ( { color: '#444'
    }
  )

export
  { container
  , name
  , input
  }
