import type { Cookies } from '@sveltejs/kit'
import cookie from 'cookie'
// Types for the sign in response
interface CurrentUser {
    id: string
    identifier: string
}

interface ErrorResult {
    errorCode: string
    message: string
}

type SignInResponse = {
    data: {
        login: CurrentUser | ErrorResult
    }
    headers: Headers
}

interface QueryOptions<T = any> {
    query: string
    variables?: any
    locals?: App.Locals
}

class CustomFetch {
    private retryCount: number
    private timeout: number

    constructor(options: { retry?: number; timeout?: number } = {}) {
        this.retryCount = options.retry || 3
        this.timeout = options.timeout || 5000
    }

    async fetchWithRetry(url: string, options: RequestInit, attempt = 1): Promise<Response> {
        try {
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), this.timeout)

            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            })

            clearTimeout(timeoutId)
            return response
        } catch (error) {
            if (attempt >= this.retryCount) {
                throw error
            }
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 100))
            return this.fetchWithRetry(url, options, attempt + 1)
        }
    }
}

const customFetch = new CustomFetch({
    retry: 3,
    timeout: 5000
})

export async function parseAuthCookie(setCookie: string[] = [], locals: App.Locals, cookies: Cookies): Promise<boolean> {
    if (!setCookie || setCookie.length === 0) return false
    
    try {
        let sessionCookie = false
        let sessionSigCookie = false
        
        for (const rawCookie of setCookie) {
            const parsedCookie = cookie.parse(rawCookie)
            
            if (parsedCookie['session']) {
                locals.sid = parsedCookie['session']
                cookies.set('session', parsedCookie['session'], {
                    path: '/',
                    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    sameSite: 'strict',
                    httpOnly: true,
                    secure: true
                })
                sessionCookie = true
            }
            
            if (parsedCookie['session.sig']) {
                locals.ssig = parsedCookie['session.sig']
                cookies.set('session.sig', parsedCookie['session.sig'], {
                    path: '/',
                    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    sameSite: 'strict',
                    httpOnly: true,
                    secure: true
                })
                sessionSigCookie = true
            }
        }
        
        return sessionCookie && sessionSigCookie
    } catch (e) {
        console.error('Error parsing auth cookie:', e)
        return false
    }
}

export async function signIn(
    emailAddress: string, 
    password: string, 
    rememberMe: boolean = false,
    locals: App.Locals,
    cookies: Cookies
): Promise<SignInResponse> {
    const query = `
        mutation LogIn($emailAddress: String!, $password: String!, $rememberMe: Boolean!) {
            login(username: $emailAddress, password: $password, rememberMe: $rememberMe) {
                ... on CurrentUser {
                    id
                    identifier
                }
                ... on ErrorResult {
                    errorCode
                    message
                }
            }
        }
    `

    const variables = {
        emailAddress,
        password,
        rememberMe
    }

    try {
        const response = await customFetch.fetchWithRetry(
            process.env.PUBLIC_SHOPAPI_DEV_URL,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query,
                    variables
                })
            }
        )

        const json = await response.json()
        if (json.errors) {
            throw new Error(json.errors[0].message)
        }

        // Get the Set-Cookie headers
        const setCookieHeaders = response.headers.getSetCookie()
        
        // Parse and set the cookies
        await parseAuthCookie(setCookieHeaders, locals, cookies)

        return {
            data: json.data,
            headers: response.headers
        }
    } catch (error) {
        console.error('Sign in error:', error)
        throw error
    }
}

// Example usage:
/*
try {
    const { data, headers } = await signIn('user@example.com', 'password', true, locals, cookies)
    
    if ('id' in data.login) {
        // Successfully logged in
        console.log('Logged in user:', data.login.identifier)
        
        // Cookie headers have already been processed by parseAuthCookie
    } else {
        // Login error
        console.error('Login failed:', data.login.message)
    }
} catch (error) {
    console.error('Sign in error:', error)
}
*/