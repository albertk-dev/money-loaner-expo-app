import { StyleSheet, TextStyle } from "react-native"
import  { IAppColors } from "../../constants/Colors"
import fonts from "../../constants/fonts"


const CompaniesListStyles = (colors:IAppColors) => StyleSheet.create({
    itemContainer: {
        width: '100%',
        height: 'auto',
        display: 'flex',
        flexDirection:'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.primary

    },
    itemImage: {
        width: 32,
        height: 32,
        borderRadius:4
    },
    itemText: {
        color: colors.black,
        ...fonts.bodyHighLight,
    } as  TextStyle,
    emptyContainer: { flex: 1, height: '100%', alignItems: 'center', justifyContent: 'center' },
    emptyText: { color: colors.secondary, ...fonts.subtitle } as TextStyle,
    emptyFlatList: { flexGrow: 1, alignItems: 'center', justifyContent: 'center' },
    flatlist:{padding:10},
    
})


export default CompaniesListStyles