
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
        func(resolve, reject)
    }

    then(onFulFilled, onRejected) {
        onFulFilled = typeof onFulFilled === 'function' ? onFulFilled : x => x
        onRejected = typeof onRejected === 'function' ? onRejected : x => { throw x }

        const p2 = new myPromise((resolve, reject) => {
            if (this.state === FULFILLED) {
                this.runAsyncTask(() => onFulFilled(this.resulte))

            } else if (this.state === REJECTED) {
                this.runAsyncTask(() => onRejected(this.resulte))

            } else if (this.state === PENDING) {

                this.#handlers.push({
                    onFulFilled: () => {
                        this.runAsyncTask(() => onFulFilled(this.resulte))
                    },
                    onRejected: () => {
                        this.runAsyncTask(() => onRejected(this.resulte))
                    }
                })

            }
        })
        return p2
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
}



console.log('top');

const p = new myPromise((resovle, reject) => {
    setTimeout(() => {
        resovle('success')
    }, 2000);
})

p.then(res => {
    console.log('then1', res)
}, res => {
    console.log('then1', res);
}
)
p.then(res => {
    console.log('then2', res)
}, res => {
    console.log('then2', res);
}
)
console.log('bottom');
