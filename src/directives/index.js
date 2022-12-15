// 该文件负责管理所有自定义指令

export const imagerror = {
  // 指令对象inserted，会在当前的dom元素插入到节点之后执行
  inserted(dom, options) {
    // options是指令中的变量的解释，其中有一个属性叫做value
    // dom表示当前指令作用的dom对象
    // 因为我们是要解决图片的异常问题，故这里的dom对象就是图片

    // 下面是处理图片有地址的情况，这里则可以处理没考虑到的：图片没有地址的情况
    dom.src = dom.src || options.value

    // 当图片有地址，但是地址没有加载成功的时候会报错，故会触发图片的一个事件onerror
    // 当图片出现异常的时候(地址的图片销毁了或不能用了之类的)，会将指令配置的默认图片设置为该图片显示的内容
    dom.onerror = function() { 
      // 这里不能写死为一个固定路径，需要用参数传
      // 在img设置该自定义指令v-imagerror时，后面跟的=""，引号中的即为options的value值
      dom.src = options.value 
    }
  },
  componentUpdated(dom, options) {
    dom.src = dom.src || options.value
  }
}
