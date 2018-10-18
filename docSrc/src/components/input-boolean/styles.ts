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

const bool =
  style
  ( { color: '#fff'
    , textAlign: 'center'
    , padding: '.4em'
    }
  )

const on =
  style
  ( { background: '#3c3'
    }
  )

const off =
  style
  ( { background: '#777'
    }
  )

export
  { container
  , name
  , bool
  , on
  , off
  }
