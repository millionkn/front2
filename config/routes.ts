export default [
  {
    path: '/',
    component: '../layouts/BasicLayout',
    routes: [
      {
        path: '/',
        redirect: '/welcome',
      },
      {
        name: '系统首页',
        icon: 'home',
        path: '/welcome',
        component: './Welcome',
      },
      {
        name: '视频监控',
        icon: 'video-camera',
        path: '/video',
        component: './Video',
      },
      {
        name: '进出管理',
        icon: 'logout',
        path: '/person-list',
        component: './PersonList',
      },
      {
        name: '环境监测',
        icon: 'dashboard',
        path: '/environment',
        component: './Environment',
      },
      {
        name: '报警信息',
        icon: 'dashboard',
        path: '/WarningLog',
        component: './WarningLog',
      },
      {
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },
]