// styles
import { style} from 'typestyle'
import { vertical, horizontal } from 'csstips'

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

const wrapper =
  style
  ( { justifyContent: 'space-between' }
  , horizontal
  )

const input =
  style
  ( { color: '#444'
    }
  )

const value =
  style
  ( { color: '#222'
    }
  )

export
  { container
  , name
  , wrapper
  , input
  , value
  }
