// styles
import { style} from 'typestyle'
import { vertical, horizontal } from 'csstips'

const container =
  style
  ( { position: 'relative'
    // , backgroundColor: '#eee'
    , fontSize: '.8em'
    , borderRadius: '.4em'
    , boxShadow: '0 .1em .2em 0 rgba(0,0,0,.2)'
    , marginBottom: '.6em'
    , overflow: 'hidden'
    }
  , vertical
  )

const name =
  style
  ( { fontSize: '1.4em'
    , cursor: 'pointer'
    , color: 'white'
    , padding: '.4em'
    , background: '#ccc'
    }
  )

const includeTrue =
  style
  ( { background: '#3c3' }
  )

export
  { container
  , name
  , includeTrue
  }
