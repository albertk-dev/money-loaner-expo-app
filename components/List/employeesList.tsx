import React, {  useState } from 'react';
import { View, FlatList, StyleSheet, TextStyle, Text} from 'react-native';
import EmployeeItem from './employeeItem';
import { IEmployee } from 'money-loaner-api-types';
import { MoreMenuItem } from './MoreMenu';
import { IAppColors } from '../../constants/Colors';
import fonts from '../../constants/fonts';
import { useAppThemeColor } from '@/hooks/useThemeColor';

type EmployeeListProps = {
    data: IEmployee[];
    searchQuery: string;
    order?: boolean;
    sortBy: 'name' | 'salary' | 'job';
    menuItems: MoreMenuItem<IEmployee>[];
}

const EmptyComponent:React.FC = ()=>{
  const colors = useAppThemeColor()
  const styles = customStyles(colors)
    return (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucun employé Trouvé</Text>
        </View>
    )
}

const EmployeeList: React.FC<EmployeeListProps> = ({
  data,
  searchQuery,
  order = true,
    sortBy,
    menuItems,
  
}) => {

  const colors = useAppThemeColor()
  const styles = customStyles(colors)
  // Fonction de filtrage en fonction de la recherche
  const filteredData = data?.filter((employee) =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fonction de tri en fonction de sortBy et order
  const sortedData = filteredData?.sort((a, b) => {
    let comparison = 0;
    if (a[sortBy] > b[sortBy]) {
      comparison = 1;
    } else if (a[sortBy] < b[sortBy]) {
      comparison = -1;
    }
    return order ? comparison : comparison * -1;
  });
    
  const [selectedEmployees, setSelectedEmployees] = useState<IEmployee[]>([])


  // Fonction pour rendre chaque élément de la liste
  const renderItem = ({ item }: { item: IEmployee }) => (
    <EmployeeItem readyToSelect={selectedEmployees.length !== 0} menuItems={menuItems} employee={item} onSelect={(selected, data) => {
      if (selected) {
        setSelectedEmployees([...selectedEmployees, data])
      } else {
        setSelectedEmployees(selectedEmployees.filter(employee => employee._id !== data._id))

      }
      }} />
  );

    return (
     
                 <FlatList
      contentContainerStyle={!data || data?.length === 0 ? styles.emptyFlatList:styles.list}
      data={sortedData}
      renderItem={renderItem}
      keyExtractor={(item) => item._id}
            ListEmptyComponent={EmptyComponent}
          
    />

     
  );
};

const customStyles = (colors:IAppColors) => StyleSheet.create({
  list: {
    flex: 1,
    },
    emptyContainer: { flex: 1, height: '100%', alignItems: 'center', justifyContent: 'center' },
    emptyText: { color: colors.secondary, ...fonts.subtitle } as TextStyle,
    emptyFlatList: { flexGrow: 1, alignItems: 'center', justifyContent: 'center' },
    flatlist:{padding:10,height:'75%'},
});

export default EmployeeList;


