/* eslint-disable prettier/prettier */
import { View, Text, TouchableWithoutFeedback, Keyboard, ScrollView, FlatList, Button, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';
import { ICompany } from 'money-loaner-api-types';
import { useSelector } from '../hooks/useSelector';
import { authActions } from '../redux/auth/auth.slice';
import { useDispatch } from 'react-redux';
import APP_IMAGES from '../constants/images';

import fonts from '../constants/fonts';
import Color from 'color';
import CompaniesList from '../components/List/CompaniesList';
import { router } from 'expo-router';
import { useAppThemeColor } from '@/hooks/useThemeColor';
import commonStyles from '@/styles/common';




const filter = (data: Array<ICompany> | null, query: string) => {
  if (!data) return []
  return data.filter(company => query.split('').every(letter => company.name.toLowerCase().includes(letter.toLowerCase())));
  
}


const ListCompanyScreen = () => {
  const [search, setSearch] = useState<string>('');
  //const [filteredCompanies, setFilteredCompanies] = useState<Array<ICompany> | null>(null);
  const companies = useSelector(state => state.auth.allCompanies);
  const loading = useSelector(state => state.auth.fetchingCompanies)
  const success = useSelector(state => state.auth.fetchingCompaniesSuccess);
  const error = useSelector(state => state.auth.errorFetchingCompanies);

  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(authActions.fetchCompaniesRequest())
  }, [])


  function handleSelectCompany(company: ICompany) {
    dispatch(authActions.setSelectedCompany(company));
    router.back()
  
  }
  // if (!filteredCompanies && search === '') {
  //   setFilteredCompanies(companies)
  // }

  const filteredCompany = useMemo(() => filter(companies, search), [companies, search])


// function handleSearch(ValueTosearch: string) {
//   setSearch(ValueTosearch);
//   const formatedValue = ValueTosearch.toLowerCase()
//   if (companies) {
//     const filteredCompanies = companies?.filter((company) => company.name.toLowerCase().includes(formatedValue))
//       setFilteredCompanies(filteredCompanies)
    
//   }
  
// }

const colors = useAppThemeColor()
    const styles = commonStyles(colors)

  return (
    <TouchableWithoutFeedback  onPress={Keyboard.dismiss}>
      <View style={{flex:1}}>
        <View style={{ display: 'flex', flexDirection: 'row', padding: 10, height: 64, justifyContent: 'space-between', gap: 5, alignItems: 'center' }}>
          <TouchableOpacity onPress={()=>router.back()}>
                 <APP_IMAGES.ARROW_BACK_ICON width={32} height={32}  fill={colors.primary}/>
          </TouchableOpacity>
   
          <View style={{flex:1,borderRadius:50, borderColor:colors.primary, borderWidth:1, paddingLeft:5, justifyContent:'space-between', flexDirection:'row', gap:5, alignItems:'center'}}>
            <APP_IMAGES.SEARCH_ICON width={16} height={16} fill={colors.black} fillOpacity={0.5}/>
            <TextInput placeholderTextColor={Color(colors.primary).alpha(0.3).toString()} placeholder='Rechercher une entreprise...' style={{ flex: 1,...fonts.bodyHighLight,color:colors.primary }as any} value={search} onChangeText={(text)=>setSearch(text)} />
      
          </View>
        <APP_IMAGES.LOGO width={48} height={44}/>  
        </View>
        <View>
          {loading && <View style={{ justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 20, alignItems:'center'}}>
            <Text>
              chargement des données...
            </Text>
            <ActivityIndicator />
          </View>}
          {!success && error && <Text> échec...{error}</Text>}
        </View>
        <View style={{flex:1, alignItems:'center', justifyContent:'center', paddingVertical:10}}>
          <CompaniesList companies={filteredCompany!} handleSelectCompany={handleSelectCompany} query={search} />
        
        </View>

        <KeyboardAccessoryView style={{ paddingVertical: 5, marginBottom: 20, height: 'auto' }} alwaysVisible={true} androidAdjustResize>
                    {({ isKeyboardVisible }) => (
                        <View style={{ gap: 10, justifyContent: 'center', alignItems: 'center' }}>
                            <Button  title='Recharger la liste' onPress={()=>dispatch(authActions.fetchCompaniesRequest())}/>
                        </View>
          )}
          </KeyboardAccessoryView>
          </View>
    
    </TouchableWithoutFeedback>
  );
};

export default ListCompanyScreen;
