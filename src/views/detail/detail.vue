<template>
    <div class="menu-detail">
        <detail-header :info="menuInfo"></detail-header>
        <detail-content :info="menuInfo"></detail-content>
        <Comment :info="menuInfo"></Comment>
    </div>
</template>

<script>
    import DetailHeader from "./detail-header";
    import DetailContent from "./detail-content";
    import Comment from "./comment";
    import {menuInfo} from "../../service/api";
    export default {
        name: "detail",
        components: {Comment, DetailContent, DetailHeader},
        data(){
            return{
                menuInfo:{
                    userInfo:{},
                    raw_material: {
                        main_material:[],
                        accessories_material:[]
                    },
                    steps:{}
                }
            }
        },
        watch:{
            $route:{
                handler(){
                    let {menuId} = this.$route.query;
                    if(menuId){
                        menuInfo({menuId:this.$route.query.menuId}).then(res=>{
                            this.menuInfo = res.data.info
                            console.log(this.menuInfo)
                        })
                    }else{
                        this.$message({
                            showClose: true,
                            message: '请重新进入',
                            type: 'warning'
                        });
                    }

                },
                immediate:true
            }
        }
    }
</script>

<style scoped>

</style>