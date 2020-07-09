<template>
    <div class="home">
        <el-carousel :interval="5000" type="card" height="300px">
            <el-carousel-item v-for="item of list" :key="item._id">
                <router-link :to="{name:'detail',query:{menuId:item.menuId}}">
                    <img :src="item.product_pic_url" width="100%" alt="" />
                </router-link>
            </el-carousel-item>
        </el-carousel>
        <div>
            <h2>内容精选</h2>
            <waterfall ref="waterfall" @view="loadingMenuHandle">
                <menu-card :margin-left="13" :info="menuList"></menu-card>
            </waterfall>
        </div>
    </div>
</template>

<script>
    import {getBanner,getMenus} from "../../service/api";
    import Waterfall from '@/components/waterfall.vue'
    import MenuCard from '@/components/menu-card.vue'
    export default {
        name: "Home",
        components:{
          MenuCard:MenuCard,
          Waterfall
        },
        data(){
            return {
                list: [],
                menuList:[],
                page:1
            }
        },
        methods:{
            async getBanners(){
              let res = await getBanner();

              if(res.code === 0){
                  this.list = res.data.list;
              }
            },
            loadingMenuHandle(){
                this.page++;
                if(this.page > this.pages){
                    this.$refs.waterfall.isLoading = false;
                    return;
                }
                this.$refs.waterfall.isLoading = true;

                getMenus({page:this.page}).then(data=>{
                    this.menuList.push(...data.data.list);
                    this.$refs.waterfall.isLoading = false;
                })
            }
        },
        created(){
            this.getBanners();
        },
        mounted(){
            getMenus({page:this.page}).then(data=>{
                this.menuList = data.data.list;
                this.pages = Math.ceil(data.data.total/data.data.page_size);
            })
        }
    }
</script>

<style lang="stylus">
.home
    h2
        text-align center
        padding 20px 0;

    .el-carousel__item h3
        color #475669
        font-size 14px
        opacity 0.75
        line-height 200px
        margin 0


    .el-carousel__item:nth-child(2n)
        background-color #99a9bf


    .el-carousel__item:nth-child(2n+1)
        background-color #d3dce6

</style>