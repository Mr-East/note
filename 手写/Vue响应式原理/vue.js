class Vue{
    constructor(obj_instance){
        this.$data = obj_instance.$data
        Observer(this.$data)
    }
}

function Observer(data_instance){
    // 递归出口 如果子属性不是对象退出
    if(!data_instance || typeof data_instance !== 'object') return
    Object.keys(data_instance).forEach(key =>{
        //键对应的值
        const value = data_instance[key]
        // 递归子属性劫持
        Observer(value)
        Object.defineProperties(data_instance,key,{
            enumerable:true,
            configurable:true,
            get(){
                console.log(`访问了属性 ${key}的值 ->${value}`)
                return value
            },
            set(newValue){
                console.log(`属性${key}的值${value}发生了改变${newValue}`);
                value = newValue
                Observer(newValue)
            }
        })
    })
}