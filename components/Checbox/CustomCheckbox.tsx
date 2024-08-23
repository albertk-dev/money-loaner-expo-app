import { IAppColors } from '@/constants/Colors';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle, GestureResponderEvent } from 'react-native';

interface CustomCheckboxProps {
  label: string;
  onChange: (checked: boolean) => void;
  checked: boolean;
  colors: IAppColors;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ label, onChange, checked,colors }) => {
  const [isChecked, setIsChecked] = useState(checked);
  const styles= checboxStyles(colors)

  const handlePress = (event: GestureResponderEvent) => {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    onChange(newCheckedState);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
        {isChecked && <Text style={styles.checkmark}>✓</Text>}
      </View>
    </TouchableOpacity>
  );
};

const checboxStyles = (colors:IAppColors) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    padding:2,
  } as ViewStyle,
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: colors.secondary,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    
    marginLeft: 10,
  } as ViewStyle,
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  } as ViewStyle,
  checkmark: {
    fontSize: 14,
    color: colors.white,
  } as TextStyle,
  label: {
    fontSize: 16,
  } as TextStyle,
});

export default CustomCheckbox;
