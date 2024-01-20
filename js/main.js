import { fetchAllPublicRepos, fetchAllReposAuth } from "./github.js"
import { generateCommand } from './command.js'

let scope = 'public'

const usernameInputElement = document.getElementById('username')
const tokenInputElement = document.getElementById('token')
const generateElement = document.getElementById('generate')
const generateAllElement = document.getElementById('generate-all')
generateElement.addEventListener('click', onGenerateButtonClick)
generateAllElement.addEventListener('click', onGenerateAllButtonClick)
document.getElementById('username').addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        onGenerateButtonClick()
    }
})
document.getElementById('token').addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        onGenerateAllButtonClick()
    }
})

async function onGenerateButtonClick() {
    const username = usernameInputElement.value
    generateElement.setAttribute('disabled', 'true')
    try {
        await fetchAllPublicRepos(username)
        generateCommand()
    } catch (e) {
        document.getElementById('loading').innerHTML = e.message
    }
    generateElement.removeAttribute('disabled')
}

async function onGenerateAllButtonClick() {
    const token = tokenInputElement.value
    generateAllElement.setAttribute('disabled', 'true')
    try {
        await fetchAllReposAuth(token)
        generateCommand()
    } catch (e) {
        document.getElementById('loading').innerHTML = e.message
    }
    generateAllElement.removeAttribute('disabled')
}

document.getElementById('username').focus()

document.getElementById('scope').addEventListener('click', (e) => {
    document.querySelector('#scope .tab--active').classList.remove('tab--active')
    e.target.classList.add('tab--active')
    showScopeTab(e.target.id)
})

function showScopeTab(scope) {
    if (scope === 'public') {
        document.getElementById('all-container').style.display = 'none'
        document.getElementById('public-container').style.display = 'block'
    } else {
        document.getElementById('all-container').style.display = 'block'
        document.getElementById('public-container').style.display = 'none'
    }
}

showScopeTab('public')