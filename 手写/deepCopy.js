function deepCopy(source, storage = new WeakMap()) {
    // 基本数据类型
    if (typeof source !== 'object' || source === null) {
        return source
    }

    if (source.constructor === Date) {
        return new Date(source)
    }

    if (source.constructor === RegExp) {
        return new RegExp(source)

    }


    let res = Array.isArray(source) ? [] : {}

    // 循环引用 返回存储的引用数据
    if (storage.has(source)) return storage.get(source)
    // 开辟存储空间设置临时存储值
    storage.set(source, res)

    let isSymbol = Object.hasOwnPropertySymbols(source)
    // 如果有Symbol值
    if (isSymbol.length) {
        isSymbol.forEach(item => {
            if (typeof source[item] === 'object') {
                res[item] = deepCopy(source[item], storage)
            } else {
                res[item] = source[item]
            }
        });
    }

    for(let key in source){
        if(source.hasOwnProperty(key)){
            res[key] = typeof source[key] === 'object' ? deepCopy(source[key],storage):source[key]
        }
    }

}