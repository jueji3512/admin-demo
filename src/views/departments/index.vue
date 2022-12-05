<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <tree-tools :treeNode="company" :isRoot="true" @addDepts="addDepts"/>
        <el-tree
          :data="departs"
          :props="defaultProps"
          :default-expand-all="true"
        >
          <tree-tools
            slot-scope="{ data }"
            :treeNode="data"
            @delDepts="getDepartments"
            @addDepts="addDepts"
            @editDepts="editDepts"
          />
        </el-tree>
      </el-card>
    </div>
    <!-- 前面的showDialog是addDept组件的接收的属性名，后面的是当前组件定义的变量名 -->
    <add-dept
      ref="addDept"
      :showDialog.sync="showDialog"
      :treeNode="node"
      @addDepts="getDepartments"
    />
  </div>
</template>

<script>
import treeTools from "./components/tree-tools.vue";
import { getDepartments } from "@/api/departments";
import { tranListToTreeData } from "@/utils";
import AddDept from "./components/add-department.vue";

export default {
  components: { treeTools, AddDept },
  data() {
    return {
      company: { name: "某某某公司", manager: "负责人", id: "" },
      departs: [],
      defaultProps: {
        label: "name", // 表示 从这个属性显示内容
      },
      showDialog: false,
      // 记录当前点击的node结点
      node: null,
    };
  },
  created() {
    this.getDepartments();
  },
  methods: {
    async getDepartments() {
      const result = await getDepartments();
      this.departs = tranListToTreeData(result.depts, "");
      // console.log(result)
    },
    addDepts(node) {
      this.showDialog = true;
      this.node = node;
    },
    editDepts(node) {
      this.showDialog = true
      this.node = node
      this.$refs.addDept.getDepartDetail(node.id)
    }
  },
  computed: {
    // 因为我们是复用的新增子部门和编辑部门的界面
    // 故需要根据计算属性，区分当前显示的标题
    showTitle() {
      return this.formData.id ? '编辑部门' : '新增部门'
    }
  }
};
</script>

<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>