import React, {useEffect, useState} from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Picker, Platform } from 'react-native';
import { getExpenses, getCategories } from '../storage/storage';
import ExpenseItem from '../components/ExpenseItem';
import { formatDateISO, isToday, startOfWeek, startOfMonth } from '../utils/date';

export default function HomeScreen() {
  const [expenses, setExpenses] = useState([]);
  const [grouped, setGrouped] = useState({});
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('latest');

  useEffect(()=> {
    const unsub = navigationRefresh();
    return () => unsub && unsub();
  }, []);

  async function navigationRefresh() {
    await load();
    return null;
  }

  async function load() {
    const ex = await getExpenses();
    setExpenses(ex || []);
    const cats = await getCategories();
    setCategories(cats);
  }

  useEffect(()=> {
    filterAndGroup();
  }, [expenses, search, filter, sort]);

  function filterAndGroup() {
    let list = [...expenses];
    if (filter !== 'All') list = list.filter(i=>i.category === filter);
    if (search) list = list.filter(i=> (i.note || '').toLowerCase().includes(search.toLowerCase()));
    if (sort === 'latest') list.sort((a,b)=> new Date(b.date)-new Date(a.date));
    if (sort === 'highest') list.sort((a,b)=> b.amount - a.amount);

    // group by ISO date
    const g = {};
    list.forEach(it=> {
      const day = formatDateISO(it.date);
      if (!g[day]) g[day] = [];
      g[day].push(it);
    });
    setGrouped(g);
  }

  function totals() {
    const now = Date.now();
    const weekStart = startOfWeek();
    const monthStart = startOfMonth();
    let today=0, week=0, month=0;
    expenses.forEach(e=>{
      const t = new Date(e.date).getTime();
      if (isToday(t)) today += Number(e.amount);
      if (t >= weekStart.getTime()) week += Number(e.amount);
      if (t >= monthStart.getTime()) month += Number(e.amount);
    });
    return {today, week, month};
  }

  const t = totals();

  return (
    <View style={{flex:1, paddingTop:30, backgroundColor:'#f2f4f8'}}>
      <Text style={styles.header}>Personal Finance Tracker</Text>
      <View style={styles.summary}>
        <View style={styles.card}><Text style={styles.cardTitle}>Today</Text><Text>₹{t.today.toFixed(2)}</Text></View>
        <View style={styles.card}><Text style={styles.cardTitle}>This Week</Text><Text>₹{t.week.toFixed(2)}</Text></View>
        <View style={styles.card}><Text style={styles.cardTitle}>This Month</Text><Text>₹{t.month.toFixed(2)}</Text></View>
      </View>

      <View style={{flexDirection:'row',padding:10,alignItems:'center'}}>
        <TextInput placeholder="Search by note..." value={search} onChangeText={setSearch} style={styles.search}/>
        <View style={{width:10}}/>
        <View style={styles.pickerWrap}>
          {Platform.OS === 'web' ? (
            <select value={filter} onChange={(e)=>setFilter(e.target.value)}>
              <option>All</option>
              {categories.map(c=><option key={c}>{c}</option>)}
            </select>
          ) : (
            <Picker selectedValue={filter} onValueChange={(v)=>setFilter(v)}>
              <Picker.Item label="All" value="All" />
              {categories.map(c=> <Picker.Item label={c} value={c} key={c} />)}
            </Picker>
          )}
        </View>
      </View>

      <View style={{flexDirection:'row',paddingHorizontal:12}}>
        <TouchableOpacity style={styles.sortBtn} onPress={()=>setSort('latest')}><Text>Latest</Text></TouchableOpacity>
        <TouchableOpacity style={styles.sortBtn} onPress={()=>setSort('highest')}><Text>Highest</Text></TouchableOpacity>
      </View>

      <FlatList
        data={Object.keys(grouped)}
        keyExtractor={(k)=>k}
        renderItem={({item})=> (
          <View>
            <Text style={styles.groupHeader}>{item}</Text>
            {grouped[item].map(it=> <ExpenseItem item={it} key={it.id} />)}
          </View>
        )}
        ListEmptyComponent={<Text style={{textAlign:'center',marginTop:40,color:'#666'}}>No expenses yet</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header:{fontSize:20,fontWeight:'700',textAlign:'center',marginBottom:10},
  summary:{flexDirection:'row',justifyContent:'space-around',paddingHorizontal:8},
  card:{backgroundColor:'#fff',padding:12,borderRadius:8,alignItems:'center',width:'30%'},
  cardTitle:{fontSize:12,color:'#555'},
  search:{flex:1,backgroundColor:'#fff',padding:8,borderRadius:8},
  pickerWrap:{width:120,backgroundColor:'#fff',borderRadius:8},
  sortBtn:{padding:8,backgroundColor:'#fff',borderRadius:8,marginRight:8,marginTop:12},
  groupHeader:{paddingHorizontal:12,paddingTop:18,fontWeight:'700'}
});
