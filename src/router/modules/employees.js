import Layout from '@/layout'

export default {
  path: '/employees', // 员工
  component: Layout,
  children: [
    {
      path: '',
      name: 'Employees',
      component: () => import('@/views/employees'),
      meta: { title: '员工', icon: 'people' }
    },
    {
      path: 'detail',
      name: 'EmployeesDetail',
      component: () => import('@/views/employees/detail'),
      hidden: true // 防止左侧导航生成
    }
  ]
}
