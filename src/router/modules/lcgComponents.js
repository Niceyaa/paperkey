/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const lcgComponents = {
  path: '/lcgComponent',
  component: Layout,
  redirect: 'noRedirect',
  hidden:true,
  children: [
    {
      path: 'tatterComponent',
      component: () => import('@/components/lcgComponents/tatterComponent'),
      name: '碎纸详情',
      meta: { title: '碎纸详情', noCache: true }
    },
    {
      path: 'compressComponent',
      component:()=>import("@/components/lcgComponents/compressComponent"),
      name: '压缩详情',
      meta: { title: "压缩详情", noCache: true }
    },
    {
      path: 'outBoundComponent',
      component:()=>import("@/components/lcgComponents/outBoundComponent"),
      name: '添加纸饼信息',
      meta: { title: "添加纸饼信息", noCache: true }
    }
  ]
}

export default lcgComponents
