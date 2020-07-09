import axios from 'axios';

class HttpRequest {
    constructor(options){
        this.defaults = {
            baseUrl:''
        };
        this.defaults = Object.assign(this.defaults,options)
    }
    setConfig(){

    }
    interceptors(install){
        install.interceptors.request.use(
            config => {
                let token = localStorage.getItem('token');
                if(token){
                    config.headers.authorization = `token ${token}`;
                }
                return config;
            },
            err => {
                return Promise.reject(err);
            }
        );
        install.interceptors.response.use(
            res=>{
                const {data,status} = res;
                return data;
            },
            err=>{
                return Promise.reject(err);
            }
        );
    }
    request(options){
        options = Object.assign(this.defaults,options);
        const instance = axios.create(options);
        this.interceptors(instance);
        return instance;
    }
}

const request = new HttpRequest({
    baseURL: '/api'
});

const http = request.request();

//轮播数据
export async function getBanner() {
    return await http.get('/banner');
}

/**
 * 拿到用户发布的菜谱，可做筛使用选
 */
export async function getMenus(params) {
    return await http.get('/menu/query',{params})
}
// 获取所有属性分类
export async function getProperty() {
    return await http.get('/menu/property');
}
// 获取所有菜谱分类
export async function getClassify() {
    return await http.get('/menu/classify');
}
/**
 * 发布菜谱
 */
export async function publish(params){
    return await http.post('/menu/publish', params);
}

/**
 * 注册账号
 *
 */
export async function register(params){
    return await http.post('/user/create', params);
}

/**
 * 账号登录
 */
export async function login(params){
    return await http.post('/user/login', params);
}

/**
 * 账号登出
 */
export async function login_out(){
    return await http.post('/user/login_out');
}


/**
 * 获取用户信息
 *
 */
export async function userInfo(params){
    return await http.post('/user/info', params);
}

/**
 * toggle 关注。关注的取消关注；没关注的，要关注。
 */
export async function toggleFollowing(params){
    return await http.post('/user/following', params);
}

/**
 * 获取指定用户关注的人
 */
export async function following(params){
    return await http.get('/user/following', {params});
}

/**
 * 获取指定用户的收藏的菜单
 */
export async function collection(params){
    return await http.get('/user/collection', {params});
}

/**
 * 获取指定用户的粉丝
 */
export async function fans(params){
    return await http.get('/user/fans', {params});
}

/**
 * 修改用户信息
 */
export async function userEdit(params){
    return await http.post('/user/edit', params);
}

/**
 * 根据菜单id，拿到菜谱的详细信息

 */
export async function menuInfo(params){
    return await http.get('/menu/menuInfo', {params});
}

/**
 * toggle 收藏。收藏的取消收藏；没收藏的，要收藏。
 */
export async function toggleCollection(params){
    return await http.post('/user/collection', params);
}

/**
 * 获取菜谱评论信息
 */
export async function getComments(params){
    return await http.get('/menu/comment', {params});
}
/**
 * 提交菜谱评论信息
 */
export async function postComment(params){
    return await http.post('/menu/comment', params);
}