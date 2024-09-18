/* eslint-disable prettier/prettier */
import { View, Text,  Button, TextInput, TouchableOpacity, ActivityIndicator, Alert, TextInputProps, TextStyle } from 'react-native';
import React, { useEffect, useState } from 'react';
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';
import { ICompany, IEmployee } from 'money-loaner-api-types';
import fonts from '../../constants/fonts';
import { SvgProps } from 'react-native-svg';
import CustomAlert from '../../components/CustomAlert';
import EmployeeList from '../../components/List/employeesList';
import { MoreMenuItem } from '../../components/List/MoreMenu';
import DropdownMenu from '../../components/DropDownMenu';
import EmployeeDetails from '../../components/EmployeeDetails';
import { useSelector } from '../../hooks/useSelector';
import Color from 'color';
import { useDispatch } from 'react-redux';
import { companyActions } from '../../redux/company/company.slice';
import APP_IMAGES from '../../constants/images';
import CommonStyle from '../../styles/common';
import { router } from 'expo-router';
import { useAppThemeColor } from '@/hooks/useThemeColor';
import { SafeAreaView } from 'react-native-safe-area-context';


type ProfileField = {
    name: keyof EmployeeUpdatable;
    label: string;
    required?: boolean;
    rhfRules?: any;
  canEdit?: boolean | true;
    startIcon?: React.FC<SvgProps>;
    endIcon?: React.FC<SvgProps>;
    startIconProps?: SvgProps;
    endIconProps?: SvgProps;
    textInputProps?: TextInputProps;
    helperText?: string;
    placeHolder?: string;
  
  }

type EmployeeUpdatable = Omit<IEmployee,'_id' | 'codePin' | 'updatedAt' | "employees">

const Company_GestionEmployeeScreen = () => {

    const colors = useAppThemeColor()
    const style = CommonStyle(colors);

  const company = useSelector(state => state.company.companyInfos as ICompany);
  const employees = useSelector(state => state.company.employees as IEmployee[])
  const loading = useSelector(state => state.company.gettingEmployees)
  const success = useSelector(state => state.company.gettingEmployeesSucces)
  const errorMessage = useSelector(state => state.company.errorGettingEmployees)

  const [search, setSearch] = useState<string>('');
  const [sortedBy, setSortedBy] = useState<'name'| 'salary' | 'job'>('name');
  const [order, setOrder] = useState<boolean>(true);

  const sortedByItems = [
    { label: 'Salaire', onPress: () => setSortedBy('salary') },
    { label: 'Poste Occupé', onPress: () => setSortedBy('job') },
    { label: 'Nom', onPress: () => setSortedBy('name') },
  ]

  const orderItems = [
    { label: 'croissant', onPress: () => setOrder(true) },
    { label: 'décroissant', onPress: () => setOrder(false) },
  ]


  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("")
  const [alertMessage, setAlertMessage] = useState('');

  const [detailsVisible, setDetailsVisible] = useState(false);
  const [detailData, setDetailData] = useState<IEmployee| null>(null)



    const showAlert = (message: string, title:string = "Erreur de validation") => {
        setAlertMessage(message);
        setAlertVisible(true);
        setAlertTitle(title)
    };

    const closeAlert = () => {
        setAlertVisible(false);
  };

  const showDetails = (data: IEmployee) => {
    setDetailData(data);
    setDetailsVisible(true);
  }

  const closeDetails = () => {
    setDetailsVisible(false);
    setDetailData(null);

  }
  


  const dispatch = useDispatch()
  
  useEffect(() => {
      dispatch(companyActions.getEmployeesrequest({companyId:company._id}))
    
  }, [])
  


  const menuItems:MoreMenuItem<IEmployee>[] = [

    {
      text: 'Modifier',
      onClick: (data: IEmployee) => {
        router.push({
          pathname: '/company_content/update_employee',
          params: { data:JSON.stringify(data) },
        });
      },
      available:true,
      
    },
    {
      text: 'Détails',
      onClick: (data: IEmployee) => {
        showDetails(data);
      },
      available:true,
    },
    {
      text: 'Bloquer',
      onClick: (data: IEmployee) => {
        Alert.alert('Blocker...', data.name);
      },
    },
    {
      text: 'Supprimer',
      onClick: (data: IEmployee) => {
        Alert.alert('Supprimer...', data.name);
      },
      available:false,
      
    },
  ];

  


 
  return (
  
    
    <View style={{ flex: 1, padding: 10 }}>
        <View style={{ display: 'flex', flexDirection: 'row', padding: 10, height: 64, justifyContent: 'space-between', gap: 5,marginTop:0, alignItems: 'center',paddingTop:0 }}>
          <View style={{flex:1,borderRadius:50, borderColor:colors.primary, borderWidth:1, paddingLeft:10, justifyContent:'space-between', flexDirection:'row', gap:5, alignItems:'center'}}>
            <APP_IMAGES.SEARCH_ICON width={16} height={16} fill={colors.black} fillOpacity={0.5}/>
            <TextInput placeholderTextColor={Color(colors.primary).alpha(0.3).toString()} placeholder='Rechercher un employé...' style={{ padding:5,flex: 1,...fonts.bodyHighLight,color:colors.primary }as any} value={search} onChangeText={(text)=>setSearch(text)} />
          </View>
      </View>
      <View style={{flexDirection: 'row', padding:10, justifyContent:'space-between', alignItems:'center'}}>
        <DropdownMenu items={sortedByItems} />
        <DropdownMenu items={orderItems} />
        <TouchableOpacity onPress={()=> router.push("/company_content/add_employee")} style={{borderRadius: 4, borderWidth:1, borderColor:colors.primary, padding:5}}>
          <APP_IMAGES.ICON_ADD_EMPLOYEE fill={colors.primary} width={32} height={32}/>
        </TouchableOpacity>
        
      </View>
      
          {loading && <View style={{ justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 20, alignItems:'center'}}>
            <Text>
              chargement des données...
        </Text>
        
            <ActivityIndicator />
      </View>}

      <View style={{flex:1}}>
        <EmployeeList  data={employees} searchQuery={search} menuItems={menuItems} sortBy={sortedBy} order={order} />
        </View>
        
          <CustomAlert
                        visible={alertVisible}
                        title={alertTitle}
                        message={alertMessage}
                        onClose={closeAlert}
                        type='error'
      />
      <EmployeeDetails employee={detailData!} onUpdate={(data) => Alert.alert("Go to", "Update employee with data")} visible={detailsVisible} onClose={closeDetails} />
            



       
            <KeyboardAccessoryView style={{ paddingVertical: 5, marginBottom: 20, height: 'auto' }} alwaysVisible={true} androidAdjustResize>
                    {({ isKeyboardVisible }) => (
                        <View style={{ gap: 10, justifyContent: 'center', alignItems: 'center' }}>
          

                            <Button  title='Recharger la liste' onPress={()=>dispatch(companyActions.getEmployeesrequest({companyId:company._id}))}/>
      

                        </View>
          )}
          </KeyboardAccessoryView>
      </View>

     
  );
};

export default Company_GestionEmployeeScreen;
