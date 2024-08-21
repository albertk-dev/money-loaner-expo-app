import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PinCharProps {
  char: string;
  isVisible: boolean;
}

const PinChar: React.FC<PinCharProps> = ({ char, isVisible }) => {
  const [displayChar, setDisplayChar] = useState<string>(isVisible ? char : '*');

  useEffect(() => {
    if (isVisible) {
      setDisplayChar(char);

      const timer = setTimeout(() => {
        setDisplayChar('*');
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setDisplayChar('*');
    }
  }, [char, isVisible]);

  return (
    <Text style={styles.charText}>{displayChar}</Text>
  );
};

interface PinDisplayProps {
  pin: string;
}

const PinDisplay: React.FC<PinDisplayProps> = ({ pin }) => {
  const [visibleCharIndex, setVisibleCharIndex] = useState<number | null>(null);
  const [prevPinLength, setPrevPinLength] = useState<number>(0);

  useEffect(() => {
    if (pin.length > prevPinLength) {
      setVisibleCharIndex(pin.length - 1);

      const timer = setTimeout(() => {
        setVisibleCharIndex(null);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setVisibleCharIndex(null);
    }

    setPrevPinLength(pin.length);
  }, [pin]);

  return (
    <View style={styles.container}>
      {pin.split('').map((char, index) => (
        <PinChar key={index} char={char} isVisible={index === visibleCharIndex} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  charText: {
    fontSize: 24,
    letterSpacing: 2,
  },
});

export default PinDisplay;
