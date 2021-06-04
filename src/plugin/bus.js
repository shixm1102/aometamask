export default class Bus {
    constructor() {
        this.data = {}
    }
    /**
    * 增加订阅者
    * @key {String} 类型
    * @fn {Function} 回掉函数
    * */
    addItem(chain, item) {
        console.log("--- addItem ---", chain, item);
        if (!this.data[chain]) {
            this.data[chain] = [];
        }
        this.data[chain].unshift(item);
        this.onchange(chain)
    }
    changeItem(chain, item) {
        if (!this.data[chain]) {
            this.data[chain] = [];
        }
        this.data[chain].forEach((currentItem, index) => {
            if (item.hash === currentItem.hash) {
                this.data[chain].splice(index, 1, item);
                localStorage[chain] = this.data[chain]
                this.onchange(chain)
            }
        });
    }

    removeItem(chain, item) {
        if (!this.data[chain]) {
            this.data[chain] = [];
        }
        this.data[chain].forEach((currentItem, index) => {
            if (item.hash === currentItem.hash) {
                this.data[chain].slice(index, 1);
                localStorage[chain] = this.data[chain]
                this.onchange(chain)
            }
        });
    }

    onchange(chain) {
        console.log("change chain", chain);
    }



    clear(chain) {
        this.data[chain] = []
    }
}



// var myBus = (function () {
//     var clienlist = {},
//         addlisten, trigger, remove;
//     /**
//      * 增加订阅者
//      * @key {String} 类型
//      * @fn {Function} 回掉函数
//      * */
//     addlisten = function (key, fn) {
//         if (!clienlist[key]) {
//             clienlist[key] = [];
//         }
//         clienlist[key].push(fn);
//     };
//     /**
//      * 发布消息
//      * */
//     trigger = function () {
//         var key = [].shift.call(arguments), //取出消息类型
//             fns = clienlist[key]; //取出该类型的对应的消息集合
//         if (!fns || fns.length === 0) {
//             return false;
//         }
//         for (var i = 0; i < fns.length; i++) {
//             const fn = fns[i++]
//             fn.apply(this, arguments);
//         }
//     };
//     /**
//      * 删除订阅
//      * @key {String} 类型
//      * @fn {Function} 回掉函数
//      * */
//     remove = function (key, fn) {
//         var fns = clienlist[key]; //取出该类型的对应的消息集合
//         if (!fns) { //如果对应的key没有订阅直接返回
//             return false;
//         }
//         if (!fn) { //如果没有传入具体的回掉，则表示需要取消所有订阅
//             fns && (fns.length = 0);
//         } else {
//             for (var l = fns.length - 1; l >= 0; l--) { //遍历回掉函数列表
//                 if (fn === fns[l]) {
//                     fns.splice(l, 1); //删除订阅者的回掉
//                 }
//             }
//         }
//     };
//     return {
//         $on: addlisten,
//         $emit: trigger,
//         $off: remove
//     }
// })();

