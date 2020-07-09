<template>
    <div class="create">
         <h2>欢迎发布新菜谱，先介绍一下你的大作！</h2>
         <section class="create-introduce">
             <h5>标题</h5>
             <el-input class="create-input" placeholder="请输入内容" v-model="backData.title"></el-input>
             <h5>属性</h5>
             <div>
                 <el-select
                         v-for="item of properties"
                         :key="item.parent_type"
                         :placeholder="item.parent_name"
                         v-model="backData.property[item.title]"
                 >
                     <el-option v-for="option of item.list" :value="option.type" :label="option.name" :key="option.type"></el-option>
                 </el-select>
             </div>
             <h5>菜谱分类</h5>
             <div>
                 <el-select placeholder="请选择菜谱分类" v-model="backData.classify">
                     <el-option-group
                             v-for="item of classifies"
                             :key="item.parent_type"
                             :label="item.parent_name"
                     >
                         <el-option
                            v-for="option of item.list"
                            :key="option.type"
                            :label="option.name"
                            :value="option.type"
                         ></el-option>
                     </el-option-group>
                 </el-select>
             </div>
             <h5>成品图（320*440）</h5>
             <div class="upload-img-box clearfix">
                 <div class="upload-img">
                     <upload-img
                        action="/api/upload?type=product"
                        :image-url="backData.product_pic_url"
                        @res-url="(data)=>{backData.product_pic_url = data.resImgUrl}"
                     ></upload-img>
                 </div>
                 <el-input
                    class="introduce-text"
                    type="textarea"
                    :rows="10"
                    v-model="backData.product_story"
                    placeholder="请输入内容"
                 ></el-input>
             </div>
         </section>
         <h2>记录所有原材料</h2>
        <section class="create-introduce">
            <h5>主料</h5>
            <stuff v-model="backData.raw_material.main_material"></stuff>
            <h5>辅料</h5>
            <stuff v-model="backData.raw_material.accessories_material"></stuff>
        </section>
        <h2>开始写步骤了！能否简单易学就看你怎么写了，加油！</h2>
        <section class="create-introduce">
            <upload
                    v-for="(item,index) of backData.steps"
                    :key="item.customeId"
                    :n="index+1"
                    v-model="backData.steps[index]"
                    @remove="removeStep"
            ></upload>
            <el-button
                class="eaeaea add-step-button"
                type="primary"
                size="medium"
                icon="el-icon-plus"
                @click="addStep"
            >增加一步</el-button>
            <h5>烹饪小技巧</h5>
            <el-input
                    class="introduce-text"
                    type="textarea"
                    :rows="8"
                    placeholder="分享下你做这道菜的过程中的心得和小技巧吧！"
                    v-model="backData.skill"
            >
            </el-input>
        </section>

        <el-button
                class="send"
                type="primary"
                size="medium"
                :icon="icon"
                @click="send"
        >搞定，提交审核</el-button>
    </div>
</template>

<script>
    import UploadImg from "../../components/upload-img";
    import Stuff from "./stuff";
    import Upload from "./step-upload";
    import {getProperty, getClassify, publish} from '@/service/api'

    const raw_material_struct = {
        name: '',specs: ''
    };
    const steps_struct = {img_url: '',describe: '',};
    let n = 1;
    export default {
        name: "create",
        components: {Upload, Stuff, UploadImg},
        data(){
            return{
                properties: [],
                classifies: [],
                icon:'',
                backData: {
                    title: '',
                    property: {
                        // craft: '',
                        // flavor: ''
                    },
                    classify: '',
                    product_pic_url: 'https://s1.c.meishij.net/n/images/upload_big_img.png?_=1561906961',
                    product_story: '',
                    raw_material: { // 料
                        main_material: Array(3).fill(1).map(() => ({...raw_material_struct})), // 主料  //
                        accessories_material: Array(3).fill(1).map(() => ({...raw_material_struct})), // 辅料
                    },
                    steps: Array(3).fill(1).map(() => ({...steps_struct, customeId: this.uuid()})),
                    skill: ''
                }
            }
        },
        mounted(){
            getProperty().then(res=>{
                if(res.ec === 200){
                    this.properties = res.data;
                }
            });
            getClassify().then(res=>{
                if(res.ec === 200){
                    this.classifies = res.data;
                }
            })
        },
        methods:{
            uuid(){
                n++;
                return Date.now() + n;
            },
            removeStep(index){
                this.backData.steps.splice(index-1,1)
            },
            addStep(){
                this.backData.steps.push({
                    ...steps_struct,
                    customeId: this.uuid()
                })
            },
            send(){
                this.icon = 'el-icon-loading';
                let param = this.backData;
                param.steps = param.steps.map(item=>{
                    return {
                        img_url: item.img_url,
                        describe: item.describe,
                    }
                })

                publish(param).then(data=>{
                    this.$router.push({
                        name:'space'
                    })
                })
            }
        }
    }
</script>

<style lang="stylus">

    .create-introduce
        background-color #fff
        padding 20px

        .add-step-button
            margin-left 100px

    .create
        width 100%
        h2
            text-align center
            margin 20px 0
        .send
            // ff3232()
            height: 70px;
            width: 220px;
            background #ff3232
            color #fff
            border none
            margin 20px auto
            display block


        h5
            margin 20px 0

    .create-input input
        width 446px
        line-height 22px
    .upload-img-box
        .upload-img
            float left
        .introduce-text
            float left
        .el-textarea
            width 60%
            margin-left 10px



</style>