import Layout from '@/layout'
//  {  path: '', component: '' }
// 每个子模块 其实 都是外层是layout  组件位于layout的二级路由里面
export default {
	path: '/permission', // 路径
	name: 'permissions', 
	component: Layout, // 组件
	// 配置二级路的路由表
	children: [{
		// 这里当二级路由的path什么都不写的时候 表示该路由为当前路由的默认子路由
		path: '',
		name: 'permissions',
		component: () => import('@/views/permission'),
		// 路由元信息  其实就是存储数据的对象 我们可以在这里放置一些信息
		meta: {
			// meta属性的里面的属性随意定义，这里用title的原因是
			// 因为左侧导航会读取我们的路由里的meta里面的title作为显示菜单名称
			title: '权限管理',
			icon: 'lock'
		}
	}]
}