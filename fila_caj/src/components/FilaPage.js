import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { DoorOpenFill, ArrowLeft } from 'react-bootstrap-icons';
import headerImage from './logo fila onibus.png';
import andandoIcon from './andando.png';

// container principal da aplicação, centraliza conteúdo e define fundo
const AppContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
`;

// container branco centralizado com bordas arredondadas e sombra
const Container = styled.div`
  font-family: 'Poppins', sans-serif;
  width: 100%;
  max-width: 700px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

// cabeçalho azul com espaçamento e alinhamento dos itens
const Header = styled.div`
  background-color: #00367D;
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

// imagem centralizada no cabeçalho
const HeaderImage = styled.img`
  height: 130px;
  width: auto;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;

// botão com estilo personalizado para o cabeçalho
const HeaderButton = styled.button`
  background: none;
  border: 1px solid white;
  color: white;
  padding: 8px 15px;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  transition: background-color 0.2s;
  &:hover { background: rgba(255, 255, 255, 0.2); }
`;

// área do conteúdo principal, centralizado e com espaçamento
const Content = styled.div`
  padding: 40px 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

// label para indicar posição na fila
const PositionLabel = styled.p`
  font-size: 24px;
  margin: 0;
  color: #333;
`;

// número grande que mostra a posição na fila
const PositionNumber = styled.h1`
  font-size: 150px;
  font-weight: bold;
  margin: 10px 0;
  line-height: 1;
  color: #00367D;
`;

// ícone com imagem de caminhada centralizado
const WalkingIcon = styled.div`
  margin: 30px 0;
  width: 300px;
  height: 300px;
  background-image: url(${andandoIcon});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`;

// container da barra de progresso com cor de fundo e borda arredondada
const ProgressBarContainer = styled.div`
  width: 100%;
  max-width: 500px;
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
`;

// barra de progresso que muda largura conforme o progresso
const ProgressBar = styled.div`
  width: ${props => props.progress}%;
  height: 100%;
  background-color: #00367D;
  border-radius: 4px;
  transition: width 1s linear;
`;

// texto do rodapé com margem e cor cinza
const FooterText = styled.p`
  font-size: 18px;
  margin-top: 30px;
  color: #555;
`;

// mensagem exibida durante o carregamento dos dados
const LoadingMessage = styled.div`
  font-size: 24px;
  color: #00367D;
  margin: 20px 0;
`;

// mensagem exibida em caso de erro
const ErrorMessage = styled.div`
  font-size: 24px;
  color: #d9534f;
  margin: 20px 0;
