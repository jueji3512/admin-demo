<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools>
        <template v-slot:after>
          <el-button
            type="primary"
            size="small"
            @click="addPermission(1, '0')"
            >添加权限</el-button
          >
        </template>
      </page-tools>
      <el-table :data="list" border="" row-key="id">
        <el-table-column align="center" label="名称" prop="name" />
        <el-table-column align="center" label="标识" prop="code" />
        <el-table-column align="center" label="描述" prop="description" />
        <el-table-column align="center" label="操作">
          <template slot-scope="{ row }">
            <el-button
              type="text"
              v-if="row.type === 1"
              @click="addPermission(2, row.id)"
              @close="btnCancel"
              >添加</el-button
            >
            <el-button type="text" @click="editPermission(row.id)" @close="btnCancel"
              >编辑</el-button
            >
            <el-button type="text" @click="delPermission(row.id)" @close="btnCancel"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :title="`${showText}权限`"
      :visible="showDialog"
      @close="btnCancel"
    >
      <!-- 表单 -->
      <el-form
        ref="permForm"
        :model="formData"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" style="width: 90%" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" style="width: 90%" />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="formData.description" style="width: 90%" />
        </el-form-item>
        <el-form-item label="开启">
          <el-switch
            v-model="formData.enVisible"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
          <el-button size="small" @click="btnCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { tranListToTreeData } from "@/utils";
import {
  updatePermission,
  addPermission,
  getPermissionDetail,
  delPermission,
  getPermissionList,
} from "@/api/permission";
export default {
  data() {
    return {
      list: [],
      formData: {
        name: "",
        code: "",
        description: "",
        /* 
        这里type注意下，根据需求，我们这里只设定两个权限，其中1表示访问权限，2表示按钮权限
        上面的添加权限按钮表示一个页面的访问权限，故必须传入type为1
        下面的添加按钮表示某个页面下属按钮的按钮权限，故必须传入type为2
        */
        type: "",
        pid: "",
        enVisble: "0",
      },
      rules: {
        name: [{ require: true, message: "权限名称不能为空", trigger: "blur" }],
        code: [{ require: true, message: "权限标识不能为空", trigger: "blur" }],
      },
      showDialog: false,
    };
  },
  computed: {
    showText() {
      return this.formData.id ? "编辑" : "新增";
    },
  },
  created() {
    this.getPermissionList();
  },
  methods: {
    // 获取权限列表
    async getPermissionList() {
      this.list = tranListToTreeData(await getPermissionList(), "0");
    },
    // 新增权限
    async addPermission(type, pid) {
      this.formData.pid = pid;
      this.formData.type = type;
      this.showDialog = true;
    },
    // 编辑权限
    async editPermission(id) {
      this.formData = await getPermissionDetail(id);
      this.showDialog = true;
    },
    // 删除操作
    async delPermission(id) {
      try {
        await this.$confirm("确定要删除该数据吗");
        await delPermission(id);
        this.getPermissionList();
        this.$message.success("删除成功");
      } catch (error) {
        console.log(error);
      }
    },
    btnOK() {
      this.$refs.permForm
        .validate()
        .then(() => {
          if (this.formData.id) {
            // 修改权限
            return updatePermission(this.formData);
          } else {
            return addPermission(this.formData);
          }
        })
        .then(() => {
          this.$message.success("操作成功");
          this.getPermissionList();
          this.showDialog = false;
        });
    },
    btnCancel() {
      this.formData = {
        name: "",
        code: "",
        description: "",
        type: "",
        pid: "",
        enVisible: "0",
      };
      this.$refs.permForm.resetFields();
      this.showDialog = false;
    },
  },
};
</script>

<style>
</style>