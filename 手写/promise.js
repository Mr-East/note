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
        const reject = (resulte) => {
            if (this.state === PENDING) {
                this.state = REJECTED
                this.resulte = resulte
                this.#handlers.forEach(({ onRejected }) => {
                    onRejected(this.resulte)
                })
            }

        }
        try {
            func(resolve, reject)
        } catch (error) {
            reject(error)
        }
    }


        const p2 = new myPromise((resolve, reject) => {
            if (this.state === FULFILLED) {
                this.runAsyncTask(() => {
                    try {
                        const x = onFulFilled(this.resulte)
                        resolvePromise(p2, x, resolve, reject)
                    } catch (error) {
                        reject(error)
                    }
                })

            } else if (this.state === REJECTED) {
                this.runAsyncTask(() => {
                    try {
                        const x = onRejected(this.resulte)
                        resolvePromise(p2, x, resolve, reject)
                    } catch (error) {
                        reject(error)
                    }

                }
                )

            } else if (this.state === PENDING) {

                this.#handlers.push({
                    onFulFilled: () => {
                        this.runAsyncTask(() => {
                            try {
                                const x = onFulFilled(this.resulte)
                                resolvePromise(p2, x, resolve, reject)
                            } catch (error) {
                                reject(error)
                            }

                        })
                    },
                    onRejected: () => {
                        this.runAsyncTask(() => {
                            try {
                                const x = onRejected(this.resulte)
                                resolvePromise(p2, x, resolve, reject)
                            } catch (error) {
                                reject(error)
                            }

                        })
                    }
                } catch (error) {
                    reject(error)
                }
            }
        })
        return p2
    }

    catch(onRejected) {
        return this.then(undefined, onRejected)
    }

    finally(onFinally) {
        return this.then(onFinally, onFinally)
    }
    //异步任务
    runAsyncTask(callback) {
        if (typeof queueMicrotask === 'function') {
            queueMicrotask(callback)
        } else if (typeof MutationObserver === 'function') {
            const obs = new MutationObserver(callback)
            const div = document.createElement('div')
            obs.observe(div, { childList: true })
            div.innerHTML = 'asyncTask'

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

    static resolve(value) {
        if (value instanceof myPromise) {
            return value
        }
        return new myPromise((resolve, reject) => {
            resolve(value)
        })
    }

    static race(promises) {

        return new myPromise((resovle, reject) => {
            // 类型检查
            if (!Array.isArray(promises)) {
                return reject(new TypeError("Arugment is not iterable"))
            }
            promises.forEach(p => {
                myPromise.resolve(p).then((res) => resovle(res), err => reject(err))
            })


        })
    }
}

// 逻辑抽离
function resolvePromise(p2, x, resolve, reject) {
    if (x === p2) {
        throw new TypeError('重复引用')
    }
    //如果返回的是Promise实例，需要在用then方法获取res再进行resolve或者reject
    if (x instanceof myPromise) {
        x.then(res => resolve(res), error => reject(error))
    } else {
        resolve(x)
    }
}

// 测试代码
const p1 = new myPromise((resolve, reject) => {
    setTimeout(() => {
        resolve(1)
    }, 2000)

})

const p2 = new myPromise((resolve, reject) => {
    setTimeout(() => {
        resolve(12)
    }, 1000)
})


myPromise.race([p1, p2]).then(res => console.log(res), err => console.log(err));
