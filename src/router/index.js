import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
import tableRouter from './modules/table'
import nestedRouter from './modules/nested'
import recycleBin from './modules/recycleBin'
import lcgComponents from './modules/lcgComponents'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/documentation',
    hidden:true,
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/documentation/index'),
        name: 'Documentation',
        meta: { title: 'Documentation', icon: 'documentation',  }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  /*{
    path: '/permission',
    component: Layout,
    redirect: '/permission/page',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: 'Permission',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'page',
        component: () => import('@/views/permission/page'),
        name: 'PagePermission',
        meta: {
          title: 'Page Permission',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'directive',
        component: () => import('@/views/permission/directive'),
        name: 'DirectivePermission',
        meta: {
          title: 'Directive Permission',
          // if do not set roles, means: this page does not require permission,
          roles: ['admin']
        }
      },
      {
        path: 'role',
        component: () => import('@/views/permission/role'),
        name: 'RolePermission',
        meta: {
          title: 'Role Permission',
          roles: ['admin']
        }
      }
    ]
  },*/

  /*{
    path: '/icon',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/icons/index'),
        name: 'Icons',
        meta: { title: 'Icons', icon: 'icon', noCache: true }
      }
    ]
  },*/

  /** when your routing map is too long, you can split it into small modules **/
  /* componentsRouter,
 chartsRouter,
 nestedRouter,
 tableRouter,*/
  recycleBin,
  lcgComponents,

 /* {
    path: '/example',
    component: Layout,
    redirect: '/example/list',
    name: 'Example',
    hidden:true,
    meta: {
      title: 'Example',
      icon: 'example'
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/example/create'),
        name: 'CreateArticle',
        meta: { title: 'Create Article', icon: 'edit' }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/example/edit'),
        name: 'EditArticle',
        meta: { title: 'Edit Article', noCache: true, activeMenu: '/example/list' },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/views/example/list'),
        name: 'ArticleList',
        meta: { title: 'Article List', icon: 'list' }
      }
    ]
  },

  {
    path: '/tab',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/tab/index'),
        name: 'Tab',
        meta: { title: 'Tab', icon: 'tab', roles:"operator"  }
      }
    ]
  },*/

  {
    path: '/error',
    component: Layout,
    redirect: 'noRedirect',
    name: 'ErrorPages',
    hidden:true,
    meta: {
      title: 'Error Pages',
      icon: '404',
      roles:"operator"
    },
    children: [
      {
        path: '401',
        component: () => import('@/views/error-page/401'),
        name: 'Page401',
        meta: { title: '401', noCache: true }
      },
      {
        path: '404',
        component: () => import('@/views/error-page/404'),
        name: 'Page404',
        meta: { title: '404', noCache: true }
      }
    ]
  },

 /* {
    path: '/error-log',
    component: Layout,
    children: [
      {
        path: 'log',
        component: () => import('@/views/error-log/index'),
        name: 'ErrorLog',
        meta: { title: 'Error Log', icon: 'bug', roles:"operator" }
      }
    ]
  },

  {
    path: '/excel',
    component: Layout,
    redirect: '/excel/export-excel',
    name: 'Excel',
    meta: {
      title: 'Excel',
      icon: 'excel'
    },
    children: [
      {
        path: 'export-excel',
        component: () => import('@/views/excel/export-excel'),
        name: 'ExportExcel',
        meta: { title: 'Export Excel' }
      },
      {
        path: 'export-selected-excel',
        component: () => import('@/views/excel/select-excel'),
        name: 'SelectExcel',
        meta: { title: 'Export Selected' }
      },
      {
        path: 'export-merge-header',
        component: () => import('@/views/excel/merge-header'),
        name: 'MergeHeader',
        meta: { title: 'Merge Header' }
      },
      {
        path: 'upload-excel',
        component: () => import('@/views/excel/upload-excel'),
        name: 'UploadExcel',
        meta: { title: 'Upload Excel' }
      }
    ]
  },

  {
    path: '/zip',
    component: Layout,
    redirect: '/zip/download',
    alwaysShow: true,
    name: 'Zip',
    meta: { title: 'Zip', icon: 'zip' },
    children: [
      {
        path: 'download',
        component: () => import('@/views/zip/index'),
        name: 'ExportZip',
        meta: { title: 'Export Zip' }
      }
    ]
  },*/

 /* {
    path: '/pdf',
    component: Layout,
    redirect: '/pdf/index',
    name: 'Pdf',
    meta: { title: 'Pdf', icon: 'pdf',  },
    children: [
      {
        path: 'index',
        component: () => import('@/views/pdf/index'),
        name: 'PDF',
        meta: { title: 'PDF', icon: 'pdf' }
      },
      {
        path: '/pdf/download',
        component: () => import('@/views/pdf/download'),
        hidden: false,
        name: "PDFD",
        meta: { title: "PDFD",icon: "pdf"}
      },
    ]
  },


  {
    path: '/theme',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/theme/index'),
        name: 'Theme',
        meta: { title: 'Theme', icon: 'theme' }
      }
    ]
  },

  {
    path: '/clipboard',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/clipboard/index'),
        name: 'ClipboardDemo',
        meta: { title: 'Clipboard', icon: 'clipboard' }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://github.com/PanJiaChen/vue-element-admin',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  },*/

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true },
  {
    path: '/limits',
    component: Layout,
    redirect: '/limits/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/limits/index'),
        name: '权限管理',
        meta: { title: '权限管理', icon: 'documentation', }
      }
    ]
  },
  // 文章管理
  {
    path: '/article',
    component: Layout,
    redirect: '/article/index',
    name: '文章管理 ',
    meta: { title: '文章管理 ', icon: 'documentation', },
    children: [
      {
        path: 'index',
        component: () => import('@/views/article/index'),
        name: '文章管理 ',
        meta: { title: '文章管理 ', icon: 'documentation', }
      },
      {
        path: 'classify',
        component: () => import('@/views/article/classify'),
        name: '文章分类 ',
        meta: { title: '文章分类 ', icon: 'documentation', }
      },

      {
        path: 'newArticle',
        component: () => import('@/views/article/newArticle'),
        name: '文章编辑 ',
        meta: { title: '文章编辑 ', icon: 'documentation', },
        hidden: true
      }
    ]
  },
  // 日志管理
  {
    path: '/log',
    component: Layout,
    redirect: '/log/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/log/index'),
        name: '日志管理 ',
        meta: { title: '日志管理 ', icon: 'documentation',roles:"admin" }
      }
    ]
  },
  // 代理商管理
  {
    path: '/agent',
    component: Layout,
    redirect: '/agent/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/agent/index'),
        name: '代理商管理 ',
        meta: { title: '代理商管理 ', icon: 'documentation', roles:'admin'}
      }
    ]
  },
  // 积分商城管理
  {
    path: '/integration',
    component: Layout,
    redirect: '/integration/index',
    name: '积分商城管理 ',
    meta: { title: '积分商城管理 ', icon: 'documentation', },
    children: [
      {
        path: 'goodsClassify',
        component: () => import('@/views/integration/goodsClassify'),
        name: '商品分类',
        meta: { title: '商品分类 ', icon: 'documentation', }
      },
      {
        path: 'goods',
        component: () => import('@/views/integration/goods'),
        name: '商品',
        meta: { title: '商品', icon: 'documentation', }
      },
      {
        path: 'order',
        component: () => import('@/views/integration/order'),
        name: '订单 ',
        meta: { title: '订单 ', icon: 'documentation', }
      },
      {
        path: 'index',
        component: () => import('@/views/integration/index'),
        name: '出入库记录 ',
        meta: { title: '出入库记录 ', icon: 'documentation', }
      },
      {
        path: 'goodsPic',
        component: () => import('@/views/integration/goodsPic'),
        name: '商品图片 ',
        hidden:true,
        meta: { title: '商品图片 ', icon: 'documentation', }
      }
    ]
  },
  {
    path: '/menu',
    component: Layout,
    redirect: '/menu/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/menu/index'),
        name: '菜单管理',
        meta: { title: '菜单管理', icon: 'guide', noCache: true }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'Profile', icon: 'user', noCache: true, roles: "admin" }
      }
    ]
  },
  {
    path: '/userManage',
    component: Layout,
    redirect: '/userManage/index',
    hidden: false,
    children: [
      {
        path: 'index',
        component: () => import('@/views/userManage/index'),
        name: '用戶管理',
        meta: { title: '用戶管理', icon: 'user', noCache: true, roles: "admin" }
      },
    ]
  },
  {
    path: '/permissionClassify',
    component: Layout,
    redirect: '/permissionClassify/index',
    hidden: false,
    children: [
      {
        path: 'index',
        component: () => import('@/views/permissionClassify/index'),
        name: '权限分类管理',
        meta: { title: '权限分类管理', icon: 'user', noCache: true, roles: "admin" }
      }
    ]
  },
  {
    path: '/roles',
    component: Layout,
    redirect: '/roles/index',
    hidden: false,
    children: [
      {
        path: 'index',
        component: () => import('@/views/roles/index'),
        name: '角色管理',
        meta: { title: '角色管理', icon: 'user', noCache: true, roles: "admin" }
      }
    ]
  },
  {
    path: '/city',
    component: Layout,
    redirect: '/city/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/city/index'),
        name: '区域管理',
        meta: { title: '区域管理', icon: 'user', noCache: true, roles: "admin" }
      }
    ]
  },
  /*{
    path: '/newOne',
    component: Layout,
    redirect: '/newOne/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/city/test'),
        name: 'test',
        meta: { title: 'test', icon: 'user', noCache: true, roles: "admin" }
      }
    ]
  },*/
  {
    path: '/roleLimit',
    component: Layout,
    redirect: '/roleLimit/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/components/lcgComponents/limitComponent'),
        name: '角色权限管理',
        meta: { title: '角色权限管理', icon: 'user', noCache: true, roles: "admin" }
      }
    ]
  },
  {
    path: '/roleUser',
    component: Layout,
    redirect: '/roleUser/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/components/lcgComponents/userComponent'),
        name: '角色用户管理',
        meta: { title: '角色用户管理', icon: 'user', noCache: true, roles: "admin" }
      }
    ]
  },
  {
    path: '/childLimit',
    component: Layout,
    redirect: '/childLimit/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/components/lcgComponents/childLimits'),
        name: '子权限管理',
        meta: { title: '子权限管理', icon: 'user', noCache: true, roles: "admin" }
      }
    ]
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
