// Debug utility to check auth state in localStorage
export const debugAuthState = () => {
  console.group('🔍 Auth Debug Info');
  
  // Check localStorage
  const persistKey = 'persist:aura_persist_root';
  const rawPersistedState = localStorage.getItem(persistKey);
  
  console.log('localStorage key:', persistKey);
  console.log('Raw persisted state:', rawPersistedState);
  
  if (rawPersistedState) {
    try {
      const parsed = JSON.parse(rawPersistedState);
      console.log('Parsed persisted state:', parsed);
      
      if (parsed.auth) {
        const authState = JSON.parse(parsed.auth);
        console.log('Auth state from localStorage:', authState);
        console.log('Has tokens:', !!authState.tokens);
        console.log('Has accessToken:', !!authState.tokens?.accessToken);
        console.log('Is authenticated:', authState.isAuthenticated);
      }
    } catch (e) {
      console.error('Failed to parse persisted state:', e);
    }
  } else {
    console.warn('No persisted state found in localStorage');
  }
  
  console.groupEnd();
};

// Call this in the browser console: window.debugAuth()
if (typeof window !== 'undefined') {
  (window as any).debugAuth = debugAuthState;
}

