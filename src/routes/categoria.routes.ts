import { Router } from "express";
import { AppDataSource } from "../database/data-source";
import { Categoria } from "../database/entity/Categoria";


const categoriaRoutes = Router()
const repoCategorias = AppDataSource.getRepository(Categoria)

categoriaRoutes.get('/categorias', async (req, res) => {

    try {

        const categorias = await repoCategorias.find()

        if (!categorias) return res.status(404).json({
            mensagem: 'Não há categorias cadastradas.'
        })

        return res.status(200).json(categorias)

    } catch (error) {

        return res.status(500).json({
            mensagem: 'Não foi possível listar as categorias.',
            error: error.message
        })

    }

})

categoriaRoutes.post('/categorias', async (req, res) => {

    try {

        const { nome, descricao } = req.body

        if (!nome || !descricao) {

            const ausentes = []

            if (!nome) ausentes.push('nome')
            if (!descricao) ausentes.push('descricao')

            return res.status(400).json({
                mensagem: `Os seguintes campos estão ausentes: ${ausentes.join(', ')}.`
            })
        }

        const categoriaExistente = await repoCategorias.findOne({ where: { nome } })

        if (categoriaExistente) return res.status(400).json({
            mensagem: 'Já existe uma categoria com esse nome.'
        })

        const categoria = new Categoria()

        Object.assign(categoria, { nome, descricao })

        const categoriaCriada = await repoCategorias.save(categoria)

        if (!categoriaCriada) return res.status(500).json({
            mensagem: 'Não foi possível criar a categoria.'
        })

        return res.status(201).json({
            mensagem: 'Categoria criada com sucesso.'
        })

    } catch (error) {

        return res.status(500).json({
            mensagem: 'Não foi possível criar a categoria.',
            error: error.message
        })

    }
})

categoriaRoutes.put('/categorias/:id', async (req, res) => {

    try {

        const { id } = req.params
        const { nome, descricao } = req.body

        if (!nome || !descricao) {

            const ausentes = []

            if (!nome) ausentes.push('nome')
            if (!descricao) ausentes.push('descricao')

            return res.status(400).json({
                mensagem: `Os seguintes campos estão ausentes: ${ausentes.join(', ')}.`
            })
        }

        const categoriaExistente = await repoCategorias.findOne({ where: { nome } })

        if (categoriaExistente) return res.status(400).json({
            mensagem: 'Já existe uma categoria com esse nome.'
        })

        const categoria = await repoCategorias.findOne({
            where: { id: Number(id) }
        })

        if (!categoria) return res.status(404).json({
            mensagem: 'Categoria não encontrada.'
        })

        Object.assign(categoria, { nome, descricao })

        const categoriaAtualizada = await repoCategorias.save(categoria)

        if (!categoriaAtualizada) return res.status(500).json({
            mensagem: 'Não foi possível atualizar a categoria.'
        })

        return res.status(200).json({
            mensagem: 'Categoria atualizada com sucesso.'
        })

    } catch (error) {

        return res.status(500).json({
            mensagem: 'Não foi possível atualizar a categoria.',
            error: error.message
        })

    }
})

export { categoriaRoutes }
