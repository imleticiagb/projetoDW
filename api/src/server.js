import express from 'express';
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;
const app = express();
const port = process.env.PORT || 3000;

// Configuração do pool de conexões
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_DATABASE || 'postgres',
    password: process.env.DB_PASSWORD || '123456',
    port: Number(process.env.DB_PORT) || 5432,
});

app.use(express.json());

// Middleware CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Rota de teste
app.get('/', (req, res) => {
    res.send('API PostgreSQL funcionando!');
});

// Rota para inserção de registros
app.post('/inserir', async (req, res) => {
    try {
        const { nome, tipofila, matricula} = req.body;

    
        
             const result = await pool.query({
            text: 'INSERT INTO public.registros(nome, tipofila, matricula,horario_registro) VALUES ($1, $2, $3,now()) RETURNING *',
            values: [nome, tipofila, matricula],
            });

            res.status(201).json({
                message: 'Registro inserido com sucesso',
                data: result.rows[0]
            });
        


    } catch (err) {
        console.error('Erro na inserção:', err);
        res.status(500).json({ 
            error: 'Erro interno no servidor',
            detalhes: err.message 
        });
    }
});



// Nova rota POST para consultar posição na fila
app.post('/posicao', async (req, res) => {
    try {
        const { matricula, tipofila } = req.body;

        if (!matricula || !tipofila) {
            return res.status(400).json({ 
                error: 'Matrícula e tipo de fila são obrigatórios',
                detalhes: 'Envie os parâmetros matricula e tipofila no corpo da requisição (JSON)'
            });
        }

        // Consulta para obter a posição na fila
        const result = await pool.query({
            text: `
                WITH fila_ordenada AS (
                    SELECT 
                        matricula,
                        horario_registro,
                        ROW_NUMBER() OVER (ORDER BY horario_registro ASC) as posicao
                    FROM registros
                    WHERE tipofila = $1
                )
                SELECT posicao
                FROM fila_ordenada
                WHERE matricula = $2
            `,
            values: [tipofila, matricula]
        });

        if (result.rows.length === 0) {
            return res.status(404).json({ 
                error: 'Registro não encontrado para a matrícula e tipo de fila informados',
                sugestao: 'Verifique se os dados estão corretos ou se você está na fila'
            });
        }

        res.status(200).json({
            success: true,
            posicao: result.rows[0].posicao,
            mensagem: `Você é o ${result.rows[0].posicao}º na fila ${tipofila}`,
            timestamp: new Date().toISOString()
        });

    } catch (err) {
        console.error('Erro ao consultar posição:', err);
        res.status(500).json({ 
            error: 'Erro interno no servidor',
            detalhes: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor operando na porta ${port}`);
});