`;

// componente principal da página da fila
const FilaPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  // estado para posição na fila
  const [posicao, setPosicao] = useState(null);
  // estado para indicar carregamento
  const [loading, setLoading] = useState(true);
  // estado para armazenar mensagem de erro
  const [error, setError] = useState(null);
  // estado para total de pessoas na fila
  const [totalNaFila, setTotalNaFila] = useState(0);
  // estado para progresso da barra
  const [progress, setProgress] = useState(0);
  // estado para indicar se os dados estão prontos para mostrar
  const [isReady, setIsReady] = useState(false); 

  // efeito para buscar a posição na fila periodicamente
  useEffect(() => {
    const fetchPosition = async () => {
      try {
        // pegar dados salvos do usuário e tipo da fila no localStorage
        const usuarioSalvo = localStorage.getItem('usuario');
        const tipofilasalvo = localStorage.getItem('tipofiladef');
        
        // se não tiver dados, volta para página de seleção
        if (!usuarioSalvo || !tipofilasalvo) {
          navigate('/selecao');
          return;
        }

        // extrai matrícula e tipo de fila dos dados salvos
        const { matricula } = JSON.parse(usuarioSalvo);
        const { tipofila } = JSON.parse(tipofilasalvo);

        // faz requisição para obter posição na fila no backend
        const response = await fetch('http://localhost:3000/posicao', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            matricula,
            tipofila
          })
        });

        // se a resposta não for ok, lança erro
        if (!response.ok) {
          throw new Error('Erro ao obter posição na fila');
        }

        // extrai dados da resposta
        const data = await response.json();
        // atualiza posição no estado
        setPosicao(data.posicao);
        // atualiza total na fila somando um valor aleatório
        setTotalNaFila(data.posicao + Math.floor(Math.random() * 10) + 1); 
        // indica que dados estão prontos para mostrar
        setIsReady(true);
        
      } catch (err) {
        // registra erro e atualiza estado de erro
        console.error('Erro:', err);
        setError(err.message);
      } finally {
        // termina carregamento
        setLoading(false);
      }
    };

    // chama a função uma vez ao carregar componente
    fetchPosition();
    // chama a função a cada 30 segundos para atualizar posição
    const intervalId = setInterval(fetchPosition, 30000);
    // limpa o intervalo ao desmontar o componente
    return () => clearInterval(intervalId);
  }, [navigate]);

  // efeito para calcular e atualizar a barra de progresso
  useEffect(() => {
    if (posicao && totalNaFila) {
      const progressoAtual = ((totalNaFila - posicao) / totalNaFila) * 100;
      setProgress(progressoAtual);
    }
  }, [posicao, totalNaFila]);

  // função para voltar para a página de seleção
  const handleVoltar = () => {
    navigate('/selecao');
  };

  // função para sair da fila, pedindo confirmação
const handleSair = async () => {
  if (window.confirm("Você tem certeza que deseja sair da fila?")) {
    try {
      const usuarioSalvo = localStorage.getItem('usuario');
      const tipofilasalvo = localStorage.getItem('tipofiladef');

      if (!usuarioSalvo || !tipofilasalvo) {
        navigate('/selecao');
        return;
      }

      const { matricula, nome } = JSON.parse(usuarioSalvo);
      const { tipofila } = JSON.parse(tipofilasalvo);

      const response = await fetch('http://localhost:3000/deletar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, tipofila, matricula }),
      });

      if (!response.ok) {
        throw new Error('Erro ao sair da fila');
      }

      // limpa os dados locais após a exclusão
      localStorage.removeItem('usuario');
      localStorage.removeItem('tipofiladef');

      // redireciona para login
      navigate('/');

    } catch (err) {
      console.error('Erro ao sair da fila:', err);
      setError(err.message);
    }
  }
};


  // enquanto estiver carregando ou dados não estiverem prontos
  if (loading || !isReady) {
    return (
      <AppContainer>
        <Container>
          <Header>
            <HeaderButton onClick={handleVoltar}>
              <ArrowLeft size={20} />
              Voltar
            </HeaderButton>
            <HeaderImage src={headerImage} alt="Fila Virtual UFJ" />
            <HeaderButton onClick={handleSair}>
              <DoorOpenFill size={20} />
              Sair
            </HeaderButton>
          </Header>
          <Content>
            <LoadingMessage>Carregando sua posição...</LoadingMessage>
          </Content>
        </Container>
      </AppContainer>
    );
  }

  // se houve erro na requisição, mostra mensagem de erro
  if (error) {
    return (
      <AppContainer>
        <Container>
          <Header>
            <HeaderButton onClick={handleVoltar}>
              <ArrowLeft size={20} />
              Voltar
            </HeaderButton>
            <HeaderImage src={headerImage} alt="Fila Virtual UFJ" />
            <HeaderButton onClick={handleSair}>
              <DoorOpenFill size={20} />
              Sair
            </HeaderButton>
          </Header>
          <Content>
            <ErrorMessage>{error}</ErrorMessage>
          </Content>
        </Container>
      </AppContainer>
    );
  }

  // renderiza a página com os dados da fila
  return (
    <AppContainer>
      <Container>
        <Header>
          <HeaderButton onClick={handleVoltar}>
            <ArrowLeft size={20} />
            Voltar
          </HeaderButton>
          <HeaderImage src={headerImage} alt="Fila Virtual UFJ" />
          <HeaderButton onClick={handleSair}>
            <DoorOpenFill size={20} />
            Sair
          </HeaderButton>
        </Header>
        <Content>
          <PositionLabel>Seu lugar na fila é:</PositionLabel>
          <PositionNumber>{posicao}</PositionNumber>
          <WalkingIcon />
          <ProgressBarContainer>
            <ProgressBar progress={progress} />
          </ProgressBarContainer>
          <FooterText>Apresente esta tela para o motorista ao entrar no ônibus</FooterText>
        </Content>
      </Container>
    </AppContainer>
  );
};

export default FilaPage;
