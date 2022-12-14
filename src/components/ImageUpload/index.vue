<template>
  <div>
    <el-upload
      list-type="picture-card"
      :limit="1"
      action="#"
      :on-preview="preview"
      :on-remove="handleRemove"
      :on-change="addFile"
      :file-list="fileList"
      :class="{ disabled: fileComputed }"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog title="图片预览" :visible.sync="showDialog">
      <img :src="imgUrl" style="width:100%" alt="">
   </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fileList: [
        {
          url: "https://gd-hbimg.huaban.com/ac0a31c40258c1ca0b8c19544935f57df4545367b641b-NCbRnu",
        },
      ],
      showDialog: false,
      imgUrl: "",
    };
  },
  methods: {
    preview(file) {
      this.imgUrl = file.url;
      this.showDialog = true;
    },
    // 删除文件
    handleRemove(file) {
      // 移除fileList数组中当前图片文件
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
    },
    // 添加文件
    addFile(file, fileList) {
      console.log('fileList',fileList)
      console.log('this.fileList',this.fileList)
      this.fileList = fileList
      console.log('fileList',fileList)
      console.log('this.fileList',this.fileList)
    }
  },
  computed: {
    fileComputed() {
      return this.fileList.length === 1
    }
  }
};
</script>

<style>
.disabled .el-upload--picture-card {
  display: none
}
</style>