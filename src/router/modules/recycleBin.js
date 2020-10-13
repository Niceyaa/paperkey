/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const recycleBin = {
  path: '/recycle',
  component: Layout,
  redirect: '/recycle/paperClassify',
  name: '回收站管理',
  meta: {
    title: '回收站管理',
    icon: 'table'
  },
  children: [
    {
      path: 'index',
      component: () => import('@/views/recycleBin/index'),
      name: '回收站管理',
      meta: { title: '回收站管理', noCache: true, icon: 'table' }
    },
    {
      path: 'paperClassify',
      component: () => import('@/views/recycleBin/paperClassify'),
      name: '纸张分类管理',
      meta: { title: '纸张分类管理', noCache: true, icon: 'table' }
    },
    {
      path: 'recyclePrice',
      component: () => import('@/views/recycleBin/recyclePrice'),
      name: '回收价格参数',
      meta: { title: '回收价格参数', noCache: true, icon: 'table' }
    },
    {
      path: 'recycleWeight',
      component: () => import('@/views/recycleBin/recycleWeight'),
      name: '回收重量参数',
      meta: { title: '回收重量参数', noCache: true, icon: 'table' }
    },
    {
      path: 'recycleProcess',
      component: () => import('@/views/recycleBin/recycleProcess'),
      name: '回收过程管理',
      meta: { title: '回收过程管理', noCache: true, icon: 'table' }
    },
    {
      path: 'recycleProcessNode',
      component: () => import('@/views/recycleBin/recycleProcessNode'),
      name: '回收过程节点管理',
      meta: { title: '回收过程节点管理', noCache: true, icon: 'table' }
    },
    {
      path: 'tatter',
      component: () => import('@/views/recycleBin/tatter'),
      name: '碎纸记录管理',
      meta: { title: '碎纸记录管理', noCache: true, icon: 'table' }
    },
    {
      path: 'paperCompress',
      component: () => import('@/views/recycleBin/paperCompress'),
      name: '纸张压缩管理',
      meta: { title: '纸张压缩管理', noCache: true, icon: 'table' }
    },
    {
      path: 'order',
      component: () => import('@/views/recycleBin/order'),
      name: '订单管理',
      meta: { title: '订单管理', noCache: true, icon: 'table' }
    },
    {
      path: 'bag',
      component: () => import('@/views/recycleBin/bag'),
      name: '包裹管理',
      hidden:true,
      meta: { title: '包裹管理', noCache: true, icon: 'table' }
    },
    {
      path: 'bagPutIn',
      component: () => import('@/views/recycleBin/bagPutIn'),
      name: '包裹入库',
      meta: { title: '包裹入库', noCache: true, icon: 'table' }
    },
    {
      path: 'postpone',
      component: () => import('@/views/recycleBin/postpone'),
      name: '延期管理',
      meta: { title: '延期管理', noCache: true, icon: 'table' }
    },
    {
      path: 'sendOrder',
      component: () => import('@/views/recycleBin/sendOrder'),
      name: '派单管理',
      meta: { title: '派单管理', noCache: true, icon: 'table' }
    },
    {
      path: 'outBound',
      component: () => import('@/views/recycleBin/outBound'),
      name: '装车出库',
      meta: { title: '装车出库', noCache: true, icon: 'table' }
    }
  ]
}

export default recycleBin
