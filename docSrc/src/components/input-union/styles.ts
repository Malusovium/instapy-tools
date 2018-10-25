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

const childWrapper =
  style
  ( { color: '#444'
    }
  )

const pickListWrapper =
  style
  ( {}
  )

const pickWrapper =
  style
  ( { position: 'relative'
    }
  )

const pick =
  style
  ( { position: 'absolute'
    , top: 0
    , bottom: 0
    , left: 0
    , right: 0
    , background: '#ccc2'
    , $nest:
      { '&:hover':
        { background: '#ccc8'
        }
      }
    }
  )

const open =
  style
  ( { transform: 'rotateX(180deg)'
    , padding: '.4em'
    , textAlign: 'center'
    , background: '#555'
    , color: 'white'
    , $nest:
      { '&:hover':
        { background: '#bbb'
        }
      }
    }
  )

export
  { container
  , name
  , childWrapper
  , pickListWrapper
  , hidden
  , included
  , pick
  , pickWrapper
  , open
  }
