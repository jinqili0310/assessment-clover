import React, { useState } from 'react';
import styled from 'styled-components';
import Carousel from './components/Carousel';
import RatioSlider from './components/RatioSlider';
import './App.css';

const AppContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 20px;
`;

const CarouselWrapper = styled.div`
  width: 100%;
  height: 70vh;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const ControlsContainer = styled.div`
  margin-top: 20px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 8px;
`;

const ViewContent = styled.div<{ color: string }>`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.color};
  font-size: 24px;
  color: white;
  font-weight: bold;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
`;

function App() {
  const [ratio, setRatio] = useState(0.5);

  const views = [
    {
      upperContent: <ViewContent style={{height: '100%'}} color="#3498db">Upper View 1</ViewContent>,
      lowerContent: <ViewContent style={{height: '100%'}} color="#2ecc71">Lower View 1</ViewContent>
    },
    {
      upperContent: <ViewContent style={{height: '100%'}} color="#e74c3c">Upper View 2</ViewContent>,
      lowerContent: <ViewContent style={{height: '100%'}} color="#f39c12">Lower View 2</ViewContent>
    },
    {
      upperContent: <ViewContent style={{height: '100%'}} color="#9b59b6">Upper View 3</ViewContent>,
      lowerContent: <ViewContent style={{height: '100%'}} color="#1abc9c">Lower View 3</ViewContent>
    },
    {
      upperContent: <ViewContent style={{height: '100%'}} color="#34495e">Upper View 4</ViewContent>,
      lowerContent: <ViewContent style={{height: '100%'}} color="#d35400">Lower View 4</ViewContent>
    },
  ];

  return (
    <AppContainer>
      <Title>Swipeable Carousel</Title>
      
      <CarouselWrapper>
        <Carousel 
          views={views} 
          ratio={ratio}
        />
      </CarouselWrapper>
      
      <ControlsContainer>
        <RatioSlider ratio={ratio} onChange={setRatio} />
      </ControlsContainer>
    </AppContainer>
  );
}

export default App;
