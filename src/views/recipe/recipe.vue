<template>
    <div class="recipe">
        <el-tabs v-model="activeName" type="border-card" @tab-click="tabClickHandle">
            <el-tab-pane v-for="item of classifies" :key="item.parent_type" :label="item.parent_name" :name="item.parent_type">
                <div class="recipe-link">
                    <router-link
                            v-for="option of item.list"
                            :to="{query:{...$route.query,classify:option.type,page:1}}"
                            :class="{'active':option.type === classifyType}"
                    >{{ option.name }}</router-link>
                </div>
            </el-tab-pane>
        </el-tabs>
        <h2>家常好味道，给你家一般的温暖</h2>
        <el-container>
            <el-aside width="220px" class="recipe-aside">
                <div class="filter-box">
                    <h4>筛选</h4>
                    <el-collapse>
                        <el-collapse-item :name="item.parent_type" :title="item.parent_name" v-for="item of properties" :key="item.parent_type">
                            <div class="filter-tags">
                                <el-tag type="info"
                                        v-for="option of item.list"
                                        :key="option.type"
                                        :class="{'tag-selected':option.type === propertiesTypes[item.title]}"
                                        @click="selectedTag(option)"
                                >{{option.name}}</el-tag>
                            </div>
                        </el-collapse-item>
                    </el-collapse>
                </div>
            </el-aside>
            <el-main class="filter-menus-box">
                <menu-card style="min-height: 75%;" :info="list"></menu-card>
                <div style="text-align: right;" v-show="!loading">
                    <el-pagination
                            :hide-on-single-page= "pages.totalPages === 1 || !list.length"
                            @size-change="changePage"
                            @current-change="changePage"
                            :current-page.sync="pages.currentPage"
                            style="display: inline-block;"
                            :page-size="pages.pageSize"
                            layout="total, prev, pager, next"
                            :total="pages.total"
                    ></el-pagination>
                </div>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    import MenuCard from "../../components/menu-card";
    import {getClassify, getProperty, getMenus} from '@/service/api'
    export default {
        name: "recipe",
        components: {MenuCard},
        data(){
            return {
                activeName:'1',
                list:[],
                classifies:[],
                classifyType:'',
                properties:[],
                propertiesActivName: [],
                propertiesTypes:{},
                pages:{
                    pageSize: 0,
                    total: 0,
                    currentPage: 0,
                    totalPages: 0
                },
                loading: false
            }
        },
        watch:{
          $route:{
              handler(){
                  const {classify} = this.$route.query;
                  if(classify){
                      this.activeName = classify[0];
                      this.classifyType = classify;
                      this.getMenus();
                  }
              },
              immediate:true
          }
        },
        methods:{
            changePage(){
                this.$router.push({
                    query: {
                        ...this.$route.query,
                        page: this.pages.currentPage
                    }
                })
            },
            tabClickHandle(tab){
                let activeName = this.activeName;
                let item = this.classifies.filter(item=>{
                    return item.parent_type == activeName
                })[0];
                if(item){
                    this.classifyType = item.list[0].type;
                    this.$router.push({
                        query:{
                            classify:this.classifyType,
                            page:1
                        }
                    })
                }
            },
            selectedTag(option){
                let query = {...this.$route.query};
                if(this.propertiesTypes[option.title] === option.type){
                    this.propertiesTypes[option.title] = '';
                    delete query[option.title];
                }else{
                    this.propertiesTypes[option.title] = option.type;
                    query[option.title] = option.type;
                }
                this.$router.push({
                    query
                })
            },
            getMenus(){
                const query = {...this.$route.query};
                const params = {
                    page: query.page || 1,
                    classify:query.classify
                }
                delete query.page;
                delete query.classify;
                if(Object.keys(query).length){
                    params.property = {
                        ...query
                    }
                }
                let loading = null;
                this.$nextTick(()=>{
                    loading = this.$loading({
                        target:'.filter-menus-box',
                        lock: true,
                        text: 'Loading',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.7)'
                    });
                })
                this.list = [];
                this.loading = true;
                getMenus(params).then(data=>{
                    this.list = data.data.list;
                    this.pages.pageSize = data.data.page_size;
                    this.pages.total = data.data.total;
                    this.pages.currentPage = data.data.current_page;
                    if(loading) loading.close();
                    this.loading = false;
                    this.pages.totalPages = Math.ceil(this.pages.total/this.pages.pageSize);
                })
            }
        },
        created(){
            getClassify().then(res=>{
                this.classifies = res.data;
                if(!this.$route.query.classify){
                    this.activeName = res.data[0].parent_type;
                    this.classifyType = res.data[0].list[0].type;
                    this.$router.push({
                        query:{
                            classify:this.classifyType,
                            page:1
                        }
                    });
                }
            })
            getProperty().then(res=>{
                if(res.ec === 200){
                    this.properties = res.data;
                    const {query} = this.$route;
                    this.propertiesTypes = this.properties.reduce((o,item)=>{
                        o[item.title] = query[item.title] ? query[item.title] : '';
                        if(o[item.title]){
                            this.propertiesActivName.push(o[item.title][0]);
                        }
                        return o;
                    },{})
                    console.log(this.propertiesTypes,this.propertiesActivName)
                }
            })
        }
    }
</script>

<style lang="stylus">
    .recipe-link
        font-size 0;
        margin-top 5px
        a
            display inline-block
            font-size 12px
            padding 0px 8px
            height 28px
            line-height 28px
        .active
            background #ff3232
            color #fff
    .recipe
        h2
            text-align center
            line-height 150px
        .el-main
            padding 0
        .filter-box
            background #fff
            padding 10px
            width 100%
            float left
            box-sizing border-box
    .filter-tags
        display flex
        flex-wrap wrap
        justify-content space-around
        .tag-selected
            background-color #ff3232
            color #fff
    .menu-empty
        width 100%
        text-align center
        font-size 20px
</style>