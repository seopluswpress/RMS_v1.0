// Utility to fetch all bank accounts and map them by user_id and property_id
// Usage: import { fetchBankAccountMap } from './bankAccountMap';

export async function fetchBankAccountMap(token) {
    const url = 'https://hemanth525.pythonanywhere.com/accounts/bank-account/';
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    // The response may be {data: [...]}, or just [...]
    const accounts = Array.isArray(data) ? data : data.data || [];
    // Map: { 'userId_propertyId': accountObj }
    const accountMap = {};
    for (const acc of accounts) {
      const userId = acc.user_id || acc.user?.user_id || acc.user?.id || acc.user || acc.userId;
      const propertyId = acc.property_id || acc.property?.property_id || acc.property?.id || acc.property || acc.propertyId;
      if (userId && propertyId) {
        accountMap[`${userId}_${propertyId}`] = acc;
      }
    }
    return accountMap;
  }
  
  // Utility: get first bank account for a user regardless of property
  export function getFirstBankAccountForUser(bankAccountMap, userId) {
    if (!userId) return null;
    // Find the first account in the map with this userId
    for (const key in bankAccountMap) {
      if (key.startsWith(userId + '_')) {
        return bankAccountMap[key];
      }
    }
    return null;
  }
  