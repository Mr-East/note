
class LRUCache {
    #map
    #maxAge
    #capacity

    constructor({ maxAge, capacity }) {
        this.#maxAge = maxAge
        this.#capacity = capacity
        this.#map = new Map()
    }
    get(key) {
        if (!this.#map.has(key)) return undefined
        const item = this.#map.get(key)
        if (Date.now() - item.timestamp > this.#maxAge) {
            this.#map.delete(key)
            return undefined
        }
        this.#map.delete(key)
        this.#map.set(key, { item, timestamp: Date.now() })
        return item.value
    }
    put(key, value) {

        if (this.#map.has(key)) {
            this.#map.delete(key)
        }
        this.#map.set(key, { value, timestamp: Date.now() })

        if (this.#map.size > this.#capacity) {
            this.#map.delete(this.#map.keys().next().value)
        }



    }
}