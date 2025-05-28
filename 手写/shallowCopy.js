function shallowCopy(source){
    if(typeof source === 'object' && source !== null){
        let target = Array.isArray(source) ? []:{}
        for ( let prop in source){
            if(source.hasOwnProperty(prop)){
                target[prop] = source[prop]
            }
        }
        return target
    } else{
        return source
    }
}