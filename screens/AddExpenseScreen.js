import React, {useEffect, useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { getCategories, saveExpense, addCategory } from '../storage/storage';
import { v4 as uuidv4 } from 'uuid';
import { Picker } from '@react-native-picker/picker';

export default function AddExpenseScreen({ navigation }) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(()=>{ load(); },[]);

  async function load() {
    const cats = await getCategories();
    setCategories(cats);
    if (cats.length>0 && !category) setCategory(cats[0]);
  }

  async function submit() {
    if (!amount || isNaN(Number(amount))) {
      Alert.alert('Validation','Please enter a valid amount');
      return;
    }
    const expense = { id: uuidv4(), amount: Number(amount), category, note, date: new Date().toISOString() };
    await saveExpense(expense);
    setAmount(''); setNote('');
    Alert.alert('Saved','Expense saved');
    // navigate back to Home (tab)
    navigation.navigate('Home');
  }

  async function addNewCategory() {
    Alert.prompt ? Alert.prompt('New category','Category name', async (text) => {
      if (text) {
        await addCategory(text);
        const cats = await getCategories();
        setCategories(cats);
        setCategory(text);
      }
    }) : (()=>{ /* fallback for platforms without Alert.prompt */ })();
  }

  return (
    <View style={{flex:1, paddingTop:30, backgroundColor:'#f7f9fb'}}>
      <Text style={styles.title}>Add Expense</Text>
      <View style={{padding:12}}>
        <Text>Amount</Text>
        <TextInput keyboardType="numeric" value={amount} onChangeText={setAmount} style={styles.input}/>
        <Text style={{marginTop:8}}>Category</Text>
        {Platform.OS === 'web' ? (
          <select value={category} onChange={(e)=>setCategory(e.target.value)} style={styles.input}>
            {categories.map(c=> <option key={c} value={c}>{c}</option>)}
          </select>
        ) : (
          <Picker selectedValue={category} onValueChange={(v)=>setCategory(v)}>
            {categories.map(c=> <Picker.Item key={c} label={c} value={c} />)}
          </Picker>
        )}
        <TouchableOpacity onPress={addNewCategory}><Text style={{color:'#0077ff',marginTop:6}}>+ Add category</Text></TouchableOpacity>

        <Text style={{marginTop:8}}>Note (optional)</Text>
        <TextInput value={note} onChangeText={setNote} style={styles.input}/>

        <TouchableOpacity style={styles.saveBtn} onPress={submit}><Text style={{color:'#fff'}}>Save Expense</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title:{fontSize:20,fontWeight:'700',textAlign:'center',marginBottom:10},
  input:{backgroundColor:'#fff',padding:10,borderRadius:8,marginTop:6},
  saveBtn:{backgroundColor:'#0077ff',padding:12,borderRadius:8,alignItems:'center',marginTop:12}
});
