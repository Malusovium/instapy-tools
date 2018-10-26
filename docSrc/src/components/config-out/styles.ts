// styles
import { style} from 'typestyle'
import
  { vertical
  , horizontal
  , content
  } from 'csstips'

const container =
  style
  ( { borderStyle: 'solid'
    , padding: '.4em'
    , overflowY: 'scroll'
    , height: '100%'
    }
  , vertical
  )

const head =
  style
  ( { justifyContent: 'space-between' }
  , horizontal
  )

const name =
  style
  ( { color: '#222'
    }
  )

const copy =
  style
  ( { fontSize: '1.2em'
    , padding: '.4em'
    , color: 'white'
    , backgroundColor: '#229'
    }
  , content
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
  , head
  , name
  , copy
  , config
  }
