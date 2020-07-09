<template>
    <div class="space">
        <h2>欢迎来到我的美食空间</h2>
        <div class="user-info">
            <div class="user-avatar">
                <img :src="userInfo.avatar" alt=""/>
            </div>
            <div class="user-main">
                <h1>{{userInfo.name}}</h1>
                <span class="info">
                    <em>{{userInfo.createdAt}}加入美食杰</em>
                    |
                    <router-link :to="{name:'edit'}" v-if="isOwner">编辑个人资料</router-link>
                </span>
                <div class="tools" v-if="!isOwner">
                    <a href="javascript:;" class="follow-at"
                       :class="{'no-follow-at': userInfo.isFollowing}"
                       @click="toggleHandler">
                        {{ userInfo.isFollowing ?  '已关注' : '+关注' }}
                    </a>
                </div>
            </div>
            <ul class="user-more-info">
                <li>
                    <div>
                        <span>关注</span>
                        <strong>{{userInfo.following_len}}</strong>
                    </div>
                </li>
                <li>
                    <div>
                        <span>粉丝</span>
                        <strong>{{userInfo.follows_len}}</strong>
                    </div>
                </li>
                <li>
                    <div>
                        <span>收藏</span>
                        <strong>{{userInfo.collections_len}}</strong>
                    </div>
                </li>
                <li>
                    <div>
                        <span>发布菜谱</span>
                        <strong>{{userInfo.work_menus_len}}</strong>
                    </div>
                </li>
            </ul>
        </div>

        <el-tabs class="user-nav" v-model="activeName"  @tab-click="tabClickHandler">
            <el-tab-pane label="作品" name="works"></el-tab-pane>
            <el-tab-pane label="粉丝" name="fans"></el-tab-pane>
            <el-tab-pane label="关注" name="following"></el-tab-pane>
            <el-tab-pane label="收藏" name="collection"></el-tab-pane>
        </el-tabs>

        <div class="user-info-show">
            <router-view :info="list" :activeName="activeName"></router-view>
        </div>

    </div>
</template>

<script>
    import {userInfo, toggleFollowing, getMenus, following, fans, collection} from "../../service/api";

    const getOtherInfo = {
        async works(params){
            return (await getMenus(params)).data;
        },
        async following(params){  // 关注
            return (await following(params)).data;;
        },
        async fans(params){  // 粉丝
            return (await fans(params)).data;;
        },
        async collection(params){ // 收藏
            return (await collection(params)).data;
        }
    }

    export default {
        name: "space",
        data(){
            return{
                userInfo:{},
                isOwner: false,
                activeName:'works',
                queen:{},
                list:[]
            }
        },
        watch:{
            $route:{
                async handler(){
                    let {userId} = this.$route.query;
                    this.isOwner = !userId || userId === this.$store.state.userInfo.userId;
                    if(this.isOwner){
                        this.userInfo = this.$store.state.userInfo
                    }else{
                        const data = await userInfo({userId});
                        this.userInfo = data.data;
                    }
                    this.activeName = this.$route.name
                    this.getInfo();
                },
                immediate:true
            }
        },
        methods:{
            async toggleHandler(){
                const data = await toggleFollowing({followUserId:this.userInfo.userId})
                this.userInfo = data.data;
            },
            async getInfo(){
                (async (activeName)=>{
                    let data = await getOtherInfo[this.activeName]({userId:this.userInfo.userId});
                    this.queen[activeName] = data.list;
                    if(activeName === this.activeName){
                        this.list = this.queen[this.activeName]
                    }
                    this.queen = {};
                })(this.activeName)
            },
            tabClickHandler(){
                if(this.activeName === this.$route.name) return;
                this.list = [];
                this.$router.push({
                    name:this.activeName,
                    query:{
                        ...this.$route.query
                    }
                })
            }
        }
    }
</script>

<style lang="stylus">
.space

  h2
    text-align center
    margin 20px 0
  .user-info
     height 210px
     background-color #fff
     display flex
     .user-avatar
         width 210px
         height 210px

         img
                width 100%
                height 100%
        .user-main
            width 570px
            padding 20px
            position relative
            h1
                font-size 24px
                color #333
                line-height 44px
            .info
                font-size 12px
                line-height 22px
                color #999
                a
                    color #999
            .tools
                position absolute
                right 20px
                top 20px
                vertical-align top;
                a
                    display inline-block
                    padding 3px 0
                    width 50px
                    color #fff
                    text-align center
                a.follow-at
                    background-color  #ff3232
                a.no-follow-at
                    background-color #999

        .user-more-info
            width 190px
            overflow hidden
            padding-top 20px
            li
                width 81px
                height 81px
                border-radius 32px
                border-bottom-right-radius 0
                margin 0px 8px 8px 0px
                float left
                div
                    display block
                    height 81px
                    width 81px
                    box-shadow 0px 0px 6px rgba(0,0,0,0.05) inset
                    border-radius 32px
                    border-bottom-right-radius 0

                    span
                        color #999
                        line-height 20px
                        display block
                        padding-left 14px
                        padding-top 14px

                    strong
                        display block
                        font-size 18px
                        color #ff3232
                        font-family Microsoft Yahei
                        padding-left 14px
                        line-height 32px

    .user-nav
        margin 20px 0 20px 0
        user-select none
    .user-info-show
        min-height 300px
        background #fff
        padding-top 20px
        .info-empty
            width 100%
            min-height inherit
            display flex
            align-items center
            justify-content:center;
            p
                text-align center
                font-size 12px
            a
                text-align center
                display block
                height 48px
                width 200px
                line-height 48px
                font-size 14px
                background #ff3232
                color #fff
                font-weight bold
                margin 0px auto
    .el-tabs__item.is-active
        color: #ff3232;
    .el-tabs__active-bar
        background-color: #ff3232;
    .el-tabs__nav-wrap::after
        background-color: transparent;
</style>

