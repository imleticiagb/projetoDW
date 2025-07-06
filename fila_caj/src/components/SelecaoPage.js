import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeftCircle } from 'react-bootstrap-icons';
import headerImage from './logo fila onibus.png';

var tipofila;

// container principal da página, centraliza o conteúdo e define o fundo
const AppContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
`;

// caixa branca centralizada com bordas arredondadas e sombra
const Container = styled.div`
  font-family: 'Poppins', sans-serif;
  width: 100%;
  max-width: 1200px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

// cabeçalho azul com a logo centralizada e botão de voltar
const Header = styled.div`
  background-color: #00367D;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative; 
  height: 75px; 
  padding: 0 40px;
`;

// botão para voltar para a página inicial
const HomeButton = styled.button`
  position: absolute;
  top: 50%;
  left: 25px;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  line-height: 1;
  transition: transform 0.2s ease-in-out;
  &:hover { transform: translateY(-50%) scale(1.15); }
`;

// imagem da logo no cabeçalho
const HeaderImage = styled.img`
  height: 130px;
  width: auto;
`;

// área de conteúdo com espaçamento interno
const Content = styled.div`
  padding: 30px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// título da página de seleção de horário
const Title = styled.h1`
  color: #00367D;
  font-size: 28px;
  margin-bottom: 30px;
`;

// container que organiza as rotas em colunas
const RoutesContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  width: 100%;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// coluna individual para cada rota
const RouteColumn = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
`;

// título de cada rota
const RouteTitle = styled.h2`
  text-align: center;
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
`;

// botão para selecionar horário, muda cor se estiver selecionado
const TimeSlotButton = styled.button`
  width: 100%;
  padding: 12px;
  margin-bottom: 10px;
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  border: 2px solid #00367D;
  background-color: ${props => props.isSelected ? '#00367D' : 'white'};
  color: ${props => props.isSelected ? 'white' : '#00367D'};
  font-weight: ${props => props.isSelected ? 'bold' : 'normal'};
  transition: all 0.2s ease;

  &:hover {
    background-color: #00367D;
    color: white;
  }
`;

// botão para confirmar a reserva
const ReserveButton = styled.button`
  background-color: #00367D;
  color: white;
  border: none;
  padding: 15px 50px;
  font-size: 20px;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 30px;
  text-transform: uppercase;
  transition: background-color 0.3s;

  &:hover {
    background-color: #002a5e;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

// dados de horários disponíveis para cada rota
const horarios = {
  riachueloJatoba: {
    Manhã: ['06h25', '07h10', '09h00', '10h00'],
    Tarde: ['13h00', '15h00', '16h00', '18h00'],
    Noite: ['18h50', '20h40', '21h30', '22h30'],
  },
  jatobaRiachuelo: {
    Manhã: ['06h45', '08h30', '09h30', '11h20'],
    Tarde: ['14h00', '15h30', '17h30', '18h20'],
    Noite: ['19h20', '21h00', '22h00', '23h00'],
  }
};

// componente principal da página de seleção
const SelecaoPage = () => {
  const navigate = useNavigate();
  const [selecionado, setSelecionado] = useState(null);

  // recupera os dados do usuário salvos no localstorage
  const usuarioSalvo = localStorage.getItem('usuario');

  // converte os dados de string para objeto
  const { nome, matricula } = JSON.parse(usuarioSalvo) || {};

  // função para selecionar o horário e rota escolhidos
  const handleSelect = (rota, horario) => {
    setSelecionado({ rota, horario });
    tipofila = rota + horario;
    localStorage.setItem('tipofiladef', JSON.stringify({ tipofila }));
    console.log(rota, horario);
  };

  // função para enviar os dados para o servidor e redirecionar
  const handleReservar = () => {
    async function enviarDados() {
      try {
        const response = await fetch('http://localhost:3000/inserir', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nome: nome,
            tipofila: tipofila,
            matricula: matricula
          })
        });
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error('Erro:', error);
      }
    }
    enviarDados();
    navigate('/fila', { state: { selecionado } });
  };

  return (
    <AppContainer>
      <Container>
        <Header>
          <HomeButton onClick={() => navigate('/')} aria-label="Voltar">
            <ArrowLeftCircle size={30} />
          </HomeButton>
          <HeaderImage src={headerImage} alt="Fila Virtual" />
        </Header>
        <Content>
          <Title>Escolha seu horário</Title>
          <RoutesContainer>
            <RouteColumn>
              <RouteTitle>Riachuelo → Jatobá</RouteTitle>
              {Object.entries(horarios.riachueloJatoba).map(([periodo, tempos]) => (
                <div key={periodo}>
                  <h4>{periodo}</h4>
                  {tempos.map(h => (
                    <TimeSlotButton 
                      key={h}
                      isSelected={selecionado?.rota === 'riachueloJatoba' && selecionado?.horario === h}
                      onClick={() => handleSelect('riachueloJatoba', h)}
                    >
                      {h}
                    </TimeSlotButton>
                  ))}
                </div>
              ))}
            </RouteColumn>
            <RouteColumn>
              <RouteTitle>Jatobá → Riachuelo</RouteTitle>
              {Object.entries(horarios.jatobaRiachuelo).map(([periodo, tempos]) => (
                <div key={periodo}>
                  <h4>{periodo}</h4>
                  {tempos.map(h => (
                    <TimeSlotButton 
                      key={h}
                      isSelected={selecionado?.rota === 'jatobaRiachuelo' && selecionado?.horario === h}
                      onClick={() => handleSelect('jatobaRiachuelo', h)}
                    >
                      {h}
                    </TimeSlotButton>
                  ))}
                </div>
              ))}
            </RouteColumn>
          </RoutesContainer>
          <ReserveButton onClick={handleReservar} disabled={!selecionado}>
            Reservar Lugar
          </ReserveButton>
        </Content>
      </Container>
    </AppContainer>
  );
};

export default SelecaoPage;
