const routers = [{
        path: '/',
        meta: {
            title: '登录'
        },
        component: (resolve) => require(['./views/login'], resolve)
    },
    {
        path: '/home',
        meta: {
            title: '管理'
        },
        component: (resolve) => require(['./views/home'], resolve)
    },
];
export default routers;