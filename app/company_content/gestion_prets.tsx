/* eslint-disable prettier/prettier */
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  Button,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInputProps,
  TextStyle,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";

import { KeyboardAccessoryView } from "react-native-keyboard-accessory";
import { ICompany, ILoan } from "money-loaner-api-types";
import { useSelector } from "../../hooks/useSelector";
import { useDispatch } from "react-redux";
import APP_IMAGES from "../../constants/images";
import fonts from "../../constants/fonts";
import Color from "color";
import { SvgProps } from "react-native-svg";
import CustomAlert from "../../components/CustomAlert";
import { MoreMenuItem } from "../../components/List/MoreMenu";
import DropdownMenu from "../../components/DropDownMenu";
import LoanList from "../../components/List/loanList";
import LoanDetails from "../../components/LoanDetails";
import { loanActions } from "../../redux/loan/loan.slice";

import CommonStyle from "../../styles/common";

import { useAppThemeColor } from "@/hooks/useThemeColor";
import { router } from "expo-router";

const Company_GestionPretsScreen = () => {
  const colors = useAppThemeColor();

  const style = CommonStyle(colors);
  const company = useSelector(
    (state) => state.company.companyInfos as ICompany
  );
  const loans = useSelector((state) => state.loan.companyLoans);
  const loading = useSelector((state) => state.loan.loading);
  const errorMessage = useSelector((state) => state.loan.error);

  const [search, setSearch] = useState<string>("");
  const [sortedBy, setSortedBy] = useState<"amount" | "date" | "job">("date");
  const [order, setOrder] = useState<boolean>(true);

  const sortedByItems = [
    { label: "Montant", onPress: () => setSortedBy("amount") },
    { label: "Date", onPress: () => setSortedBy("date") },
    { label: "Poste Occupé", onPress: () => setSortedBy("job") },
  ];

  const orderItems = [
    { label: "croissant", onPress: () => setOrder(true) },
    { label: "décroissant", onPress: () => setOrder(false) },
  ];

  const [selectedLoans, setSelectedLoans] = useState<ILoan[]>([]);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const [detailsVisible, setDetailsVisible] = useState(false);
  const [detailData, setDetailData] = useState<ILoan | null>(null);

  const closeAlert = () => {
    setAlertVisible(false);
  };

  const showDetails = (data: ILoan) => {
    setDetailData(data);
    setDetailsVisible(true);
  };

  const closeDetails = () => {
    setDetailsVisible(false);
    setDetailData(null);
  };

  const dispatch = useDispatch();

  const menuItems: MoreMenuItem<ILoan>[] = [
    {
      text: "Détails",
      onClick: (data: ILoan) => {
        showDetails(data);
      },
      available: true,
    },
  ];

  useEffect(() => {
    dispatch(loanActions.getAllCompanyLoansStart({ companyId: company._id }));
  }, []);

  return (
    <View style={{ flex: 1, padding: 10, paddingTop: 0 }}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          padding: 10,
          paddingTop: 0,
          height: 64,
          justifyContent: "space-between",
          gap: 5,
          alignItems: "center",
        }}
      >
        <View
          style={{
            flex: 1,
            borderRadius: 50,
            borderColor: colors.primary,
            borderWidth: 1,
            paddingLeft: 5,
            justifyContent: "space-between",
            flexDirection: "row",
            gap: 5,
            alignItems: "center",
          }}
        >
          <APP_IMAGES.SEARCH_ICON
            width={16}
            height={16}
            fill={colors.black}
            fillOpacity={0.5}
          />
          <TextInput
            placeholderTextColor={Color(colors.primary).alpha(0.3).toString()}
            placeholder="Rechercher un employé..."
            style={
              {
                padding: 5,
                flex: 1,
                ...fonts.bodyHighLight,
                color: colors.primary,
              } as any
            }
            value={search}
            onChangeText={(text) => setSearch(text)}
          />
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          padding: 10,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <DropdownMenu items={sortedByItems} />
        <DropdownMenu items={orderItems} />
      </View>

      {selectedLoans.length === 0 ? (
        <View style={{ width: "100%" }}>
          <TouchableOpacity
            style={{
              padding: 10,
              backgroundColor: colors.primary,
            }}
            onPress={() => {
              router.push({
                pathname: "/company_content/repay",
                params: {
                  data: JSON.stringify({ loans, company }),
                },
              });
            }}
          >
            <Text
              style={{ color: colors.white, ...fonts.subtitle } as TextStyle}
            >
              Remboursser tous les prets
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ width: "100%" }}>
          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: "/company_content/repay",
                params: {
                  data: JSON.stringify({ loans:selectedLoans, company }),
                },
              });
            }}
          >
            <Text
              style={{ color: colors.white, ...fonts.subtitle } as TextStyle}
            >
              Remboursser les prets Sélectionnés
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {loading && (
        <View
          style={{
            justifyContent: "space-between",
            flexDirection: "row",
            paddingHorizontal: 20,
            alignItems: "center",
          }}
        >
          <Text>chargement des données...</Text>

          <ActivityIndicator />
        </View>
      )}

      <View style={{ flex: 1 }}>
        <LoanList
          onSelectLoan={(ls) => setSelectedLoans(ls)}
          onRepay={(loan) => {
            router.push({
              pathname:"/company_content/repay",
              params:{
                data: JSON.stringify({loans:[loan], company})
              }
            })
          }}
          data={loans}
          sortBy={sortedBy}
          entityType="company"
          searchQuery={search}
          menuItems={menuItems}
        />
      </View>

      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={closeAlert}
        type="error"
      />
      <LoanDetails
        visible={detailsVisible}
        loan={detailData!}
        onClose={closeDetails}
        onDownloadReceip={() =>
          Alert.alert("les reçus seront disponibles bientot")
        }
      />

      <KeyboardAccessoryView
        style={{ paddingVertical: 5, marginBottom: 20, height: "auto" }}
        alwaysVisible={true}
        androidAdjustResize
      >
        {({ isKeyboardVisible }) => (
          <View
            style={{ gap: 10, justifyContent: "center", alignItems: "center" }}
          >
            <Button
              title="Recharger la liste"
              onPress={() =>
                dispatch(
                  loanActions.getAllCompanyLoansStart({
                    companyId: company._id,
                  })
                )
              }
            />
          </View>
        )}
      </KeyboardAccessoryView>
    </View>
  );
};

export default Company_GestionPretsScreen;
