import { Modal } from './components/Modal'
import bot from './assets/bot.svg'
import user from './assets/user.svg'
import { debounce, $ } from './utils'
import { postData } from './utils/api'
import { ERRORS, MESSAGES } from './utils/constant'



const form = $('form')
const chatContainer = $('#chat_container')
const preloadHelperContent = $('.helper')

let loadInterval;

if (preloadHelperContent) {
    const onclickTransferToInput = e => {
        /** @type HTMLElement */
        const element = e.currentTarget
        const newValue = element?.textContent.replace(/["→]/g, '')
        form.querySelector('textarea').value = newValue
    }

    const onBuyMeCoffe = e => {
        new Modal(
            'Achetez moi un café',
            MESSAGES.coffee
        ).renderTo($('body'))
    }

    preloadHelperContent.querySelectorAll('.prompts > span')
        .forEach(prompt => {
            return prompt.addEventListener('click', onclickTransferToInput)
        })

    preloadHelperContent.querySelector('#coffee')
        .addEventListener('click', onBuyMeCoffe)
}

/**
 * 
 * @param {HTMLElement} element
 */
function loader(element) {
    element.textContent = ''

    loadInterval = setInterval(() => {
        element.textContent += '.'

        if (element.textContent === '....') {
            element.textContent = ''
        }
    }, 300)
}

/**
 * 
 * @param {HTMLElement} element
 * @param {string} text
 */
function typeText(element, text) {
    let index = 0

    let interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index)
            index++
        } else {
            clearInterval(interval)
        }
    }, 20)
}

function generateUniqueId() {
    const timestamp = Date.now()
    const randomNumber = Math.random()
    const hexadecimal = randomNumber.toString(16)

    return `id-${timestamp}-${hexadecimal}`
}

/**
 * 
 * @param {boolean} isAi
 * @param {string} value the value message
 * @param {string} uniqueId
 * 
 * @return {HTMLElement}
 */
function stripeChat(isAi, value, uniqueId) {
    /** @type {DocumentFragment} */
    const template = $('#stripeChat').content.cloneNode(true)
    const chatElement = template.firstElementChild
    /** @type {HTMLImageElement} */
    const img = chatElement.querySelector('img')
    /** @type {HTMLDivElement} */
    const messageElement = chatElement.querySelector('div.message')

    if (isAi) {
        chatElement.classList.add('ai')
        img.setAttribute('src', bot)
    } else {
        img.setAttribute('src', user)
    }
    messageElement.setAttribute('id', uniqueId)
    messageElement.innerText = value

    return chatElement
}

/**
 *
 * @param {Event} e
 */
async function handleSubmit(e) {
    e.preventDefault()

    const data = new FormData(form)

    // generate user's chatStripe
    chatContainer.append(stripeChat(false, data.get('prompt')))
    form.reset()

    // Clean the chat container
    preloadHelperContent && preloadHelperContent.remove()

    // generate bot's chatStripe
    const uniqueId = generateUniqueId()
    chatContainer.append(stripeChat(true, " ", uniqueId))

    chatContainer.scrollTop = chatContainer.scrollHeight

    const messageDiv = document.getElementById(`${uniqueId}`)

    loader(messageDiv) // run the 3 dots animation
    const serverUrl = window.location.protocol === 'http'
        ? 'http://localhost:5000'
        : 'https://codex-w3d3.onrender.com'

    // fetch the data from the backend -> bot's response
    const response = await postData(serverUrl, {
        body: JSON.stringify({
            prompt: data.get('prompt'),
        })
    })

    clearInterval(loadInterval)
    messageDiv.innerText = ''

    if (response.ok) {
        const data = await response.json()
        const parsedData = data.bot.trim()
        typeText(messageDiv, parsedData)
    } else {
        const { error } = await response.json()

        messageDiv.innerText = "An error occurred while processing your request"
        
        error.status && (new Modal(
            'Financement',
            ERRORS[429]
        ).renderTo($('body')))

        console.log(error);
    }
}

form.addEventListener('submit', handleSubmit)

form.addEventListener('keyup', debounce(e => {
    if (e.key === 'Enter') {
        handleSubmit(e)
    }
}, 500))