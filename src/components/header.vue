<template>
    <el-header style="height: auto;">
        <div class="header">
            <div class="header_c">
                <el-row type="flex" justify="start" align="middle">
                    <el-col :span="6">
                        <a href="" class="logo"></a>
                    </el-col>
                    <el-col :span="10" :offset="2"></el-col>
                    <el-col :span="6" :offset="3" class="avatar-box" v-show="isLogin">
                        <router-link :to="{name:'space'}">
                            <el-avatar style="vertical-align: middle;" shape="square" size="medium" :src="userInfo.avatar"></el-avatar>
                        </router-link>
                        <router-link :to="{name:'space'}" class="user-name">{{userInfo.name}}</router-link>
                        <router-link :to="{name:'create'}" class="collection">发布菜谱</router-link>
                        <a href="javascript:;" class="collection" @click="loginOut">退出</a>
                    </el-col>
                    <el-col :span="6" :offset="3" class="avatar-box" v-show="!isLogin">
                        <router-link :to="{name:'login'}" class="user-name">登录</router-link>
                        <router-link :to="{name:'login',query:{ac:'zhuce'}}" class="collection">注册</router-link>
                    </el-col>
                </el-row>
            </div>
        </div>
        <div class="nav-box">
            <div class="nav_c">
                <menus></menus>
            </div>
        </div>
    </el-header>
</template>

<script>
    import Menus from '@/components/menus'
    import {login_out} from "../service/api";

    export default {
        name: "headers",
        components:{Menus},
        computed:{
            isLogin(){
                return this.$store.getters.isLogin;
            },
            userInfo(){
                return this.$store.state.userInfo;
            }
        },
        methods:{
            loginOut(){
                this.$confirm('真的确定要登出吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    const data = await login_out();
                    localStorage.removeItem('token');
                    window.location.href = '/';
                }).catch(() => {});
            }
        }
    }
</script>

<style lang="stylus">
    .header
        height 129px
        background-color #e8966b
        .logo
            display: block;
            height: 129px;
            width: 184px;
            background url(https://i3.meishichina.com/static/lib/logo.png) 19px 30px no-repeat;
            -webkit-background-size: 80% 50%
            background-size: 80% 50%
    .header_c, .nav_c
        width 990px
        margin 0 auto
    .nav-box
        height 60px
        background-color #fff;
        box-shadow 10px 0px 10px rgba(0,0,0,0.3)
    .user-name
        margin-left 5px
        color #fff
    .collection
        margin-left 5px
        color #fff
</style>