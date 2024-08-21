import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Color from 'color';
import { IAppColors } from '@/constants/Colors';
import { useAppThemeColor } from '@/hooks/useThemeColor';

interface CustomStatusBarProps {
  progress: number;
  statusMessage: string;
}

const CustomStatusBar: React.FC<CustomStatusBarProps> = ({ progress, statusMessage }) => {

const colors = useAppThemeColor();
const styles = customStyles(colors)
  return (
    <View style={styles.container}>
      <Text style={styles.statusMessage}>{statusMessage}</Text>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>
      <Text style={styles.progressText}>{`${progress.toFixed(2)}%`}</Text>
    </View>
  );
};

const customStyles = (colors:IAppColors)=> StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: Color(colors.background).alpha(0.9).toString(),
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginHorizontal: 10,
  },
  statusMessage: {
    fontSize: 16,
    marginBottom: 5,
    color: Color(colors.primary).alpha(0.8).toString(),
  },
  progressBarContainer: {
    height: 20,
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Color(colors.secondary).alpha(0.8).toString(),
  },
  progressText: {
    marginTop: 5,
    fontSize: 14,
    color: Color(colors.primary).alpha(0.8).toString(),
  },
});

export default CustomStatusBar;
