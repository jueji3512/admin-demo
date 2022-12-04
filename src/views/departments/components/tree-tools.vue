<template>
  <!-- 用了一个行列布局 -->
  <el-row
    type="flex"
    justify="space-between"
    align="middle"
    style="height: 40px; width: 100%"
  >
    <el-col>
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <!-- 两个内容 -->
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <!-- 下拉菜单 element -->
          <el-dropdown @command="operateDepts">
            <span
              >操作
              <i class="el-icon-arrow-down" />
            </span>
            <!-- 下拉菜单 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <!-- 编辑部门和删除部门只会在子节点上显示 -->
              <el-dropdown-item v-if="!isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="del">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments'
// 该组件需要对外开放属性,外部需要提供一个对象,对象里需要包含name和manager
export default {
  props: {
    treeNode: {
      type: Object,
      // 必须传入
      required: true,
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 操作节点
    operateDepts(type) {
      if (type === 'add') {
        // 添加子部门操作
      } else if (type === 'edit') {
        // 编辑操作
      } else {
        // 删除操作
        this.$confirm('确定要删除该部门吗').then(() => {
          // 如果点击了确定就会进入then
          return delDepartments(this.treeNode.id) // 返回promise对象
        }).then(() => {
          // 如果删除成功了就会进入第二个then
          // 我们让它触发自定义事件子传父,让父组件重新获取最新组织架构数据
          this.$emit('delDepts') 
          this.$message.success('删除部门成功')
        })
      }
    }
  }
};
</script>

<style>
</style>