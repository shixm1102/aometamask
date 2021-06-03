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

