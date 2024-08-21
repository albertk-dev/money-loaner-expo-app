/* eslint-disable prettier/prettier */
import { View, Text, SafeAreaView, Button, TextInput, TouchableOpacity, ActivityIndicator, Alert, TextInputProps, TextStyle } from 'react-native';
import React, { useEffect, useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import CommonStyle from '../../styles/common';
import { useAppThemeColor } from '@/hooks/useThemeColor';
import { router } from 'expo-router';
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';
import { ICompany,IFullEmployee,ILoan } from 'money-loaner-api-types';
import { useSelector } from '../../hooks/useSelector';
import { useDispatch } from 'react-redux';
import APP_IMAGES from '../../constants/images';
import fonts from '../../constants/fonts';
import Color from 'color';
import { SvgProps } from 'react-native-svg';
import CustomAlert from '../../components/CustomAlert';
import { MoreMenuItem } from '../../components/List/MoreMenu';
import DropdownMenu from '../../components/DropDownMenu';
import LoanList from '../../components/List/loanList';
import LoanDetails from '../../components/LoanDetails';
import { loanActions } from '../../redux/loan/loan.slice';








const Employee_HistoryScreen = () => {

    const colors = useAppThemeColor()
    const style = CommonStyle(colors);


  const employee = useSelector(state => state.employee.employeeInfos as IFullEmployee);
  const loans = useSelector(state => state.loan.employeeLoans as ILoan[])
  const loading = useSelector(state => state.loan.loading)
  const errorMessage = useSelector(state => state.loan.error)

  const [search, setSearch] = useState<string>('');
  const [sortedBy, setSortedBy] = useState<'name'| 'amount' | 'job' | 'date'>('name');
  const [order, setOrder] = useState<boolean>(true);

  const sortedByItems = [
    { label: 'Montant', onPress: () => setSortedBy('amount') },
    {label: 'Date', onPress: () => setSortedBy('date') }
  ]

  const orderItems = [
    { label: 'croissant', onPress: () => setOrder(true) },
    { label: 'décroissant', onPress: () => setOrder(false) },
  ]


  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("")
  const [alertMessage, setAlertMessage] = useState('');

  const [detailsVisible, setDetailsVisible] = useState(false);
  const [detailData, setDetailData] = useState<ILoan| null>(null)



    const showAlert = (message: string, title:string = "Erreur de validation") => {
        setAlertMessage(message);
        setAlertVisible(true);
        setAlertTitle(title)
    };

    const closeAlert = () => {
        setAlertVisible(false);
  };

  const showDetails = (data: ILoan) => {
    setDetailData(data);
    setDetailsVisible(true);
  }

  const closeDetails = () => {
    setDetailsVisible(false);
    setDetailData(null);

  }
  


  const dispatch = useDispatch()
  
  useEffect(() => {
      dispatch(loanActions.getAllEmployeeLoansStart({employeeId:employee._id}))

  }, [])
  


  const menuItems:MoreMenuItem<ILoan>[] = [


    {
      text: 'Détails',
      onClick: (data: ILoan) => {
        showDetails(data);
      },
      available:true,
    },
   
    {
      text: 'Supprimer',
      onClick: (data: ILoan) => {
        Alert.alert('Supprimer pret...', data.no.toString());
      },
      available:false,
      
    },
  ];


  


 
  return (
  
    
    <SafeAreaView style={{ flex: 1, padding: 10 }}>
        <View style={{ display: 'flex', flexDirection: 'row', padding: 10, height: 64, justifyContent: 'space-between', gap: 5, alignItems: 'center' }}>
          <TouchableOpacity onPress={()=>router.back()}>
                 <APP_IMAGES.ARROW_BACK_ICON width={32} height={32}  fill={colors.primary}/>
          </TouchableOpacity>
   
          <View style={{flex:1,borderRadius:50, borderColor:colors.primary, borderWidth:1, paddingLeft:5, justifyContent:'space-between', flexDirection:'row', gap:5, alignItems:'center'}}>
            <APP_IMAGES.SEARCH_ICON width={16} height={16} fill={colors.black} fillOpacity={0.5}/>
            <TextInput placeholderTextColor={Color(colors.primary).alpha(0.3).toString()} placeholder='Rechercher un montant...' style={{ flex: 1,...fonts.bodyHighLight,color:colors.primary }as any} value={search} onChangeText={(text)=>setSearch(text)} />
      
          </View>
        <APP_IMAGES.LOGO width={32} height={32}/>  
      </View>
      <Text style={{...fonts.title, color:colors.primary, width:'100%', textAlign:'center'} as TextStyle}>Historique</Text>
      <View style={{flexDirection: 'row', padding:10, justifyContent:'space-between', alignItems:'center'}}>
        <DropdownMenu items={sortedByItems} />
        <DropdownMenu items={orderItems} />
        <TouchableOpacity onPress={()=> router.push("/employee_content/")} style={{borderRadius: 4, borderWidth:1, borderColor:colors.primary, padding:5}}>
          <APP_IMAGES.ICON_ADDITION fill={colors.primary} width={32} height={32}/>
        </TouchableOpacity>
        
      </View>
      
          {loading && <View style={{ justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 20, alignItems:'center'}}>
            <Text>
              chargement des données...
        </Text>
        
            <ActivityIndicator />
      </View>}
      {errorMessage && <Text>{errorMessage}</Text>}

      <View style={{flex:1}}>
        <LoanList onRepay={()=>null} onSelectLoan={()=>null}  data={loans} searchQuery={search} menuItems={menuItems} sortBy={sortedBy} order={order} entityType='employee' />
        </View>
        
          <CustomAlert
                        visible={alertVisible}
                        title={alertTitle}
                        message={alertMessage}
                        onClose={closeAlert}
                        type='error'
      />
      <LoanDetails loan={detailData!}  visible={detailsVisible} onClose={closeDetails} onDownloadReceip={(loan)=>Alert.alert(`Pret No ${loan.no}`, "téléchargement du reçu...pour une prochaine version")} />
            



       
            <KeyboardAccessoryView style={{ paddingVertical: 5, marginBottom: 20, height: 'auto' }} alwaysVisible={true} androidAdjustResize>
                    {({ isKeyboardVisible }) => (
                        <View style={{ gap: 10, justifyContent: 'center', alignItems: 'center' }}>
          

                            <Button  title='Recharger la liste' onPress={()=>dispatch(loanActions.getAllEmployeeLoansStart({employeeId:employee._id}))}/>
      

                        </View>
          )}
          </KeyboardAccessoryView>
      </SafeAreaView>

     
  );
};

export default Employee_HistoryScreen;
