// styles
import { style} from 'typestyle'
import { vertical } from 'csstips'

const container =
  style
  ( { borderStyle: 'solid'
    , padding: '.8rem'
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
