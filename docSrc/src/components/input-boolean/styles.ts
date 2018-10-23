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
  , bool
  , on
  }
