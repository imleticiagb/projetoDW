import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import headerImage from './logo fila onibus.png';

// container principal da página, centraliza conteúdo e define fundo
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

// cabeçalho azul com a logo centralizada
const Header = styled.div`
  background-color: #00367D;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative; 
  height: 75px; 
  padding: 0 40px;
`;

// imagem da logo no cabeçalho
const HeaderImage = styled.img`
  height: 130px;
  width: auto;
`;

// área de conteúdo centralizada com espaçamento
const Content = styled.div`
  padding: 40px 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// título da página de login
const Title = styled.h1`
  color: #00367D;
  font-size: 28px;
  margin-bottom: 30px;
`;

// campo de entrada com label
const InputField = styled.div`
  width: 100%;
  max-width: 400px;
  margin-bottom: 25px;
  text-align: left;
`;

// texto do label dos campos
const Label = styled.div`
  color: #00367D;
  margin-bottom: 8px;
  font-weight: 500;
  font-size: 18px;
`;

// campo de texto para digitar dados
const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
`;

// botão de acessar com estilo azul
const AccessButton = styled.button`
  background-color: #00367D;
  color: white;
  border: none;
  padding: 15px 50px;
  font-size: 20px;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
  text-transform: uppercase;
  transition: background-color 0.3s;

  &:hover {
    background-color: #002a5e;
  }
`;

// componente da página de login
const LoginPage = () => {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [matricula, setMatricula] = useState('');

  // função para validar e acessar a próxima página
  const handleAcessar = () => {
    if (!nome || !matricula) {
      alert('Por favor, preencha seu nome e matrícula.');
      return;
    }
    localStorage.setItem('usuario', JSON.stringify({ nome, matricula }));
    navigate('/selecao');
  };

  return (
    <AppContainer>
      <Container>
        <Header>
          <HeaderImage src={headerImage} alt="Fila Virtual UFJ" />
        </Header>
        <Content>
          <Title>Acesse a Fila Virtual</Title>
          <InputField>
            <Label>NOME</Label>
            <Input 
              type="text" 
              placeholder="Digite seu nome completo" 
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </InputField>
          
          <InputField>
            <Label>MATRÍCULA</Label>
            <Input 
              type="text" 
              placeholder="Digite sua matrícula" 
              value={matricula}
              onChange={(e) => setMatricula(e.target.value)}
            />
          </InputField>
          
          <AccessButton onClick={handleAcessar}>Acessar</AccessButton>
        </Content>
      </Container>
    </AppContainer>
  );
};

export default LoginPage;
