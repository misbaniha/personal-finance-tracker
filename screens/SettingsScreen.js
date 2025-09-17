import React, {useEffect, useState} from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, FlatList } from 'react-native';
import { getCategories, addCategory, clearAll } from '../storage/storage';

export default function SettingsScreen() {
  const [categories, setCategories] = useState([]);

  useEffect(()=>{ load(); },[]);

  async function load() {
    const cats = await getCategories();
    setCategories(cats);
  }

  async function handleClear() {
    Alert.alert('Confirm','Clear all data? This cannot be undone.',[
      {text:'Cancel'},
      {text:'Clear', style:'destructive', onPress: async ()=>{
        await clearAll();
        load();
        Alert.alert('Done','Data cleared');
      }}
    ]);
  }

  return (
    <View style={{flex:1, paddingTop:30, backgroundColor:'#f7f9fb'}}>
      <Text style={styles.title}>Settings & Categories</Text>
      <View style={{padding:12}}>
        <Text style={{fontWeight:'700'}}>Categories</Text>
        <FlatList data={categories} keyExtractor={c=>c} renderItem={({item})=> <Text style={{padding:8,backgroundColor:'#fff',marginVertical:6,borderRadius:8}}>{item}</Text>} />
        <TouchableOpacity style={styles.clearBtn} onPress={handleClear}><Text style={{color:'#fff'}}>Clear All Data</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title:{fontSize:20,fontWeight:'700',textAlign:'center',marginBottom:10},
  clearBtn:{backgroundColor:'#ff3b30',padding:12,borderRadius:8,alignItems:'center',marginTop:12}
});
