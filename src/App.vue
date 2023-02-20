<template>
  <div id="app">
    <div id="nav">
    </div>
    <Home></Home>
  </div>
</template>

<script>
import Home from "./views/Home";
export default {
  components: {
    Home,
  },
};
</script>

<style lang="scss">
@import "./style/style.scss";
</style>
