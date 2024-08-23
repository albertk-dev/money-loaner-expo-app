import { StyleSheet, Text, View, TouchableOpacity, TextStyle, Modal, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react'
import  { IAppColors } from '../../constants/Colors'
import APP_IMAGES from '../../constants/images'
import fonts from '../../constants/fonts';
import Buttons from '../Buttons';
import Color from 'color';
import { useAppThemeColor } from '@/hooks/useThemeColor';

type Props = {
    step: number;
    initialValue: number;
    onChange?: (value: number) => void;
    disabled: boolean;
    disabledMsg?: string;
    max: number;
    min: number;
    onAskForLoan: (value: number) => void;
}

const defaultDisabledMsg = "Désolé,\nvous ne pouvez pas effectuer, de pret pour le moment. revenez quand tous les prets seront remboursés par l’entreprise"

const LoanSection: React.FC<Props> = ({ step, initialValue, disabled, disabledMsg=defaultDisabledMsg, max,min, onAskForLoan }) => {
    const colors = useAppThemeColor();
    const styles = customStyles(colors)
    
    const [value, setValue] = useState(initialValue)
    const [showDisabledMsg, setShowDisabledMsg] = useState(false)
 
    
    const handleChangeValue = (newValue: number) => {
        setValue(newValue)
    }
    useEffect(() => {
        if (disabled) {
            setShowDisabledMsg(true);
            setTimeout(() => {
                setShowDisabledMsg(false)
            },5000)
        }
        
    },[disabled])

    return (
      
        <TouchableOpacity style={{ position: 'relative'}} disabled={!disabled} onPress={() => {
            setShowDisabledMsg(true);
            setTimeout(() => {
                setShowDisabledMsg(false)
            },3000)
        }}>
            <View style={{ ...styles.container, padding:10}}>
          <Text style={{...fonts.bodyHighLight} as TextStyle}>Demander un pret</Text>
          <View style={styles.valueController}>
              <TouchableOpacity disabled={value - step < min || disabled} onPress={()=>handleChangeValue(value-step)}>
                  <APP_IMAGES.ICON_SUBSTRACTION width={32} height={32} fill={colors.primary} fillOpacity={value - step < min || disabled ? 0.5 :1} />
              </TouchableOpacity>
              <Text style={styles.value} >{disabled? "---------":value}</Text>
              <TouchableOpacity disabled={value + step > max || disabled}  onPress={()=>handleChangeValue(value+step)}>
                  <APP_IMAGES.ICON_ADDITION width={32} height={32} fill={colors.primary} fillOpacity={value + step > max || disabled ? 0.5 :1}/>
              </TouchableOpacity>  
          </View>
                <Buttons.Primary onPress={() => onAskForLoan(value)} disabled={disabled} title='Lancer la demande' />
                
            </View>
            {disabled && showDisabledMsg &&
                    <View style={styles.disabledMsg}>
                        <View style={{ backgroundColor: 'transparent', height: 100, width:55}}>
                              <APP_IMAGES.ICON_ALERT height={100} width={80} fill={colors.white}/>
                        </View>
                        <Text style={{ flex:1,color:colors.white,}} >{disabledMsg}</Text>

                    </View>}
            
        
    </TouchableOpacity>
   
  )
}

export default LoanSection

const customStyles = (colors:IAppColors)=> StyleSheet.create({
    container: {
        height: 230,
        borderColor: colors.primary,
        borderWidth: 1,
       // borderRadius: 10,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
       
    },
    value: {
        ...fonts.title as TextStyle,
        fontSize:50,
        color:colors.primary,
    },
    disabledMsg: {
        height: 230,
        position: 'absolute',
      
        backgroundColor: Color('red').darken(0.2).alpha(0.8).toString(),
        flexDirection: 'row',
       gap:10,
        
        width: '100%',
        alignItems: 'center',
        justifyContent:'space-between',
    },
    valueController: {
        flexDirection: 'row',
        width: "100%",
        justifyContent: 'space-between',
        alignItems:'center',
    }
})

