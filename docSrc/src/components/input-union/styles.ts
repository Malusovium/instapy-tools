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

const childWrapper =
  style
  ( { color: '#444'
    }
  )

const pickListWrapper =
  style
  ( {}
  )

const hidden =
  style
  ( { display: 'none'
    }
  )

export
  { container
  , name
  , childWrapper
  , pickListWrapper
  , hidden
  }
