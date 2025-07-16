
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
class myPromise {
    resulte = undefined
    state = PENDING
    #handlers = []
    constructor(func) {
        const resolve = (resulte) => {
            if (this.state === PENDING) {
                this.state = FULFILLED
                this.resulte = resulte
                this.#handlers.forEach(({ onFulFilled }) => {
                    onFulFilled(this.resulte)
                })
            }
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

    then(onFulFilled, onRejected) {
        onFulFilled = typeof onFulFilled === 'function' ? onFulFilled : x => x
        onRejected = typeof onRejected === 'function' ? onRejected : x => { throw x }

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
                })

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

        } else {
            setTimeout(callback, 0)
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
