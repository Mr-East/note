const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECT = 'reject'
class MyPromise {
    #state = PENDING
    #result = undefined
    #handlers = []
    constructor(executor) {
        this.#result = undefined
        this.#state = PENDING
        this.#handlers = []
        try {
            executor(this.resolve.bind(this), this.reject.bind(this))
        } catch (error) {
            this.reject(error)
        }
    }



    //改变状态时触发的回调函数
    #changeState(state, result) {
        if (this.#state !== PENDING) return;
        this.#state = state
        this.#result = result
        this.#run()
    }
    //run方法中执行逻辑封装
    #runOne(callback, resolve, reject) {

        const settled = this.#result === FULFILLED ? resolve : reject;
        // 微队列处理
        this.#runMicronTask(() => {
            // 传进来的callback不是函数
            if (typeof callback !== 'function') {
                settled(callback)
                return
            } else {
                //是函数
                try {
                    const data = callback(this.#result)
                    //返回的对象是Promise
                    if (this.#isPromiseLike(data)) {
                        data.then(resolve, reject)
                    } else {
                        resolve(data)
                    }
                } catch (error) {
                    reject(error)
                }
            }
        })

    }
    // 执行函数
    #run() {
        if (this.#state === PENDING) return
        while (this.#handlers.length) {
            const { resolve, reject, onFulFilled, onReject } = this.#handlers.shift()
            if (this.#state === FULFILLED) {
                this.#runOne(onFulFilled, resolve, reject)
            } else {
                this.#runOne(onReject, resolve, reject)
            }

        }
    }

    resolve(data) {
        this.#changeState(FULFILLED, data)
    }
    reject(reason) {
        this.#changeState(REJECT, reason)
    }

    //then方法
    then(onFulFilled, onReject) {
        return new MyPromise((resolve, reject) => {
            this.#handlers.push({
                resolve,
                reject,
                onReject,
                onFulFilled,
            })
            this.#run()
        })

    }
    
    // PromiseLike判断函数
    #isPromiseLike(value) {
        //值不为空，为带有then方法的对象或者函数，则认定为Promise
        if (value !== null && (typeof value === 'object' || typeof value === 'function')) {
            return typeof value.then === 'function'
        } else {
            return false
        }

    }

    // 执行微队列任务
    #runMicronTask(func) {
        // Node环境实现微队列
        if (typeof process === 'object' && typeof process.nextTick === 'function') {
            process.nextTick(func)
        }
        // 浏览器环境实现微队列
        else if (typeof MutationObserver === 'function') {
            const ob = new MutationObserver(func)
            const textNode = document.createTextNode('1');
            ob.observe(textNode, {
                characterData: true
            });
            textNode.data = '2'
        } else {
            setTimeout(func, 0)
        }
    }
}

const p = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve(123)
    }, 1000)
})

p.then((res) => {
    console.log(res), (err) => {
        console.log(err);

    };
})