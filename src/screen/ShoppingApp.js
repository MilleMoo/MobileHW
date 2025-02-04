import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Alert, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';

const ShoppingApp = () => {
const [items, setItems] = useState([]);
const [itemName, setItemName] = useState('');
const [itemPrice, setItemPrice] = useState('');
const [searchQuery, setSearchQuery] = useState('');
const [darkMode, setDarkMode] = useState(false);

useEffect(() => {
    loadItems();
}, []);

useEffect(() => {
    saveItems();
}, [items]);

const loadItems = async () => {
    try {
    const storedItems = await AsyncStorage.getItem('shoppingItems');
    if (storedItems) setItems(JSON.parse(storedItems));
    } catch (error) {
    console.error('Failed to load items', error);
    }
};

const saveItems = async () => {
    try {
    await AsyncStorage.setItem('shoppingItems', JSON.stringify(items));
    } catch (error) {
    console.error('Failed to save items', error);
    }
};

const addItem = () => {
    if (!itemName.trim()) {
    Alert.alert('ข้อผิดพลาด', 'กรุณากรอกชื่อสินค้า');
    return;
    }
    if (!itemPrice.trim() || isNaN(itemPrice) || parseFloat(itemPrice) <= 0) {
    Alert.alert('ข้อผิดพลาด', 'ราคาต้องเป็นตัวเลขบวก');
    return;
    }
    const newItem = { id: Date.now().toString(), name: itemName, price: parseFloat(itemPrice), purchased: false };
    setItems([...items, newItem]);
    setItemName('');
    setItemPrice('');
};

const togglePurchased = (id) => {
    setItems(items.map(item => item.id === id ? { ...item, purchased: !item.purchased } : item));
};

const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
};

const clearAll = () => {
    setItems([]);
};

const totalRemaining = items.reduce((sum, item) => (!item.purchased ? sum + item.price : sum), 0);

const filteredItems = items.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

const toggleDarkMode = () => {
    setDarkMode(!darkMode);
};

return (
    <View style={[styles.container, darkMode && styles.darkContainer]}>
    <TouchableOpacity style={styles.toggleButton} onPress={toggleDarkMode}>
        <MaterialIcons name={darkMode ? 'dark-mode' : 'light-mode'} size={24} color={darkMode ? 'white' : 'black'} />
    </TouchableOpacity>
    <TextInput placeholder="ค้นหา" value={searchQuery} onChangeText={setSearchQuery} style={styles.input} />
    <TextInput placeholder="ชื่อสินค้า" value={itemName} onChangeText={setItemName} style={styles.input} />
    <TextInput placeholder="ราคาสินค้า" value={itemPrice} onChangeText={setItemPrice} keyboardType="numeric" style={styles.input} />
    <Button title="เพิ่มสินค้า" onPress={addItem} />
    <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
        <TouchableOpacity onPress={() => togglePurchased(item.id)} style={[styles.item, item.purchased && styles.purchased]}>
            <Text style={[styles.itemText,{color: darkMode ? 'white' : 'black'}]}>{item.name} - {item.price} บาท</Text>
            <Button title="ลบ" onPress={() => removeItem(item.id)} />
        </TouchableOpacity>
        )}
    />
    <Text style={[styles.total, {color: darkMode ? 'white' : 'black'}]}>รวมราคาสินค้ายังไม่ได้ซื้อ: {totalRemaining} บาท</Text>
    <Button title="ลบทั้งหมด" onPress={clearAll} color="red" />
    </View>
);
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 20 
    },
    darkContainer: { 
        backgroundColor: 'grey', 
        color: '#fff' 
    },
    title: { fontSize: 24, 
        fontWeight: 'bold', 
        marginBottom: 10 
    },
    input: { 
        borderWidth: 1, 
        padding: 8, 
        marginBottom: 10, 
        backgroundColor: 'white' 
    },
    item: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        padding: 10, 
        borderBottomWidth: 1 },
    purchased: { 
        backgroundColor: '#ddd' 
    },
    total: { 
        fontSize: 18, 
        marginTop: 10 
    },
    toggleButton: { 
        alignSelf: 'flex-end', 
        padding: 10 
    }
});

export default ShoppingApp;
