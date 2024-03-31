
import { verify } from 'jsonwebtoken'

export function verifyAuth(request, response, next) {
    const authToken = request.headers.authorization

    if (!authToken) {
        return response.status(401).json({
            error: "Token ausente",
        })
    }

    const [, token] = authToken.split(" ")
    const newToken = token ? token : authToken

    try {
        const decoded = verify(newToken, process.env.JWT_SECRET)
        if (typeof decoded === 'string') {
            throw new Error('Token inválido')
        }
        request.body.authData = decoded

        return next()
    } catch (error) {
        return response.status(401).json({ error: "Token Expirado" })
    }
}