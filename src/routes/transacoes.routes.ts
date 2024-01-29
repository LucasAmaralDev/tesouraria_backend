import { Router } from "express";
import { AppDataSource } from "../database/data-source";
import { Transacoes } from "../database/entity/Transacoes";


const transacoesRouter = Router();
const repoTransacoes = AppDataSource.getRepository(Transacoes);

transacoesRouter.get('/transacoes', async (req, res) => {

    try {

        const transacoes = await repoTransacoes.find({
            order: {
                data: 'DESC'
            }
        })

        return res.status(200).json(transacoes)

    } catch (error) {

        return res.status(500).json({
            mensagem: 'Não foi possível listar as transações.',
            error: error.message
        })

    }

});

transacoesRouter.post('/transacoes', async (req, res) => {
    try {

        const { data, descricao, valor, categoria } = req.body

        const transacao = new Transacoes()

        transacao.usuario = 1
        transacao.data = data || new Date().toISOString().split('T')[0]
        transacao.tipo = valor > 0 ? 'receita' : 'despesa'
        transacao.valor = valor
        transacao.categoria = 1
        transacao.descricao = descricao

        const transacaoCriada = await repoTransacoes.save(transacao)

        if (!transacaoCriada) return res.status(500).json({
            mensagem: 'Não foi possível criar a transação.'
        })

        return res.status(201).json(transacaoCriada)

    } catch (error) {

        return res.status(500).json({
            mensagem: 'Não foi possível criar a transação.',
            error: error.message
        })

    }
});

export { transacoesRouter }
