import { Router } from "express";
import { AppDataSource } from "../database/data-source";
import { Transacoes } from "../database/entity/Transacoes";
import { verifyAuth } from "../middleware/authMiddleware";


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

transacoesRouter.post('/transacoes', verifyAuth, async (req, res) => {
    try {

        const { data, descricao, valor, tipo, categoria, pagamento } = req.body

        const { authData } = req.body

        if (authData.data.cargo !== "Tesoureira") return res.status(401).json({
            mensagem: 'Acesso negado.'
        })

        const transacao = new Transacoes()

        transacao.usuario = authData.data.id
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

transacoesRouter.get('/transacoes/relatorio', async (req, res) => {
    try {

        const { mes, ano } = req.query;
        console.log(mes, ano)
        if (!mes || !ano) return res.status(400).json({
            mensagem: 'Informe o mês e o ano para gerar o relatório.'
        })

        const dataInicial = new Date(`${ano}-${mes}-01`).toISOString().split('T')[0]

        const dataFinal = new Date(new Date(Number(ano), Number(mes), 0)).toISOString().split('T')[0]

        //saldo inicial receita menos despesa ate o dia 1 do mes

        const receitasEDespesasInicial = await repoTransacoes.createQueryBuilder('transacoes')
            .select('SUM(transacoes.valor)', 'total')
            .addSelect('transacoes.tipo', 'tipo')
            .where('transacoes.data <  :dataInicial', { dataInicial })
            .groupBy('transacoes.tipo')
            .orderBy('transacoes.tipo')
            .getRawMany()

        console.log(receitasEDespesasInicial)

        const saldoInicial = receitasEDespesasInicial.length > 0 ? receitasEDespesasInicial[1].total - receitasEDespesasInicial[0].total : 0


        const receitasEDespesasFinal = await repoTransacoes.createQueryBuilder('transacoes')
            .select('SUM(transacoes.valor)', 'total')
            .addSelect('transacoes.tipo', 'tipo')
            .where('transacoes.data <= :dataFinal', { dataFinal })
            .groupBy('transacoes.tipo')
            .orderBy('transacoes.tipo')
            .getRawMany()



        const saldoFinal = receitasEDespesasFinal.length > 0 ? receitasEDespesasFinal[1].total - receitasEDespesasFinal[0].total : 0

        const transacoesDoMes = await repoTransacoes.createQueryBuilder('transacoes')
            .select('transacoes.data', 'data')
            .addSelect('transacoes.descricao', 'descricao')
            .addSelect('transacoes.valor', 'valor')
            .addSelect('transacoes.tipo', 'tipo')
            .addSelect('transacoes.categoria', 'categoria')
            .addSelect('transacoes.pagamento', 'pagamento')
            .where('transacoes.data >= :dataInicial AND transacoes.data < :dataFinal', { dataInicial, dataFinal })
            // .where('transacoes.data BETWEEN :dataInicial AND :dataFinal', { dataInicial, dataFinal })
            .orderBy('transacoes.data', 'ASC')
            .getRawMany()


        return res.status(200).json({
            saldoInicial: (saldoInicial || 0).toFixed(2),
            saldoFinal: (saldoFinal || 0).toFixed(2),
            transacoes: transacoesDoMes
        })

    } catch (error) {

    }
})

export { transacoesRouter }
