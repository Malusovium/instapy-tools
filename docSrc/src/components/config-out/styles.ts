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

const title =
  style
  ( { color: '#222'
    }
  )

const paragraph =
  style
  ( { color: '#444'
    }
  )

export
  { container
  , title
  , paragraph
  }
