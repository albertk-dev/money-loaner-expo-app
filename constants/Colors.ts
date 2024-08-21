/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export interface IAppColors {
  text: string,
  primary: string,
  secondary: string,
  background: string,
  tint: string,
  icon: string,
  tabIconDefault: string,
  tabIconSelected: string,
  black:string,
  white: string,
  danger:string,
}

export interface IAppThemeColors{
  light:IAppColors,
  dark:IAppColors
}

export const Colors: IAppThemeColors = {
  light: {
    text: '#11181C',
    primary: '#2196f3',
    secondary: '#Ef6c00',
    background: '#f3f3f3',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    black:'#000',
    white: '#fff',
    danger: "#f00"
  },
  dark: {
    text: '#ECEDEE',
    primary:'#90caf9',
    secondary: "#ffb74d",
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    black:'#000',
    white: '#fff',
    danger: "#f00"
  },
};
