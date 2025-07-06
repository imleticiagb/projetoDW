# Fila Virtual

## Back-End

O back-end foi estruturado em uma API que gerencia a comunicação entre o banco de dados PostgreSQL e a aplicação do front-end. Foi desenvolvido em **Node.js** utilizando o módulo **Express**, permitindo que o servidor responda a solicitações HTTP em uma porta da máquina.

### Como iniciar o servidor

Execute os seguintes comandos no terminal:

```bash
npm install        # Instala as dependências
npm run dev        # Inicia o servidor na porta 3000
```

### Rotas disponíveis

- `GET /` — Verifica se a API está respondendo.
- `POST /inserir` — Insere um novo usuário em uma das filas.
- `GET /posição` — Retorna a posição atual do usuário na fila com base no horário de entrada.
- `DELETE /deletar` — Remove um usuário da fila.

### Banco de dados

A estrutura do banco conta com uma única tabela que representa a lógica de todas as filas em todos os horários. A distinção entre filas é feita por colunas que definem o **horário** e **sentido** da fila. 

Além disso:

- **Gatilhos (triggers)** foram implementados para:
  - Limitar o número de pessoas por fila.
  - Impedir registros duplicados.
- Um **shell script** agenda a execução de comandos SQL para a exclusão periódica de registros da fila.

---

## Front-End

O front-end foi desenvolvido com **ReactJS**, criando uma interface de fila virtual voltada para transporte universitário. Os usuários podem se cadastrar, selecionar o sentido e horário do trajeto e acompanhar sua posição em tempo real.

### Bibliotecas utilizadas

- `react-router-dom` — Gerenciamento de rotas e navegação.
- `styled-components` — Componentes com estilo CSS em JS.
- `react-bootstrap-icons` — Ícones de interface (ex.: seta para voltar, porta para sair).
- `node` — Ambiente de desenvolvimento via `npm` ou `yarn`.

### Estrutura de telas

- **LoginPage**: Tela inicial com campos para nome e matrícula.
- **SelecaoPage**: Tela para escolher sentido e horário do trajeto (ex.: Riachuelo → Jatobá).
- **FilaPage**: Tela que mostra a posição do usuário na fila, com barra de progresso e orientações.

As páginas são conectadas via `react-router-dom` para navegação fluida.

### Funcionamento geral

- **LoginPage**: Salva os dados (nome e matrícula) no `localStorage`.
- **SelecaoPage**: Permite a escolha de sentido e horário; salva no `localStorage` e envia ao servidor via `fetch` na rota `/inserir`.
- **FilaPage**: Consulta a posição do usuário a cada 30 segundos via `fetch` na rota `/posicao`, exibindo:
  - Número da posição
  - Ícone de movimentação
  - Barra de progresso

### Persistência de dados

O uso do `localStorage` permite manter os dados entre recarregamentos e navegação entre páginas.

---

## Como rodar o front-end

1. Clone ou copie o repositório para sua máquina.
2. Instale as dependências com:

```bash
npm install
```

3. Execute o projeto em modo desenvolvimento com:

```bash
npm start
```

A aplicação estará disponível em: `http://localhost:3000`

---

## Observações adicionais

- Para que a aplicação possa funcionar corretamente, é necessário copiar o SQL do arquivo criar_tabelas_e_gatilhos.txt no PostgreeSQL e executar, para que as tabelas sejam criadas corretamente. Caso contrário, a aplicação resultará em erro, pois não haverá banco de dados para comunicação. A senha do PostgreeSQL deve ser 123456. 
- O front-end envia requisições para o back-end via `fetch`, utilizando as rotas documentadas (`/inserir`, `/posicao`, etc.).
- O layout é **responsivo** para diferentes tamanhos de tela, utilizando `styled-components` e `media queries`.
- O design é limpo e intuitivo, com ícones da biblioteca `react-bootstrap-icons`.
