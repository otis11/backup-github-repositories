const loading = document.getElementById('loading')

let reposCache = null
let userCache = null

export async function fetchAllPublicRepos(username) {
    let repos = []
    const maxReposPerPage = 100
    userCache = await fetchUser(username)

    if (userCache.message === 'Not Found') {
        throw Error(`GitHub username "${username}" not found ://`)
    }

    const publicRepoCount = userCache.public_repos
    const iterations = Math.ceil(publicRepoCount / maxReposPerPage)
    for (let i = 0; i < iterations; i++) {
        loading.innerHTML = `Loading page ${i + 1}/${iterations} (${userCache.public_repos} public repos)`
        repos = [...repos, ...(await fetchPublicRepos(username, i + 1))]
    }
    loading.innerHTML = ``
    reposCache = repos
}

export function getRepos() {
    return reposCache
}

export function getUser() {
    return userCache
}

export async function fetchPublicRepos(username, page) {
    return fetch(`https://api.github.com/users/${username}/repos?per_page=100&page=${page}`).then(res => res.json())
}

export async function fetchUser(username) {
    return fetch(`https://api.github.com/users/${username}`).then(res => res.json())
}