import { getRepos, getUser, getToken, getScope } from "./github.js"

let targetShell = 'sh'
const commandElement = document.getElementById('command')

function generateCommandSh() {
    const folder = folderName()
    const command = `mkdir ${folder} && cd ${folder}${getRepos().map(r => ' && wget ' + addPossibleHeaderSh(r) + getRepoZipUrl(r) + ' -O ' + r.name + '.zip').join('')} && cd ..`
    return command
}

function addPossibleHeaderSh(r) {
    if (r.private) {
        return `--header="Authorization: Bearer ${getToken()}" `
    }
    return ''
}

function addPossibleHeaderPowershell(r) {
    if (r.private) {
        return `-Headers @{"Authorization"="Bearer ${getToken()}"} `
    }
    return ''
}

function getRepoZipUrl(r) {
    return r.html_url + '/archive/refs/heads/' + r.default_branch + '.zip'
}

function generateCommandPowershell() {
    const folder = folderName()
    const command = `mkdir ${folder}; cd ${folder};${getRepos().map(r => ' Invoke-WebRequest "' + getRepoZipUrl(r) + '" ' + addPossibleHeaderPowershell(r) + ' -Outfile ' + r.name + '.zip;').join('')} cd ..`
    return command
}

export function generateCommand() {
    if (getRepos() === null) return

    document.getElementById('command-title').innerHTML = `(command to backup "${getScope()}")`
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
            document.getElementById('loading').innerHTML = ''
            setTimeout(() => {
                document.getElementById('loading').innerHTML = 'Command copied to clipboard!'
            }, 200)
        },
        () => {
            /* clipboard write failed */
        },
    );
    document.getElementById('command-container').style.display = 'block'
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
        document.querySelector('#command-target .tab--active').classList.remove('tab--active')
        e.target.classList.add('tab--active')
        generateCommand()
    }
})

document.querySelector(`[data-target="${targetShell}"]`).classList.add('tab--active')
