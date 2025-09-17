import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ExpenseItem({item}) {
  const date = new Date(item.date);
  return (
    <View style={styles.row}>
      <View style={{flex:1}}>
        <Text style={styles.cat}>{item.category} • {item.note || '—'}</Text>
        <Text style={styles.date}>{date.toLocaleString()}</Text>
      </View>
      <Text style={styles.amount}>₹{Number(item.amount).toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row:{flexDirection:'row',padding:12,backgroundColor:'#fff',marginVertical:6,marginHorizontal:10,borderRadius:8,alignItems:'center',elevation:1},
  cat:{fontWeight:'600'},
  date:{color:'#666',fontSize:12,marginTop:4},
  amount:{fontWeight:'700'}
});
