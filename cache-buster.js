// Casino CMS Cache Buster
// Paste this entire script into your browser's DevTools Console (F12) and press Enter

(function() {
    console.log('%c🎰 Casino CMS Cache Buster v2.1.0', 'background: #667eea; color: white; padding: 10px; font-size: 16px; font-weight: bold;');
    
    // Clear various storage
    try {
        localStorage.clear();
        console.log('✅ LocalStorage cleared');
    } catch (e) {
        console.error('❌ Failed to clear localStorage:', e);
    }
    
    try {
        sessionStorage.clear();
        console.log('✅ SessionStorage cleared');
    } catch (e) {
        console.error('❌ Failed to clear sessionStorage:', e);
    }
    
    // Clear IndexedDB
    if (window.indexedDB) {
        indexedDB.databases().then(dbs => {
            dbs.forEach(db => {
                if (db.name) {
                    indexedDB.deleteDatabase(db.name);
                    console.log('✅ Deleted IndexedDB:', db.name);
                }
            });
        });
    }
    
    // Unregister service workers
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
            registrations.forEach(registration => {
                registration.unregister();
                console.log('✅ Unregistered service worker');
            });
        });
    }
    
    // Clear cache storage
    if ('caches' in window) {
        caches.keys().then(names => {
            names.forEach(name => {
                caches.delete(name);
                console.log('✅ Deleted cache:', name);
            });
        });
    }
    
    console.log('%c⏳ Reloading page in 2 seconds...', 'background: #f59e0b; color: white; padding: 5px; font-size: 14px;');
    
    setTimeout(() => {
        console.log('%c🔄 Performing hard reload...', 'background: #22c55e; color: white; padding: 5px; font-size: 14px;');
        location.reload(true);
    }, 2000);
})();
