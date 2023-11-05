const formEl = document.getElementById('form')
const colorSectionEl = document.getElementById('color-section')
const hexValueSectionEl = document.getElementById('hex-value-section');
const colorPickerInput = document.getElementById('color-picker')
const selectEl = document.getElementById('select')

document.addEventListener('DOMContentLoaded', (e) => {
  loadColorsFromLocalStorage();
})

formEl.addEventListener('submit', getColorScheme);

function getColorScheme(e) {
  e.preventDefault()

  const colorHexSanitized = colorPickerInput.value.substring(1, colorPickerInput.length)
  const scheme = selectEl.options[selectEl.selectedIndex].value

  fetch(`https://www.thecolorapi.com/scheme?hex=${colorHexSanitized}&mode=${scheme}&count=5`)
    .then(response => response.json())
    .then(data => {
      clearResults()

      const colors = data.colors.map(color => color.hex.value)
      localStorage.setItem('colors', JSON.stringify(colors))

      for (color of data.colors) {
        const hex = color.hex.value
        renderColor(hex)
        renderHexValue(hex)
      }
    })
}

function renderColor(hex) {
  const colorDiv = document.createElement('div')
  colorDiv.className = "color"
  colorDiv.style.background = hex
  colorSectionEl.appendChild(colorDiv)
}

function renderHexValue(hex) {
  const hexValue = document.createElement('p')
  hexValue.className = "hex-value"
  hexValue.textContent = hex
  hexValueSectionEl.style.display = 'flex'
  hexValueSectionEl.appendChild(hexValue)

  hexValue.addEventListener('click', () => {
    copyToClipboard(hex)
  })
}

function clearResults() {
  colorSectionEl.innerHTML = ''
  hexValueSectionEl.innerHTML = ''
}

function copyToClipboard(value) {
  navigator.clipboard.writeText(value)
    .then(() => {
      const messageEl = document.createElement('div')
      messageEl.className = 'message'
      messageEl.textContent = `Copied to clipboard: ${value} ✅`

      colorSectionEl.appendChild(messageEl)

      setTimeout(() => { messageEl.remove() }, 2000)
    })
    .catch(err => {
      console.error('Unable to copy to clipboard', err)
    })
}

function loadColorsFromLocalStorage() {
  const storedColors = localStorage.getItem('colors')
  if (storedColors) {
    const colors = JSON.parse(storedColors)
    colors.forEach(color => {
      renderColor(color)
      renderHexValue(color)
    })
  }
}