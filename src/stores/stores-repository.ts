/**
 * Хранилище сторов, для разрыва зависимостей es6 модулей
 * @type {Map<string, any>}
 */
const storesRepository: Map<string, any> = new Map<string, any>()

export const ALL_STORES: string[] = []

export const getStore = <T>(store: string): T => {
    if (!storesRepository.has(store)) {
        throw new Error(`No store in repository with name: ${store}, check initialization pipeline`)
    }
    return storesRepository.get(store)
}

export const putStore = <T>(store: string, instance: T): T => {
    if (storesRepository.has(store)) {
        // Сейчас архитектура не предусматривает замену  стора на лету
        throw new Error(`Duplicate creation for store: ${store}`)
    }
    storesRepository.set(store, instance)
    return instance
}

/**
 * Хелпер декоратор, который заполняет список ALL_STORES
 */
export function store(StoreClassRef: { storeName: string } & any) {
    ALL_STORES.push(StoreClassRef.storeName)
    return StoreClassRef
}
