import React, { useState } from 'react';
import { View, Text, Dimensions } from 'react-native';
import Svg, { G, Circle, Path, Text as SvgText } from 'react-native-svg';
import { colors } from '../../theme/colors';

interface PieChartProps {
  data: Array<{
    id: string;
    name: string;
    amount: number;
    percentage: number;
    color: string;
  }>;
  onSegmentClick?: (category: { id: string; name: string }) => void;
  totalAmount: number;
}

// This function converts polar coordinates to cartesian
const polarToCartesian = (
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

// This function creates an SVG arc path
const describeArc = (
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number
) => {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
  
  return [
    'M',
    start.x,
    start.y,
    'A',
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
    'L',
    x,
    y,
    'Z',
  ].join(' ');
};

// This component renders a pie chart using SVG
const PieChartComponent: React.FC<PieChartProps> = ({ data, onSegmentClick, totalAmount }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Screen dimensions to calculate chart size
  const screenWidth = Dimensions.get('window').width;
  const size = Math.min(screenWidth * 0.7, 500); // Adjust chart size based on screen
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.38; // Slightly smaller to fit labels
  const innerRadius = radius * 0.7; // For donut chart

  // Handle tapping on a pie segment
  const handlePress = (index: number) => {
    setActiveIndex(index);
    if (onSegmentClick && data[index]) {
      onSegmentClick({
        id: data[index].id,
        name: data[index].name,
      });
    }
  };

  // If there's no data, show a placeholder     
  if (!data || data.length === 0) {
    return (
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: colors.gray[500] }}>No data available</Text>
      </View>
    );
  }

  // Calculate the angles for each segment
  let currentAngle = 0;
  const segments = data.map((segment, index) => {
    const angle = (segment.percentage / 100) * 360;
    
    const segmentPath = {
      path: describeArc(centerX, centerY, radius, currentAngle, currentAngle + angle),
      color: segment.color,
      startAngle: currentAngle,
      endAngle: currentAngle + angle,
      midAngle: currentAngle + angle / 2,
      percentage: segment.percentage,
      amount: segment.amount,
      name: segment.name,
      id: segment.id,
      index,
    };
    currentAngle += angle;
    return segmentPath;
  });

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <G>
          {/* Draw pie segments or a single circle if only one category */}
          {data.length === 1 ? (
            // Render a single circle if there's only one data item
            <Circle
              cx={centerX}
              cy={centerY}
              r={radius} // Use the main radius
              fill={data[0].color}
              stroke="white"
              strokeWidth={2}
              onPress={() => handlePress(0)} // Allow clicking the single segment
            />
          ) : (
            // Render individual paths if there are multiple segments
            segments.map(segment => {
              const isActive = activeIndex === segment.index;
              const segmentRadius = isActive ? radius + 5 : radius;
              
              return (
                <G key={`segment-${segment.index}`}>
                  <Path
                    d={describeArc(
                      centerX,
                      centerY,
                      segmentRadius,
                      segment.startAngle,
                      segment.endAngle
                    )}
                    fill={segment.color}
                    stroke="white"
                    strokeWidth={2}
                    onPress={() => handlePress(segment.index)}
                  />
                </G>
              );
            })
          )}
          
          {/* Create donut hole */}
          <Circle cx={centerX} cy={centerY} r={innerRadius} fill="white" />

          {/* Total amount in center */}
          <SvgText
            x={centerX-26}
            y={centerY}
            // textAnchor="middle"
            // alignmentBaseline="middle"
            fontSize={14}
            fontWeight="bold"
            fill="#333"
            letterSpacing={15}
          >
            ${totalAmount.toFixed(2)}
          </SvgText>
          <SvgText
            x={centerX-2}
            y={centerY +15}
            textAnchor="middle"
            // alignmentBaseline="middle"
            fontSize={10}
            fill={colors.gray[500]}
          >
            Total
          </SvgText>
          {/* Draw the value labels directly at the edge of each segment */}
          {/* Only draw labels if there's more than one segment, otherwise it's redundant */}
          {data.length > 1 && segments.map(segment => {
            // Skip very small segments
            if (segment.percentage < 3) return null; 
            
            // Calculate position for label at the middle angle of the segment
            // Position slightly beyond the outer edge of the pie
            const labelPoint = polarToCartesian(
              centerX, 
              centerY, 
              radius * 1.0, // Just outside the pie edge
              segment.midAngle
            );
            
            return (
              <G key={`label-${segment.index}`}>
                 {/* Circle background for better visibility */}
                 <Circle
                   cx={labelPoint.x} // Removed +7 offset
                   cy={labelPoint.y}
                   r={16}
                   fill="white"
                  opacity={1}
                />
                
                {/* Dollar amount value */}
                <SvgText
                  x={labelPoint.x}
                  y={labelPoint.y}
                  textAnchor="middle"
                  // alignmentBaseline="middle"
                  fontSize={10}
                  fontWeight="bold"
                  fill="#333"
                >
                  $ {segment.amount.toFixed(0)}
                </SvgText>
              </G>
            );
          })}
        </G>
      </Svg>
    </View>
  );
};

export default PieChartComponent;
