import { Router } from "express";
import { AppDataSource } from "../database/data-source";
import { User } from "../database/entity/User";

const userRoutes = Router()

const repoUsers = AppDataSource.getRepository(User)

userRoutes.post('/account/signup', async (req, res) => {

    try {

        const { nome, sobrenome, email, senha, cargo } = req.body

        if (!nome || !sobrenome || !email || !senha || !cargo) {

            const ausentes = []

            if (!nome) ausentes.push('nome')
            if (!sobrenome) ausentes.push('sobrenome')
            if (!email) ausentes.push('email')
            if (!senha) ausentes.push('senha')
            if (!cargo) ausentes.push('cargo')

            return res.status(400).json({
                mensagem: `Os seguintes campos estão ausentes: ${ausentes.join(', ')}.`
            })
        }

        const user = new User()

        Object.assign(user, { nome, sobrenome, email, senha, cargo })

        const usuario = await repoUsers.save(user)

        if (!usuario) return res.status(500).json({
            mensagem: 'Não foi possível criar a conta.'
        })

        return res.status(201).json({
            mensagem: 'Conta criada com sucesso.'
        })

    } catch (error) {

        return res.status(500).json({
            mensagem: 'Não foi possível criar a conta.',
            error: error.message
        })

    }



})

export { userRoutes }