import { createMapByXMindMark } from '../../src/parser/mindmark'
import { loadFileAsText } from './loader'
import { loadExternalScript } from './loader'

const renderEngineDownloadUrl = 'https://assets.xmind.net/snowbrush/snowbrush-2.47.0.js'

function initScript() {
  const result = document.getElementById('result') as HTMLDivElement
  const convert = document.getElementById('convert') as HTMLButtonElement
  result.classList.add('loading')
  convert.classList.add('loading')

  loadExternalScript(renderEngineDownloadUrl).then(() => {
    result.classList.remove('loading')
    convert.classList.remove('loading')
  })

  return
}

function initView() {
  const fileSelect = document.getElementById('file-select') as HTMLInputElement
  const input = document.getElementById('input') as HTMLTextAreaElement
  const convert = document.getElementById('convert') as HTMLButtonElement
  const result = document.getElementById('result') as HTMLDivElement

  input.addEventListener('keydown', (e) => {
    // Allow input tab in textarea
    if (e.key === 'Tab') {
      e.preventDefault()
      const startPos = input.selectionStart
      input.value = input.value.substring(0, startPos) + '    ' + input.value.substring(input.selectionEnd)
      input.selectionStart = startPos + 4
    }
  })
  
  convert.addEventListener('click', () => {
    result.innerHTML = ''
    
    const model = createMapByXMindMark(input.value)
    const sb = new Snowbrush.SheetEditor({
      el: result,
      model: new Snowbrush.Model.Sheet(model)
    })
    sb.on('SHEET_CONTENT_LOADED', () => {
      sb.execAction('fitMap')
    })
    sb.initInnerView()
  })

  fileSelect.addEventListener('input', async () => {
    const file = fileSelect.files?.[0]
    if (file) {
      input.classList.add('loading')

      const result = await loadFileAsText(file)
      input.value = result
      input.classList.remove('loading')
      fileSelect.files = null
    }
  })
}

function main() {
  initScript()
  initView()
}

main()