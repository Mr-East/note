Function.prototype.myCall = function (context, ...arg) {
    const key = Symbol()
    context[key]= this 
    const res  = context[key](...arg)
    delete context[key]
    return res
}


const food = {
    name:'horizon'

}
function sayFood(id){
    console.log(this.name)
    console.log(id)

}

sayFood.myCall(food,'1111')