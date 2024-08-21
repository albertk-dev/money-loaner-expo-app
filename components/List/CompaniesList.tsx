import { Image, Text, TouchableOpacity, View, FlatList } from 'react-native'
import React from 'react'
import { ICompany } from 'money-loaner-api-types';
import CompaniesListStyles from './companiesListStyle';
import { useAppThemeColor } from '@/hooks/useThemeColor';




type ListProps = {
    companies: Array<ICompany>;
    handleSelectCompany: (company: ICompany) => void;
    query?: string;
}


type ItemProps = {
    company: ICompany;
    onSelect: (company: ICompany) => void;
    highLighValue?: string;
}

export const highlightText = (text: string, query: string) => {
  const colors = useAppThemeColor()

    if (!query) {
      return <Text style={{ color: colors.text }}>{text}</Text>;
    }
  
    const lowerCaseQuery = query.toLowerCase();
    const lowerCaseText = text.toLowerCase();
  
    const highlightedText = text.split('').map((char, index) => {
      if (lowerCaseQuery.includes(char.toLowerCase())) {
        return (
          <Text key={index} style={{ color: colors.primary, fontWeight: 'bold'}}>
            {char}
          </Text>
        );
      }
      return (
        <Text key={index} style={{ color: colors.black }}>
          {char}
        </Text>
      );
    });
  
    return <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>{highlightedText}</View>;
  };

const CompaniesListItem:React.FC<ItemProps> = ({company,onSelect, highLighValue=""}) => {
  const colors = useAppThemeColor()
  const styles = CompaniesListStyles(colors)
    return (
        <TouchableOpacity onPress={()=> onSelect(company)}>
            <View style={styles.itemContainer} >
                {highlightText(company.name, highLighValue)}
                <Image  source={{uri: company.logoURL}} width={32} height={32}/>
            </View>
        </TouchableOpacity>
        
    )
    
}

const EmptyComponent:React.FC = ()=>{
  const colors = useAppThemeColor()
  const styles = CompaniesListStyles(colors)
    return (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucune Entreprise Trouvé</Text>
        </View>
    )
}

const CompaniesList: React.FC<ListProps> = ({ companies, handleSelectCompany, query=""}) => {
  const colors = useAppThemeColor()
  const styles = CompaniesListStyles(colors)
  return (
      <FlatList
       
          data={companies}
          renderItem={({ item }) => <CompaniesListItem company={item} onSelect={() => handleSelectCompany(item)} highLighValue={query} />}
          keyExtractor={(item) => item._id}
          ListEmptyComponent={EmptyComponent}
          contentContainerStyle={!companies || companies?.length === 0 ? styles.emptyFlatList:styles.flatlist}
      />
          

  )
}

export default CompaniesList
