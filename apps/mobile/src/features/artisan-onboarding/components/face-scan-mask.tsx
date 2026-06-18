import { useWindowDimensions } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

const CIRCLE_SIZE = 350;
const MASK_OPACITY = 0.7;

type FaceScanMaskProps = {
  circleSize?: number;
};

/** Dark overlay with circular cutout and dashed ring — Figma 325:4951 */
export function FaceScanMask({ circleSize = CIRCLE_SIZE }: FaceScanMaskProps) {
  const { width, height } = useWindowDimensions();
  const radius = circleSize / 2;
  const centerX = width / 2;
  const centerY = height * 0.42;

  const cutoutPath = `M ${centerX - radius} ${centerY} a ${radius} ${radius} 0 1 0 ${circleSize} 0 a ${radius} ${radius} 0 1 0 ${-circleSize} 0`;
  const overlayPath = `M 0 0 H ${width} V ${height} H 0 Z ${cutoutPath}`;

  return (
    <Svg
      width={width}
      height={height}
      pointerEvents="none"
      style={{ position: "absolute", top: 0, left: 0 }}
    >
      <Path
        d={overlayPath}
        fill={`rgba(0, 0, 0, ${MASK_OPACITY})`}
        fillRule="evenodd"
      />
      <Circle
        cx={centerX}
        cy={centerY}
        r={radius}
        stroke="#ffffff"
        strokeWidth={2}
        strokeDasharray="8 8"
        fill="none"
      />
    </Svg>
  );
}
