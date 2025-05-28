function myInstanceOf(left, right) {
    if (typeof left !== 'object' || left === null) return false;
    while (true) {
        if (left === null) return
        let proto = Object.getPrototypeOf(left)
        if (proto === right.prototype) return true
        left = proto
    }
}