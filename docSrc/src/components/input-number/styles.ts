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
  ( { fontSize: '1.2em'
    , background: '#bbb'
    , color: 'white'
    , padding: '.2em'
    , marginBottom: '.2em'
    }
  )

const hidden =
  style
  ( { display: 'none !important'
    }
  )

const included =
  style
  ( { background: '#6c6' }
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
  , hidden
  , included
  , wrapper
  , input
  , value
  }
