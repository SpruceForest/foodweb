import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/home/Home.vue'
import {userInfo} from '../service/api'
import Store from '../store'
Vue.use(Router);
//解决在路由跳转的时候同一个路由多次添加是不被允许的
const VueRouterPush = Router.prototype.push
Router.prototype.push = function push (to) {
    return VueRouterPush.call(this, to).catch(err => err)
}

const Recipe = () => import( '@/views/recipe/recipe' );
const Create = () => import( '@/views/create/create' );
const Edit = () => import( '@/views/user-space/edit' );

const Space = () => import('@/views/user-space/space');
const MenuList = () => import( '@/views/user-space/menu-list');
const Fans = () => import( '@/views/user-space/fans');

const Detail = () => import( '@/views/detail/detail');
const Login = () => import( '@/views/user-login/index');

const viewRoute = [
    {
        path:'/recipe',
        name:'recipe',
        title:'菜谱大全',
        component: Recipe
    },
    {
        path: '/create',
        name:'create',
        title:'发布菜谱',
        component:Create,
        meta:{
            login:true
        }
    },
    {
        path:'/edit',
        title:'编辑个人资料',
        name:'edit',
        meta:{login:true},
        component:Edit
    },
    {
        path:'/space',
        title:'个人空间',
        name:'space',
        component:Space,
        redirect:{
            name:'works'
        },
        meta:{
            login:true
        },
        children:[
            {
                path:'works',
                name:'works',
                title:'作品',
                component:MenuList,
                meta:{
                    login:true
                }
            },
            {
                path:'fans',
                name:'fans',
                title:'我的粉丝',
                component:Fans,
                meta:{
                    login:true
                }
            },
            {
                path:'following',
                name:'following',
                title:'我的关注',
                component:Fans,
                meta:{
                    login:true
                }
            },
            {
                path:'collection',
                name:'collection',
                title:'收藏',
                component:MenuList,
                meta:{
                    login:true
                }
            },
        ]
    },
    {
        path:'/detail',
        name:'detail',
        title:'菜谱细节',
        component:Detail
    }
];

const router = new Router({
    mode:'history',
    routes:[
        {
            path:'/',
            name:'home',
            title:'首页',
            component:Home
        },
        {
            path:'/login',
            name:'login',
            title:'登录页',
            component:Login,
            meta:{
                login:true
            }
        },
        ...viewRoute,
        {
            path:'*',
            name:'noFound',
            title:'未找到',
            redirect:{
                name:'home'
            }
        }
    ]
});

router.beforeEach(async (to,from,next)=>{
    const token = localStorage.getItem('token');
    const isLogin = !!token;

    const data = await userInfo();
    Store.commit('changeUserInfo',data.data);

    if(to.matched.some(item=>item.meta.login)){
        if(isLogin){
            if(data.error === 400){
                next({name: 'login'});
                localStorage.removeItem('token');
                return;
            }
            if(to.name === 'login'){
                next({name:'home'})
            }else{
                next();
            }
            return;
        }
        if(!isLogin && to.name === 'login'){
            next();
        }
        if(!isLogin && to.name !== 'login'){
            next({name:'login'})
        }
    }else{
        next();
    }

});

export default router