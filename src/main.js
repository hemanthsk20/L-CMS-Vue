import Vue from "vue";
import App from "./App.vue";
import vuetify from "@/plugins/vuetify"; // path to vuetify export
import VueNoty from "vuejs-noty";
import Routes from "./routes";
import VueRouter from "vue-router";

Vue.config.productionTip = false;
export const eventBus = new Vue(); // added line
Vue.use(VueRouter);
const router = new VueRouter({
  routes: Routes,
});
Vue.use(VueNoty, {
  timeout: 3000,
  progressBar: true,
  layout: "topCenter",
});

new Vue({
  router: router,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
