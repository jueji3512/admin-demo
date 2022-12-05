<template>
  <!-- 新增部门的弹层 -->
  <el-dialog title="新增部门" :visible="showDialog" @close="btnCancel">
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form ref="deptForm" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="部门名称" prop="name">
        <el-input
          style="width: 80%"
          placeholder="1-50个字符"
          v-model="formData.name"
        />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input
          style="width: 80%"
          placeholder="1-50个字符"
          v-model="formData.code"
        />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <!-- 此时在控制台会有一个报错，是因为el-select组件需要绑定v-model，不影响，后面做表单校验的时候会添加 -->
        <el-select
          style="width: 80%"
          placeholder="请选择"
          v-model="formData.manager"
          @focus="getEmployeeSimple"
        >
          <el-option
            v-for="item in people"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          style="width: 80%"
          placeholder="1-300个字符"
          type="textarea"
          :rows="3"
          v-model="formData.introduce"
        />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button @click="btnOK" type="primary" size="small">确定</el-button>
        <el-button @click="btnCancel" size="small">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { addDepartments, getDepartDetail, getDepartments } from "@/api/departments";
import { getEmployeeSimple } from "@/api/employees";
export default {
  data() {
    // 下面的两处很重要
    // 此处为了避免同部门下的子部门名字重复
    const checkNameRepeat = async(rule, value, callback) => {
      // 先要获取最新的组织架构数据
      const { depts } = await getDepartments()
      // 这里需要分清楚是新增还是编辑
      let isRepeat = false
      if (this.formData.id) {
        // 有id就是编辑，这里不同的是，编辑不要把自己算在内
        isRepeat = depts.filter(item => item.id !== this.treeNode.id && item.pid === this.treeNode.id).some(item => item.name === value)
      } else {
        // 没id就是新增
        isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      }

      isRepeat ? callback(new Error(`同级部门下已经有${value}的部门了`)) : callback()
    }
    // 检查编码重复
    const checkCodeRepeat = async(rule, value, callback) => {
      // 先要获取最新的组织架构数据
      // 同样要对编辑和新增做不同情况的处理
      const { depts } = await getDepartments()
      
      let isRepeat = false
      if (this.formData.id) {
        // 编辑
        isRepeat = depts.some(item => item.id !== this.treeNode.id && item.code === value && value)
      } else {
        // 新增
        isRepeat = depts.some(item => item.code === value && value) // 这里加一个 value不为空 因为我们的部门有可能没有code
      }

      isRepeat ? callback(new Error(`组织架构中已经有部门使用${value}编码`)) : callback()
    }

    return {
      people: [],
      formData: {
        // 分别为：部门名、部门编码、部门负责人、部门介绍
        name: "",
        code: "",
        manager: "",
        introduce: "",
      },
      rules: {
        name: [
          { required: true, message: "部门名称不能为空", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "部门名称要求1-50个字符",
            trigger: "blur",
          },
          {
            trigger: "blur",
            validator: checkNameRepeat, // 自定义函数的形式校验
          },
        ],
        code: [
          { required: true, message: "部门编码不能为空", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "部门编码要求1-50个字符",
            trigger: "blur",
          },
          {
            trigger: "blur",
            validator: checkCodeRepeat,
          },
        ],
        manager: [
          { required: true, message: "部门负责人不能为空", trigger: "blur" },
        ],
        introduce: [
          { required: true, message: "部门介绍不能为空", trigger: "blur" },
          {
            trigger: "blur",
            min: 1,
            max: 300,
            message: "部门介绍要求1-50个字符",
          },
        ],
      },
    };
  },
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    treeNode: {
      type: Object,
      default: null,
    },
  },
  methods: {
    // 获取员工简单数据
    async getEmployeeSimple() {
      this.people = await getEmployeeSimple();
    },
    // 完成按钮，提交
    btnOK() {
      this.$refs.deptForm.validate(async isOK => {
        // 如果手动校验成功，即可提交
        if(isOK) {
          // 要分清楚现在是编辑还是新增
          if (this.formData.id) {
            // 编辑
            await updateDepartments(this.formData)
          } else {
            // 新增
            await addDepartments({ ...this.formData, pid: this.treeNode.id }) 
          }
          // 视情况处理后提交
          this.$emit('addDepts') // 告诉父组件新增数据成功，重新拉取数据
          this.$emit('update:showDialog', false)
        }
      })
    },
    // 取消按钮，关掉页面
    btnCancel() {
      // 由于resetFields只能重置表单数据，而非表单如id数据不能重置，故在这里重置一下
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      // 重置校验字段
      this.$refs.deptForm.resetFields()
      // 关闭新增页面
      this.$emit('update:showDialog', false)
    },
    // 获取部门详细信息
    async getDepartDetail(id) {
      this.formData = await getDepartDetail(id)
    }
  },
};
</script>
