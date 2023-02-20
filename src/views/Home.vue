<template>
  <v-app id="inspire">
    <MobileAppCms
      :isVisible="isVisible"
      @changeMenuItemEvent="setMenuItem"
      :getMobileAppData="getMobileAppData"
      :deselectAll="deselectAll"
    >
    </MobileAppCms>
    <v-app-bar app color="white" light>
      <v-app-bar-nav-icon
        class="navigation_icon"
        @click.stop="isVisible = !isVisible"
      >
      </v-app-bar-nav-icon>
      <v-toolbar-title>Mobile CMS</v-toolbar-title>
      <img
        alt="logo"
        class="logo trackEvent"
        src="../assets/logo_ci_liebherr.svg"
        data-event-category="Page Areas"
        data-event-action="Meta-Navigation"
        data-event-label="logo"
        data-fallback="../assets/liebherr_s.png"
      />
    </v-app-bar>
    <v-main class="main_container">
      <v-banner
        class="banner_navbar"
        v-if="getCurrentSelectedMobileName !== ''"
        style="background-color: #605e5b"
      >
        {{ getCurrentSelectedMobileName }}
      </v-banner>
      <v-container :fluid="true">
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import MobileAppCms from "@/components/MobileAppCms";

export default {
  components: {
    MobileAppCms,
  },

  methods: {

    setMenuItem(val) {
      this.selectedMenuItem = val;
      this.deselectAll = false;
    },

    getMobileAppData(data) {
      this.mobileAppData = data;
    },
  },

  props: {
    source: String,
  },

  data: () => ({
    isVisible: true,
    selectedMenuItem: {},
    deselectAll: false,
    mobileAppData: [],
  }),
  computed: {

    getId() {
      return this.$route.params.id;
    },

    getCurrentSelectedMobileName() {
      let id = this.getId;
      return this.mobileAppData.length > 0
          ? this.mobileAppData.filter((each) => each.id === id).length
              ? this.mobileAppData.filter((each) => each.id === id)[0].name
              : ""
          : "";
    },
  },
};
</script>

<style scoped lang="scss">
@import "../style/style.scss";
.fa-bars:before {
  content: "\f0c9";
  color: white;
}
.navigation_icon {
  background: $base-color;
  color: black;
}
.main_container {
  margin-top: 20px;
}
.banner_navbar {
  padding: 0;
  margin-top: -24px;
  height: 52px;
}
.logo {
  display: block;
  float: end;
  height: 20px;
  margin-left: 70%;
}
.theme--light.v-banner.v-sheet:not(.v-sheet--outlined):not(.v-sheet--shaped) .v-banner__wrapper {
  border-bottom: $base-banner-background;
  margin-left: -12px;
  width: 100%;
}
</style>
