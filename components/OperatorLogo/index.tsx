import React from 'react'
import APP_IMAGES from '../../constants/images';
import { getOperator } from '../../helpers/mobileOperator';

type OperatorLogoProps = {
  phoneNumber: string;
  size: 16 | 32 | 48 | 64;
};

const OperatorLogo: React.FC<OperatorLogoProps> = ({ phoneNumber, size }) => {
  const operator = getOperator(phoneNumber);
  const operatorKey = `LOGO_${operator.toUpperCase()}`;

  const SvgLogo = APP_IMAGES[operatorKey as keyof typeof APP_IMAGES];

  if (!SvgLogo) {
      return <APP_IMAGES.ICON_UNKNOWN_OPERATOR width={size} height={size} />;
  }

  return <SvgLogo width={size} height={size} />;
};

export default OperatorLogo;
