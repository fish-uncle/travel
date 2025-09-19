import { defineNuxtPlugin } from "#app";
import Vant from "vant";
import "vant/lib/index.css";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Vant);

  // 全局注册常用组件
  const {
    DatePicker,
    Field,
    Button,
    Cell,
    CellGroup,
    Popup,
    ActionSheet,
    Toast,
    Dialog,
  } = Vant;

  nuxtApp.vueApp.component("VanDatePicker", DatePicker);
  nuxtApp.vueApp.component("VanField", Field);
  nuxtApp.vueApp.component("VanButton", Button);
  nuxtApp.vueApp.component("VanCell", Cell);
  nuxtApp.vueApp.component("VanCellGroup", CellGroup);
  nuxtApp.vueApp.component("VanPopup", Popup);
  nuxtApp.vueApp.component("VanActionSheet", ActionSheet);
  nuxtApp.vueApp.component("VanToast", Toast);
  nuxtApp.vueApp.component("VanDialog", Dialog);
});
