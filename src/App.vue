<template>
  <div id="app">
    <el-container>
        <Header></Header>
        <!--内容-->
        <el-main>
            <div class="main">
                <router-view></router-view>
            </div>
        </el-main>
        <el-footer>
            <div class="footer">
                Copyright © 2020 - 2020
            </div>
        </el-footer>
    </el-container>
  </div>
</template>

<script>

import Header from "./components/header";
export default {
  name: 'App',
  components: {
      Header
  }
}
</script>

<style lang="stylus">
body
  background: #fae8c8
  font-size:12px
.main
  width:990px
  margin: 0 auto
.footer
  text-align: center
  height:42px
  line-height:42px
</style>
