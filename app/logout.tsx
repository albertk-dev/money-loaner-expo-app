import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { useDispatch } from 'react-redux';
import { BackHandler } from 'react-native';
import { authActions } from '../redux/auth/auth.slice';
import { companyActions } from '../redux/company/company.slice';

import ML_API from '../api';
import { employeeActions } from '../redux/employee/employee.slice';
import { loanActions } from '../redux/loan/loan.slice';




const LogoutScreen = () => {
  const dispatch = useDispatch();

  useEffect(() => {
      dispatch(authActions.clearAuhtData());
    dispatch(companyActions.clearData());
    dispatch(employeeActions.clearData())
    dispatch(loanActions.clearData())
      ML_API.logoutCompany();
      ML_API.logoutEmployee();
    setTimeout(() => {
      BackHandler.exitApp();
    }, 500); 

    // Cleanup function
      return () => {
       
      // Ajoutez ici les éventuelles actions de nettoyage si nécessaire
    };
  }, [dispatch]);

  return (
    <View>
      <Text>Déconnexion en cours...</Text>
    </View>
  );
};

export default LogoutScreen;
