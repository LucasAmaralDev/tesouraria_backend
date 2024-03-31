import { Router } from "express";
import { AppDataSource } from "../database/data-source";
import { User } from "../database/entity/User";
import { verifyAuth } from "../middleware/authMiddleware";
var jwt = require('jsonwebtoken');

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

userRoutes.post('/account/login', async (req, res) => {

    try {

        const { email, senha } = req.body

        if (!email || !senha) {

            const ausentes = []

            if (!email) ausentes.push('email')
            if (!senha) ausentes.push('senha')

            return res.status(400).json({
                mensagem: `Os seguintes campos estão ausentes: ${ausentes.join(', ')}.`
            })
        }

        const usuario = await repoUsers.findOne({
            where: {
                email: email,
                senha: senha
            }
        })

      
        if (!usuario) return res.status(404).json({
            mensagem: 'Usuário não encontrado.'
        })

        jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (120 * 60),
            data: usuario
          }, process.env.JWT_SECRET, (err: any, token: any) => {
            
            if (err) return res.status(500).json({
                mensagem: 'Não foi possível realizar o login.'
            })

            return res.status(200).json({
                mensagem: 'Login realizado com sucesso.',
                token: token
            })
          });

    } catch (error) {

        console.log(error)

        return res.status(500).json({
            mensagem: 'Não foi possível realizar o login.',
            error: error.message
        })

    }
})

userRoutes.get("/account", verifyAuth, async (req, res) => {
    try {

        const user = req.body.authData.data

        return res.status(200).json(user)
        
    } catch (error) {
        
    }
});

export { userRoutes }