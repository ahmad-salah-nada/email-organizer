"use client"

/**
 * Utility to clear all possible browser caches and storage
 * Useful for debugging authentication issues
 */
export const clearAllBrowserCache = async () => {
  try {
    // Clear localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.clear()
    }
    
    // Clear sessionStorage
    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.clear()
    }
    
    // Clear IndexedDB
    if (typeof window !== 'undefined' && window.indexedDB) {
      try {
        const databases = await window.indexedDB.databases()
        await Promise.all(
          databases.map(db => {
            if (db.name) {
              const deleteReq = window.indexedDB.deleteDatabase(db.name)
              return new Promise((resolve) => {
                deleteReq.onsuccess = () => resolve(undefined)
                deleteReq.onerror = () => resolve(undefined)
              })
            }
          })
        )
      } catch (e) {
        console.warn('Could not clear IndexedDB:', e)
      }
    }
    
    // Clear service worker caches
    if (typeof window !== 'undefined' && 'caches' in window) {
      try {
        const cacheNames = await window.caches.keys()
        await Promise.all(
          cacheNames.map(cacheName => window.caches.delete(cacheName))
        )
      } catch (e) {
        console.warn('Could not clear cache storage:', e)
      }
    }
    
    console.log('Browser cache cleared successfully')
  } catch (error) {
    console.warn('Could not fully clear browser cache:', error)
  }
}

/**
 * Force reload the page with cache bypass
 */
export const hardReload = () => {
  if (typeof window !== 'undefined') {
    window.location.reload()
  }
}
