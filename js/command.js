import { getRepos, getUser } from "./github.js"

let targetShell = 'sh'
const commandElement = document.getElementById('command')

function generateCommandSh() {
    const folder = folderName()
    const command = `mkdir ${folder} && cd ${folder}${getRepos().map(r => ' && wget ' + getRepoZipUrl(r) + ' -O ' + r.name + '.zip').join('')} && cd ..`
    return command
}

function getRepoZipUrl(r) {
    return r.html_url + '/archive/refs/heads/' + r.default_branch + '.zip'
}

function generateCommandPowershell() {
    const folder = folderName()
    const command = `mkdir ${folder}; cd ${folder};${getRepos().map(r => ' Invoke-WebRequest "' + getRepoZipUrl(r) + '" -Outfile ' + r.name + '.zip;').join('')} cd ..`
    return command
}

export function generateCommand() {
    if (getRepos() === null) return

    let command = ''
    if (targetShell === 'sh') {
        command = generateCommandSh()
    } else if (targetShell === 'powershell') {
        command = generateCommandPowershell()
    }
    commandElement.value = command
    navigator.clipboard.writeText(command).then(
        () => {
            /* clipboard successfully set */
            document.getElementById('loading').innerHTML = 'Command copied to clipboard!'
        },
        () => {
            /* clipboard write failed */
        },
    );
}

function folderDate() {
    return new Date().toISOString().replace(/[:.]/g, '-')
}

function folderName() {
    return `${getUser().login}-backup-github-${folderDate()}`
}

document.getElementById('command-target').addEventListener('click', (e) => {
    targetShell = e.target.getAttribute('data-target')
    if (targetShell) {
        document.querySelector('.target-shell-active').classList.remove('target-shell-active')
        e.target.classList.add('target-shell-active')
        generateCommand()
    }
})

document.querySelector(`[data-target="${targetShell}"]`).classList.add('target-shell-active')
