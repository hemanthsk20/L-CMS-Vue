<template>
  <div>
    <v-navigation-drawer class="mobile_app_cms" v-if="visible" app dark>
      <h3 class="mobile_app_heading">Mobile App</h3>
      <v-list dense>
        <div v-for="(item, i) in menuItems" :key="i">
          <v-list-item
            :class="getId === item.id && 'active_mobile_app'"
            @click="setMenuItemData(item, '')"
          >
            <v-list-item-content>
              <router-link
                v-bind:to="'/editApp/' + item.id"
                style="text-decoration:none;color:white;"
              >
                {{ item.name }}
              </router-link>
            </v-list-item-content>
          </v-list-item>
        </div>
      </v-list>
      <v-row align="end"> </v-row>
      <v-btn @click="handleAddnew()">Add new app</v-btn>
      <MobileAppNewEditor
          :show="showAddNewPopup"
          :close="handleCloseAddNew"
          @checkSubmitNewApp="handleNewMobileApp"
      />
    </v-navigation-drawer>
  </div>
</template>

<script>
import MobileAppNewEditor from "./MobileAppNewEditor.vue";
import axios from "axios";
import {eventBus} from "@/main";

export default {
  name: "MobileAppCms",

  props: ["isVisible", "deselectAll", "getMobileAppData"],

  components: {
    MobileAppNewEditor,
  },

  data: () => ({
    menuItems: [],
    showAddNewPopup: false,
    selectedMenuItem: {
      id: 0,
      text: "",
    },
    loading: false,
  }),

  watch: {
    selectedMenuItem() {},
    setMenuItemData: function () {},
    editModAct: function() {
      this.setMenuItemData();
    },
    deselectAll() {
      if (this.deselectAll === true) {
        this.selectedMenuItem = {id: 0}
      }
    },
  },

  methods: {
    setMenuItemData(menu, father) {
      if (menu !== undefined) {
        this.selectedMenuItem = menu;
        if (father !== "") {
          this.selectedMenuItem.text = father + " / " + menu.text;
        } else {
          this.selectedMenuItem.text = menu.text;
        }
        this.$emit("changeMenuItemEvent", this.selectedMenuItem);
      }
    },

    handleNewMobileApp(data) {
      if (data !== undefined) {
        let temp = { ...data };
        this.menuItems.push(temp);
      }
    },

    handleAddnew() {
      this.showAddNewPopup = true;
    },

    handleCloseAddNew() {
      this.showAddNewPopup = false;
    },

    getApiCall() {
      this.loading = true;
      return new Promise((resolve, reject) => {
        axios
          .get(`https://mobile-app-cms.azure-api.net/private/mobileApps`, {
            headers: {
              "Ocp-Apim-Subscription-Key": "", //8ec096a694fa4080ba8df25a2e132205
            },
          })
          .then((response) => {
            this.menuItems = response.data;
            let first = this.menuItems[0].id;
            if (this.getId !== undefined) {
              this.$router.push(`/editApp/${first}`);
            }
            this.setMenuItemData(this.menuItems[0], "");
            this.getMobileAppData(response.data);
            this.loading = false;
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },
  },

  computed: {
    visible: {
      get: function() {
        return this.isVisible;
      },
    },
    getId() {
      return this.$route.params.id;
    },

  },

  created() {
    this.getApiCall();
    eventBus.$on("deletedApp", ()=> {
      this.getApiCall();
    })
  },

  mounted() {},
};
</script>

<style scoped lang="scss">
@import "../style/style.scss";

.mobile_app_cms {
  .wrap-text {
    color: white;
    padding-left: 5px;
  }
  .active_mobile_app {
    background-color: #605e5b;
  }
  .mobile_app_heading {
    color: $base-white;
    font-family: $base-font-family;
    font-size: 20px;
    padding-left: 10px;
    margin-top: 10px;
  }
  .v-btn:not(.v-btn--round).v-size--default {
    position: absolute;
    bottom: 10px;
    margin-left: 20%;
  }
  .theme--dark.v-btn.v-btn--has-bg {
    background: $base-color;
    color: white;
  }
}
</style>
