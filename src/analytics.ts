async function babelTesting() {
    return await Promise.resolve('async from analytics.js is working :-)');
}

// babelTesting().then(console.log);

class Util {
    static id = Date.now();
}

// console.log('Util id:', Util.id);

const n: number = 2;