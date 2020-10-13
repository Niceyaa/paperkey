import Layout from '@/layout'

const hiddenRoutes = {
    path: '/hiddenRole',
    component: Layout,
    redirect: '/hiddenRole/index',
    children: [
      {
        path: 'index',
        component: () => import('@/components/lcgComponents/limitComponent'),
        name: '菜单管理',
        meta: { title: '菜单管理', icon: 'guide', noCache: true },
        hidden: true
      }
    ]
  }

export default chartsRouter
