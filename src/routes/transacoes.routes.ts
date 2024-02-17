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

transacoesRouter.get('/transacoes/receitas', async (req, res) => {

    try {

        const transacoes = await repoTransacoes.find({
            where: {
                tipo: 'receita'
            },
            order: {
                data: 'DESC'
            }
        })

        return res.status(200).json(transacoes)

    } catch (error) {

        return res.status(500).json({
            mensagem: 'Não foi possível listar as receitas.',
            error: error.message
        })

    }

});

transacoesRouter.get('/transacoes/despesas', async (req, res) => {

    try {

        const transacoes = await repoTransacoes.find({
            where: {
                tipo: 'despesa'
            },
            order: {
                data: 'DESC'
            }
        })

        return res.status(200).json(transacoes)

    } catch (error) {

        return res.status(500).json({
            mensagem: 'Não foi possível listar as despesas.',
            error: error.message
        })
    }
});

transacoesRouter.post('/transacoes', async (req, res) => {
    try {

        const { data, descricao, valor, tipo, categoria, pagamento } = req.body

        const transacao = new Transacoes()

        transacao.usuario = 1
        transacao.data = data || new Date().toISOString().split('T')[0]
        transacao.tipo = tipo
        transacao.valor = valor
        transacao.categoria = categoria
        transacao.descricao = descricao
        transacao.pagamento = pagamento

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

transacoesRouter.get('/transacoes/dashboard', async (req, res) => {
    try {

        const totalReceitas = await repoTransacoes.createQueryBuilder('transacoes')
            .select('SUM(transacoes.valor)', 'total')
            .where('transacoes.tipo = :tipo', { tipo: 'receita' })
            .getRawOne()

        const totalDespesas = await repoTransacoes.createQueryBuilder('transacoes')
            .select('SUM(transacoes.valor)', 'total')
            .where('transacoes.tipo = :tipo', { tipo: 'despesa' })
            .getRawOne()

        const saldo = totalReceitas.total - totalDespesas.total

        return res.status(200).json({
            "Saldo em caixa": saldo,
            "Total de receitas": totalReceitas.total,
            "Total de despesas": totalDespesas.total
        })

    } catch (error) {

    }
})

export { transacoesRouter }
