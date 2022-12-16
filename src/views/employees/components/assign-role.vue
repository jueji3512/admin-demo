<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="btnCancel">
    <el-checkbox-group v-model="roleIds">
      <!-- 这里注意一下，我们显示的是角色名称，但需要存储的是角色id，故这里label是item.id -->
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6" :pull="1">
        <el-button size="small" type="primary" @click="btnOK">确定</el-button>
        <el-button size="small" @click="btnCancel" style="margin-left: 20px">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from "@/api/setting";
import { getUserDetailById } from "@/api/user";
import { assignRoles } from "@/api/employees";
export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: String,
      default: null,
    },
  },
  created() {
    this.getRoleList();
  },
  data() {
    return {
      list: [],
      roleIds: [],
    };
  },
  methods: {
    async getRoleList() {
      // 这里默认只取十个角色
      const { rows } = await getRoleList({ page: 1, pagesize: 10 });
      this.list = rows;
    },
    async getUserDetailById(id) {
      const { roleIds } = await getUserDetailById(id);
      this.roleIds = roleIds;
    },
    async btnOK() {
      await assignRoles({ id: this.userId, roleIds: this.roleIds });
      this.$emit("update:showRoleDialog", false);
      this.$message.success("分配员工角色成功");
    },
    btnCancel() {
      (this.roleIds = []), this.$emit("update:showRoleDialog", false);
    },
  },
};
</script>

<style>
</style>