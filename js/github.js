const loading = document.getElementById('loading')

let reposCache = null
let userCache = null
let reposCacheAuth = null
let userCacheAuth = null
let scope = null
let token = null
let username = null

export async function fetchAllPublicRepos(u) {
    username = u
    let repos = []
    const maxReposPerPage = 100
    userCache = await fetchUser()

    if (userCache.message === 'Not Found') {
        throw Error(`GitHub username "${username}" not found ://`)
    }

    const publicRepoCount = userCache.public_repos
    const iterations = Math.ceil(publicRepoCount / maxReposPerPage)
    for (let i = 0; i < iterations; i++) {
        loading.innerHTML = `Loading page ${i + 1}/${iterations} (${userCache.public_repos} public repos)`
        repos = [...repos, ...(await fetchPublicRepos(i + 1))]
    }
    loading.innerHTML = ``
    reposCache = repos
    scope = 'Public'
}

export function getScope() {
    return scope
}

export function getToken() {
    return token
}

export function getRepos() {
    if (scope === 'Public') {
        return reposCache
    } else {
        return reposCacheAuth
    }
}

export function getUser() {
    if (scope === 'Public') {
        return userCache
    } else {
        return userCacheAuth
    }
}

export async function fetchPublicRepos(page) {
    return fetch(`https://api.github.com/users/${username}/repos?per_page=100&page=${page}`).then(res => res.json())
}

export async function fetchUser() {
    return fetch(`https://api.github.com/users/${username}`).then(res => res.json())
}

// these need a token
export async function fetchUserAuth() {
    return fetch(`https://api.github.com/user`, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }).then(res => res.json())
}

export async function fetchReposAuth(page) {
    return fetch(`https://api.github.com/user/repos?per_page=100&page=${page}`, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }).then(res => res.json())
}

export async function fetchAllReposAuth(t) {
    token = t
    let repos = []
    userCacheAuth = await fetchUserAuth()

    if (userCacheAuth.message === 'Not Found') {
        throw Error(`Token not working.`)
    }

    let page = 0
    let continueNextPage = true
    while (continueNextPage) {
        loading.innerHTML = `Loading page ${page + 1}`
        const newRepos = await fetchReposAuth(page + 1)
        repos = [...repos, ...newRepos]

        if (newRepos.length !== 100) {
            continueNextPage = false
        }
        page += 1
    }

    loading.innerHTML = ``
    reposCacheAuth = repos
    scope = 'All (Private)'
}