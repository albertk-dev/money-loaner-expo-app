import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TextStyle, Text } from 'react-native';
import EmployeeItem from './employeeItem';
import { ILoan } from 'money-loaner-api-types';
import { MoreMenuItem } from './MoreMenu';
import  { IAppColors } from '../../constants/Colors';
import LoanItem from './loanItem';
import fonts from '../../constants/fonts';
import { useAppThemeColor } from '@/hooks/useThemeColor';

type LoanListProps = {
    data: ILoan[];
    searchQuery: string;
    order?: boolean;
    sortBy: 'amount' | 'date' | 'job' | 'name';
  menuItems: MoreMenuItem<ILoan>[];
  entityType: 'company' | 'employee';
  onRepay:()=>void;
  onSelectLoan:(selectedLoans: ILoan[])=>void;
}


function filterAndSortLoans(props: LoanListProps) {
  const { data, searchQuery, order = true, sortBy } = props;

  // Filtrage par query
  const filteredData = data?.filter((loan) => {
    const employeeName = loan.employee.name.toLowerCase();
    return employeeName.includes(searchQuery.toLowerCase());
  }) || null; 

  // Tri en fonction de l'entité et du champ spécifié
  const sortedData = filteredData?.sort((a, b) => {
    let comparison = 0;

    if (sortBy === 'amount') {
      comparison = a.amount - b.amount;
    } else if (sortBy === 'date') {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      comparison = dateA.getTime() - dateB.getTime();
    } else if (sortBy === 'job') {
      comparison = a.employee.job.localeCompare(b.employee.job);
    } else if (sortBy === 'name') {
      comparison = a.employee.name.localeCompare(b.employee.name);
    }

    return order ? comparison : -comparison;
  });

  return sortedData || null;
}

const EmptyComponent:React.FC = ()=>{
  const colors = useAppThemeColor()
  const styles = customStyles(colors)
    return (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucun pret Trouvé</Text>
        </View>
    )
}

const LoanList: React.FC<LoanListProps> = ({
  data,
  searchQuery,
  order = true,
    sortBy,
    menuItems,
  entityType,
  onRepay,
  onSelectLoan
  
}) => {

  const colors = useAppThemeColor()
  const styles = customStyles(colors)
 const sortedData = filterAndSortLoans({ data, searchQuery, order , sortBy,menuItems,entityType, onRepay, onSelectLoan})
  const [selectedLoans, setSelectedLoans] = useState<ILoan[]>([])


  // Fonction pour rendre chaque élément de la liste
  const renderItem = ({ item }: { item: ILoan }) => (
    <LoanItem onRepay={onRepay} readyToSelect={selectedLoans.length !== 0} entityType={entityType} menuItems={menuItems} loan={item} onSelect={(selected, data) => {
      if (selected) {
        setSelectedLoans([...selectedLoans, data])
        onSelectLoan(selectedLoans);

      } else {
        setSelectedLoans(selectedLoans.filter(employee => employee._id !== data._id))

      }
      }} />
  );

    return (
     
                 <FlatList
                 key={data.length}
      contentContainerStyle={!data || data?.length === 0 ? styles.emptyFlatList:styles.list}
      data={sortedData}
      renderItem={renderItem}
      keyExtractor={(item) => item._id}
            ListEmptyComponent={EmptyComponent}
          
    />

     
  );
};

const customStyles = (colors:IAppColors)=>StyleSheet.create({
  list: {
    flex: 1,
    },
    emptyContainer: { flex: 1, height: '100%', alignItems: 'center', justifyContent: 'center' },
    emptyText: { color: colors.secondary, ...fonts.subtitle } as TextStyle,
    emptyFlatList: { flexGrow: 1, alignItems: 'center', justifyContent: 'center' },
    flatlist:{padding:10,height:'75%'},
});

export default LoanList;


