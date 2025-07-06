import express from 'express';
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;
const app = express();
const port = process.env.PORT || 3000;

// configuração do pool de conexões
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_DATABASE || 'postgres',
    password: process.env.DB_PASSWORD || '123456',
    port: Number(process.env.DB_PORT) || 5432,
});

app.use(express.json());

// middleware cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// rota de teste
app.get('/', (req, res) => {
    res.send('API PostgreSQL funcionando!');
});

// rota para inserção de registros com verificação prévia
app.post('/inserir', async (req, res) => {
    try {
        const { nome, tipofila, matricula } = req.body;

        // verifica se o registro já existe
        const checkResult = await pool.query({
            text: 'SELECT * FROM public.registros WHERE tipofila = $1 AND matricula = $2',
            values: [tipofila, matricula],
        });

        if (checkResult.rowCount > 0) {
            return res.status(409).json({
                message: 'Registro já existe na fila',
                data: checkResult.rows[0],
            });
        }

        // se não existir, insere o novo registro
        const result = await pool.query({
            text: 'INSERT INTO public.registros (nome, tipofila, matricula, horario_registro) VALUES ($1, $2, $3, now()) RETURNING *',
            values: [nome, tipofila, matricula],
        });

        res.status(201).json({
            message: 'Registro inserido com sucesso',
            data: result.rows[0],
        });

    } catch (err) {
        console.error('erro na inserção:', err);
        res.status(500).json({
            error: 'erro interno no servidor',
            detalhes: err.message,
        });
    }
});

// rota para deletar registros com base em tipofila e matricula
app.post('/deletar', async (req, res) => {
    try {
        const { tipofila, matricula } = req.body;

        const result = await pool.query({
            text: 'DELETE FROM public.registros WHERE tipofila = $1 AND matricula = $2 RETURNING *;',
            values: [tipofila, matricula],
        });

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: 'Registro não encontrado para exclusão'
            });
        }

        res.status(200).json({
            message: 'Registro deletado com sucesso',
            data: result.rows[0]
        });

    } catch (err) {
        console.error('erro na exclusão:', err);
        res.status(500).json({ 
            error: 'erro interno no servidor',
            detalhes: err.message 
        });
    }
});

// nova rota post para consultar posição na fila
app.post('/posicao', async (req, res) => {
    try {
        const { matricula, tipofila } = req.body;

        if (!matricula || !tipofila) {
            return res.status(400).json({ 
                error: 'matrícula e tipo de fila são obrigatórios',
                detalhes: 'envie os parâmetros matricula e tipofila no corpo da requisição (json)'
            });
        }

        // consulta para obter a posição na fila
        const result = await pool.query({
            text: `
                with fila_ordenada as (
                    select 
                        matricula,
                        horario_registro,
                        row_number() over (order by horario_registro asc) as posicao
                    from registros
                    where tipofila = $1
                )
                select posicao
                from fila_ordenada
                where matricula = $2
            `,
            values: [tipofila, matricula]
        });

        if (result.rows.length === 0) {
            return res.status(404).json({ 
                error: 'registro não encontrado para a matrícula e tipo de fila informados',
                sugestao: 'verifique se os dados estão corretos ou se você está na fila'
            });
        }

        res.status(200).json({
            success: true,
            posicao: result.rows[0].posicao,
            mensagem: `você é o ${result.rows[0].posicao}º na fila ${tipofila}`,
            timestamp: new Date().toISOString()
        });

    } catch (err) {
        console.error('erro ao consultar posição:', err);
        res.status(500).json({ 
            error: 'erro interno no servidor',
            detalhes: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
});

// inicia o servidor
app.listen(port, () => {
    console.log(`servidor operando na porta ${port}`);
});
