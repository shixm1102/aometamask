// 导入组件，组件必须声明 name
import Panel from "./src/main.vue";

// 为组件添加 install 方法，用于按需引入
Panel.install = function(Vue) {
  Vue.component(Panel.name, Panel);
};

export default Panel;
