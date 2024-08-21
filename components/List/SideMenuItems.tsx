import {  StyleSheet, Text, TouchableOpacity, View, FlatList, TextStyle, ViewStyle } from 'react-native'
import React from 'react'

import CompaniesListStyles from './companiesListStyle';
import { SvgProps } from 'react-native-svg';
import fonts from '../../constants/fonts';
import { useAppThemeColor } from '@/hooks/useThemeColor';



export type MenuItemsProps = {
    id: number;
    startIcon: React.FC<SvgProps>;
    text: string;
    handleClic: () => void;
    startIconProps?: SvgProps;
}

export type MenuProps = {
    items: MenuItemsProps[];
}




const MenuItem:React.FC<MenuItemsProps> = ({startIcon:Start, text, handleClic,startIconProps}) => {
    const colors = useAppThemeColor()
 
    return (
        <TouchableOpacity onPress={handleClic}>
            <View style={{ justifyContent: "flex-start", flexDirection: 'row', gap: 10, padding:10, alignItems:'flex-end'} as ViewStyle} >
                <Start width={32} height={32}  {...startIconProps} />
                <Text style={{...fonts.bodyHighLight, fontSize:16, textTransform:'capitalize', color:colors.black} as TextStyle} >{text}</Text>
            </View>
        </TouchableOpacity>
        
    )
    
}

const EmptyComponent:React.FC = ()=>{
    const colors = useAppThemeColor()
    const styles = CompaniesListStyles(colors)
    return (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Menu vide </Text>
        </View>
    )
}

const SideMenuItems: React.FC<MenuProps> = ({items}) => {
    const colors = useAppThemeColor()
    const styles = CompaniesListStyles(colors)
  return (
      <FlatList
          scrollEnabled={false}
          data={items}
          renderItem={({ item }) => <MenuItem startIcon={item.startIcon} text={item.text} handleClic={()=>item.handleClic()} id={item.id} startIconProps={item.startIconProps} />}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={EmptyComponent}
          contentContainerStyle={!items || items?.length === 0 ? styles.emptyFlatList:styles.flatlist}
      />
          

  )
}

export default SideMenuItems
