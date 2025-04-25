import React, { useState } from "react";
import SwipeableViews from "react-swipeable-views";
import styled from "styled-components";

// props interface for our carousel component
interface CarouselProps {
  views: {
    upperContent: React.ReactNode;
    lowerContent: React.ReactNode;
  }[];
  ratio?: number;
}

// main container to hold all carousel elements
const CarouselContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

// props for the content sections
interface ViewContentProps {
  ratio: number;
  isUpper: boolean;
}

// content container with dynamic height based on ratio
const ViewContent = styled.div<ViewContentProps>`
  width: 100%;
  height: ${(props) =>
    props.isUpper ? `${props.ratio * 100}%` : `${(1 - props.ratio) * 100}%`};
  overflow: hidden;
`;

// divider that contains the navigation dots
const Divider = styled.div`
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
`;

// props for the navigation dots
interface DotProps {
  active: boolean;
}

// navigation dot with active/inactive styles
const Dot = styled.div<DotProps>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${(props) => (props.active ? "#333" : "#ccc")};
  margin: 0 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
`;

const Carousel: React.FC<CarouselProps> = ({ views, ratio = 0.5 }) => {
  // track which view is currently active
  const [activeIndex, setActiveIndex] = useState(0);

  // handle swipe navigation
  const handleChangeIndex = (index: number) => {
    setActiveIndex(index);
  };

  // handle dot click navigation
  const handleDotClick = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <CarouselContainer>
      {/* upper content area */}
      <ViewContent ratio={ratio} isUpper={true}>
        <SwipeableViews
          enableMouseEvents
          resistance
          index={activeIndex}
          onChangeIndex={handleChangeIndex}
          style={{ height: "100%" }}
        >
          {views.map((view, index) => (
            <div key={`upper-${index}`} style={{ height: "100%" }}>
              {view.upperContent}
            </div>
          ))}
        </SwipeableViews>
      </ViewContent>

      {/* navigation dots in the middle divider */}
      <Divider>
        {views.map((_, index) => (
          <Dot
            key={index}
            active={index === activeIndex}
            onClick={() => handleDotClick(index)}
          />
        ))}
      </Divider>

      {/* lower content area */}
      <ViewContent ratio={ratio} isUpper={false}>
        <SwipeableViews
          enableMouseEvents
          resistance
          index={activeIndex}
          onChangeIndex={handleChangeIndex}
          style={{ height: "100%" }}
        >
          {views.map((view, index) => (
            <div key={`lower-${index}`} style={{ height: "100%" }}>
              {view.lowerContent}
            </div>
          ))}
        </SwipeableViews>
      </ViewContent>
    </CarouselContainer>
  );
};

export default Carousel;
