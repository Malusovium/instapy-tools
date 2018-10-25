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

const hidden =
  style
  ( { display: 'none'
    }
  )

const included =
  style
  ( { background: '#6c6' }
  )

const bool =
  style
  ( { color: '#fff'
    , textAlign: 'center'
    , padding: '.4em'
    , background: '#777'
    }
  )

const on =
  style
  ( { background: '#3c3'
    }
  )

export
  { container
  , name
  , hidden
  , included
  , bool
  , on
  }
