import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useAppThemeColor } from '@/hooks/useThemeColor';
import { IAppColors } from '@/constants/Colors';

 type DropdownMenuItem = {
  label: string;
  onPress: () => void;
};

interface DropdownMenuProps {
  items: DropdownMenuItem[];
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ items }) => {

  const colors = useAppThemeColor();
  const styles = customStyles(colors)

  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(items[0].label);

  const toggleMenu = () => {
    setVisible(!visible);
  };

  const selectItem = (item: DropdownMenuItem) => {
    setSelectedItem(item.label);
    setVisible(false);
    item.onPress(); // Call the onPress function passed in the item
  };

  return (
    <View style={styles.container}>

      <TextInput editable={false} value={selectedItem} style={{height:'100%', paddingVertical:0, minWidth:100}} />
      <TouchableOpacity onPress={toggleMenu} style={styles.button}>
        <Text style={styles.buttonText}>▼</Text>
      </TouchableOpacity>

      {visible && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={visible}
          onRequestClose={toggleMenu}
        >
          <TouchableOpacity style={styles.modalOverlay} onPress={toggleMenu}>
            <View style={styles.menu}>
              {items.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => selectItem(item)}
                  style={styles.menuItem}
                >
                  <Text style={styles.menuItemText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};

const customStyles = (colors:IAppColors)=> StyleSheet.create({
  container: {
  
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    height: 32,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  button: {
    height: '100%',
    padding:5,
    backgroundColor: colors.primary,
   
  },
  buttonText: {
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menu: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    elevation: 5,
  },
  menuItem: {
    padding: 10,
  },
  menuItemText: {
    fontSize: 16,
  },
});

export default DropdownMenu;
