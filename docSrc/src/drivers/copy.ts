import { Stream } from 'xstream'
import * as clipboard from 'clipboard-polyfill'

let clip

type ClipboardCommand =
  { selector: string
  , message: string
  }

const copyListener =
  (text) =>
    () => {
      clipboard.writeText(text)
    }

const copyDriver =
  (setCopy$: Stream<ClipboardCommand>) => {
    setCopy$
      .addListener
       ( { next:
             ({selector, message}) => {
               if (clip !== undefined && clip !== null) {
                 clip.removeEventListener('click', copyListener)
               }
               clip = document.querySelector(selector)
               if (clip !== null) {
                 clip.addEventListener('click', copyListener(message))
               }
             }
         }
       )
  }

export
  { copyDriver
  }
