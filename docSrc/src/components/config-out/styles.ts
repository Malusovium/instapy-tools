// styles
import { style} from 'typestyle'
import { vertical } from 'csstips'

const container =
  style
  ( { borderStyle: 'solid'
    , padding: '.4em'
    , overflowY: 'scroll'
    , maxHeight: '90vh'
    }
  , vertical
  )

const name =
  style
  ( { color: '#222'
    }
  )

const config =
  style
  ( { fontSize: '.6em'
    , backgroundColor: '#225'
    , color: 'white'
    , padding: '.2em'
    , overflowX: 'hidden'
    }
  )

export
  { container
  , name
  , config
  }
