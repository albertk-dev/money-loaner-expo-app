/* eslint-disable prettier/prettier */
import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Image, Alert } from 'react-native';

import APP_IMAGES from '../constants/images';


import commonStyles from '@/styles/common';
import { useAppThemeColor } from '@/hooks/useThemeColor';
import fonts from '@/constants/fonts';
import { router } from 'expo-router';
import Buttons from '@/components/Buttons';


const ChooseEntityScreen = () => {

    const colors = useAppThemeColor()
    const style = commonStyles(colors)
  return (
    <SafeAreaView style={style.page}>
      <View style={style.Headerblock}>
        <APP_IMAGES.LOGO width={48} height={54} />
        <Text style={style.HeaderText}>Money Loaner</Text>
      </View>

      <Text style={{ ...fonts.bodyHighLight, color: colors.primary, opacity: 0.8, width: 180, textAlign: 'center' } as any}>Gérer vos prêts en toute simplicité. 🚀</Text>

      <APP_IMAGES.CHOOSE_ENTITY_IMAGE width={182} height={194} />

      <Text style={{ ...fonts.bodyHighLight, color: 'black' } as any}>Vous vous connectez en tant que </Text>

      {/**Zone des bouttons */}
      <View style={style.bouttonZone}>

        <Buttons.ChooseEntity onPress={() => router.push('/company_auth')} image={APP_IMAGES.PROMOTER_IMAGE} entityTitle={"Chef d'Entreprise"} description={"Faciliter les prets de vos employés"} />

        <Buttons.ChooseEntity onPress={() => router.push("/employee_auth/")} image={APP_IMAGES.EMPLOYEE_IMAGE} entityTitle={"Employé"} description={"Faites des prets d'argent sans effort"} />

      </View>

    </SafeAreaView>
  );
};

export default ChooseEntityScreen;
