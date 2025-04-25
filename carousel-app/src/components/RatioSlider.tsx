import React from 'react';
import styled from 'styled-components';

interface RatioSliderProps {
  ratio: number;
  onChange: (ratio: number) => void;
}

const SliderContainer = styled.div`
  width: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SliderInput = styled.input`
  width: 80%;
  margin: 10px 0;
`;

const Label = styled.label`
  margin-bottom: 5px;
  font-size: 14px;
  color: #555;
`;

const RatioValue = styled.div`
  font-size: 12px;
  color: #888;
  margin-top: 5px;
`;

const RatioSlider: React.FC<RatioSliderProps> = ({ ratio, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    onChange(newValue);
  };

  return (
    <SliderContainer>
      <Label>Adjust ratio between upper and lower views</Label>
      <SliderInput
        type="range"
        min="0.1"
        max="0.9"
        step="0.01"
        value={ratio}
        onChange={handleChange}
      />
      <RatioValue>Upper: {Math.round(ratio * 100)}% | Lower: {Math.round((1 - ratio) * 100)}%</RatioValue>
    </SliderContainer>
  );
};

export default RatioSlider; 