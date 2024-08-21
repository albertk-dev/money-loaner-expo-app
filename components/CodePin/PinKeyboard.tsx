import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import APP_IMAGES from '../../constants/images';

interface PinKeyboardProps {
  maxLength: number;
  onMaxLengthReached: () => void;
  onChange: (pin: string) => void;
  errorMessage?: string;
  onErrorClear?: () => void;
  disabled?: boolean;
}

const PinKeyboard: React.FC<PinKeyboardProps> = ({
  maxLength,
  onMaxLengthReached,
  onChange,
  errorMessage,
  onErrorClear,
  disabled = false,
}) => {
  const [pin, setPin] = useState<string>('');
  const [randomNumbers, setRandomNumbers] = useState<number[]>([]);

  const generateRandomNumbers = useCallback(() => {
    const numbers = Array.from({ length: 10 }, (_, i) => i);
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    setRandomNumbers(numbers);
  }, []);

  useEffect(() => {
    generateRandomNumbers();
  }, [generateRandomNumbers]);

  useEffect(() => {
    onChange(pin);
    if (pin.length === maxLength) {
      onMaxLengthReached();
    }
  }, [pin, maxLength, onChange, onMaxLengthReached]);

  const handleNumberPress = (num: number) => {
    if (pin.length < maxLength && !disabled) {
      setPin((prevPin) => prevPin + num);
      if (errorMessage && onErrorClear) {
        onErrorClear();
      }
    }
  };

  const handleClearPress = () => {
    setPin((prevPin) => prevPin.slice(0, -1));
  };

  const handleRetry = () => {
    setPin('');
    generateRandomNumbers();
  };

  const isMaxLengthReached = pin.length === maxLength;

  return (
    <View style={[styles.container, disabled && styles.containerDisabled]}>
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
      <View style={styles.keyboardContainer}>
        {randomNumbers.map((num) => (
          <TouchableOpacity
            key={num}
            style={[
              styles.key,
              (isMaxLengthReached || disabled) && styles.keyDisabled,
            ]}
            onPress={() => handleNumberPress(num)}
            disabled={isMaxLengthReached || disabled}
          >
            <Text style={styles.keyText}>{num}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity disabled={disabled} style={styles.clearKey} onPress={handleClearPress}>
          <APP_IMAGES.CLEAR_CHAR_ICON width={32} height={32} />
        </TouchableOpacity>
      </View>
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  containerDisabled: {
    opacity: 0.5,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  keyboardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  key: {
    width: 60,
    height: 60,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc',
    borderRadius: 30,
  },
  keyDisabled: {
    backgroundColor: '#999',
  },
  keyText: {
    fontSize: 24,
  },
  clearKey: {
    width: 60,
    height: 60,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f00',
    borderRadius: 30,
  },
  retryButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#00f',
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
  },
});

export default PinKeyboard;
