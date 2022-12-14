// 该文件负责所有的公共的组件的全局注册
import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
import ImageUpload from './ImageUpload'
import Print from 'vue-print-nb'
import ScreenFull from './ScreenFull'
import ThemePicker from './ThemePicker'
import LangSelect from './lang'
import TagsView from './TagsView'

export default {
  install(Vue) {
    // 注册全局的通用栏组件对象
    Vue.component('PageTools', PageTools)
    Vue.component('UploadExcel', UploadExcel)
    // 注册导入图片上传组件
    Vue.component('ImageUpload', ImageUpload)
    // 注册打印组件
    Vue.use(Print)
    // 注册全屏组件
    Vue.component('ScreenFull', ScreenFull) 
    // 注册动态主题
    Vue.component('ThemePicker', ThemePicker)
    // 注册多语言
    Vue.component('LangSelect', LangSelect)
    // 注册多页签
    Vue.component('TagsView', TagsView)
  }
}