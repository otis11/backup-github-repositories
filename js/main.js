import { fetchAllPublicRepos } from "./github.js"
import { generateCommand } from './command.js'

const usernameInputElement = document.getElementById('username')
document.getElementById('generate').addEventListener('click', onGenerateButtonClick)
document.getElementById('username').addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        onGenerateButtonClick()
    }
})

async function onGenerateButtonClick() {
    const username = usernameInputElement.value
    try {
        await fetchAllPublicRepos(username)
        generateCommand()
    } catch (e) {
        document.getElementById('loading').innerHTML = e.message
    }
}

document.getElementById('username').focus()