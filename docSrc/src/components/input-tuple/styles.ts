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
  ( { fontSize: '1.2em'
    , background: '#bbb'
    , color: 'white'
    , padding: '.2em'
    , marginBottom: '.2em'
    }
  )

const args =
  style
  ( { color: '#444'
    }
  )

const hidden =
  style
  ( { display: 'none'
    }
  )

const included =
  style
  ( { background: '#6c6' }
  )

export
  { container
  , name
  , args
  , hidden
  , included
  }
