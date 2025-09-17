import AsyncStorage from '@react-native-async-storage/async-storage';

export const EXPENSES_KEY = '@pft_expenses_v1';
export const CATEGORIES_KEY = '@pft_categories_v1';

export async function initializeStorage() {
  try {
    const cats = await AsyncStorage.getItem(CATEGORIES_KEY);
    if (cats === null) {
      const defaultCats = ['Food','Transport','Shopping','Bills','Other'];
      await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(defaultCats));
    }
  } catch (e) {
    console.warn('storage init failed', e);
  }
}

export async function getCategories() {
  const s = await AsyncStorage.getItem(CATEGORIES_KEY);
  return s ? JSON.parse(s) : [];
}

export async function addCategory(cat) {
  const cur = await getCategories();
  cur.push(cat);
  await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(cur));
  return cur;
}

export async function saveExpense(expense) {
  const s = await AsyncStorage.getItem(EXPENSES_KEY);
  const arr = s ? JSON.parse(s) : [];
  arr.push(expense);
  await AsyncStorage.setItem(EXPENSES_KEY, JSON.stringify(arr));
  return arr;
}

export async function getExpenses() {
  const s = await AsyncStorage.getItem(EXPENSES_KEY);
  return s ? JSON.parse(s) : [];
}

export async function clearAll() {
  await AsyncStorage.removeItem(EXPENSES_KEY);
  await AsyncStorage.removeItem(CATEGORIES_KEY);
  await initializeStorage();
}
