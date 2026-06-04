const DB_NAME = 'ntdfilm-media-db'
const DB_VERSION = 1
const STORE_NAME = 'images'

const openDatabase = () => new Promise((resolve, reject) => {
  const request = window.indexedDB.open(DB_NAME, DB_VERSION)

  request.onupgradeneeded = () => {
    const db = request.result
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME)
    }
  }

  request.onsuccess = () => resolve(request.result)
  request.onerror = () => reject(request.error)
})

const runTransaction = async (mode, handler) => {
  const db = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, mode)
    const store = transaction.objectStore(STORE_NAME)
    const request = handler(store)

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
    transaction.oncomplete = () => db.close()
    transaction.onerror = () => reject(transaction.error)
  })
}

export const isIndexedDbImageRef = (value) => typeof value === 'string' && value.startsWith('idb-image://')

export const saveImageToIndexedDb = async (dataUrl) => {
  const imageId = `idb-image://${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  await runTransaction('readwrite', (store) => store.put(dataUrl, imageId))
  return imageId
}

export const getImageFromIndexedDb = async (imageId) => {
  try {
    return await runTransaction('readonly', (store) => store.get(imageId))
  } catch {
    return null
  }
}
