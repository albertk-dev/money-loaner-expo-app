import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export type MoreMenuItem<T> = {
  text: string;
  onClick: (data: T) => void;
  available?: boolean;
};

type MoreMenuProps<T> = {
  items: MoreMenuItem<T>[];
  onClose: () => void;
  data: T; // Ajouter un champ data pour passer les paramètres personnalisés
};

const MoreMenu = <T,>({ items, onClose, data, }: MoreMenuProps<T>) => {
  return (
    <View style={styles.menu}>
      {items.map((item, index) => (
          <TouchableOpacity key={index} disabled={!item.available} onPress={() => {
              item.onClick(data)
              onClose()
        }}>
          <View style={styles.menuItem}>
  <Text >{item.text}</Text>
          {!item.available && <Text style={{fontSize:5, fontStyle:'italic'}}>Non Disponible</Text>}
          </View>
        
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    zIndex: 1,
  },
  menuItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

export default MoreMenu;
