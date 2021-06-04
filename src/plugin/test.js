import testPanel from './panel.vue'
import testToast from './toast.vue'
let test = {}
test.install = function (Vue, options) {
    console.log("options", options);
    Vue.prototype.$msg = 'Hello I am test.js'
    Vue.prototype.$myMethod = function (arr) {
        if (arr.length < 0) {
            return false
        } else {
            arr = arr.join('连接你我')
            return arr
        }
    }
    Vue.component(testPanel.name, testPanel) // testPanel.name 组件的name属性
    Vue.component(testToast.name, testToast) // testPanel.name 组件的name属性
}
export default test
