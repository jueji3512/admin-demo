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
      :before-upload="beforeUpload"
      :http-request="upload"
      :class="{ disabled: fileComputed }"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress
      v-if="showPercent"
      style="width: 180px"
      :percentage="percent"
    />
    <el-dialog title="图片预览" :visible.sync="showDialog">
      <img :src="imgUrl" style="width: 100%" alt="" />
    </el-dialog>
  </div>
</template>

<script>
/*
此处代码逻辑比较复杂，我们稍微理清一下思路：我们覆盖了原本的上传行为，并将其上传至腾讯云处理
el-upload有一个file-list属性，即上传的文件列表，我们设置了一个this.filelist

1.在上传之前，会触发before-upload钩子，连接到我们自己定义的检查图片类型和大小的方法，校验通过后
将该文件的uid赋给currentFileUid,且使加载条显现

2.同时，将触发on-change钩子（文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用）
同样是我们自己设定的addFile方法，this.fileList开始为空数组
而我们使fileList（on-chage内传的参数）赋给this.fileList，即让该数组变为了含新增的图片文件的数组
注意，这里的作用是让页面上显示选择的图片（不影响上传），因为fileList是包含需显示的img标签url的

3.上传时，前面说过了，我们覆盖了原上传行为（设置http-request），触发upload方法，即将其连接到腾讯云
的个人存储桶，此后返回成功或失败。若上传成功，则将此次上传成功的图片文件的url转为腾讯云的地址而非本地地址
*/

import COS from "cos-js-sdk-v5";
const cos = new COS({
  SecretId: "AKID0oPK9k7nY9j6D5i5CJEtCHCuQhnvue8P",
  SecretKey: "8NQGrhHchY8gFYbPxJTR9bmtvoSr1xfL",
});
export default {
  data() {
    return {
      fileList: [],
      showDialog: false,
      imgUrl: "",
      currentFileUid: "",
      percent: 0,
      showPercent: false,
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
      this.fileList = this.fileList.filter((item) => item.uid !== file.uid);
    },
    // 添加文件
    addFile(file, fileList) {
      this.fileList = fileList;
    },
    // 上传之前的文件检查，控制文件大小和类型
    beforeUpload(file) {
      // 检查类型
      const type = ["image/jpeg", "image/gif", "image/bmp", "image/png"];
      if (!type.some((item) => item === file.type)) {
        this.$message.error("上传的文件类型只能是jpg、gif、bmp、png格式");
        return false;
      }
      // 检查大小
      const maxsize = 5 * 1024 * 1024;
      if (file.size > maxsize) {
        this.$message.error("上传的图片大小不能超过5M");
        return false;
      }
      // 到这里即校验通过
      this.currentFileUid = file.uid;
      this.showPercent = true;
      return true;
    },
    // 覆盖默认的上传行为
    upload(params) {
      if (params.file) {
        // 这里要写自己个人的各个信息
        cos.putObject(
          {
            // 存储桶名称
            Bucket: "jueji-1315959087",
            // 所属地域
            Region: "ap-nanjing",
            // 文件名
            Key: params.file.name,
            // 要上传的文件对象
            Body: params.file,
            // 上传的模式类型，直接默认标准模式即可
            StorageClass: "STANDARD",
            // 上传进度监听
            onProgress: (params) => {
              this.percent = params.percent * 100;
            },
          },
          (err, data) => {
            console.log(err || data);
            if (!err && data.statusCode === 200) {
              // 表示文件确实上传成功了
              this.fileList = this.fileList.map((item) => {
                if (item.uid === this.currentFileUid) {
                  // 将此次上传的图片的地址放入数组中，并且给它设置一个已上传的标志以便员工资料里的保存操作处理
                  return { url: "http://" + data.Location, upload: true };
                }
                return item;
              });
              setTimeout(() => {
                this.showPercent = false;
                this.percent = 0;
              }, 1000);
            }
          }
        );
      }
    },
  },
  computed: {
    fileComputed() {
      return this.fileList.length === 1;
    },
  },
};
</script>

<style>
.disabled .el-upload--picture-card {
  display: none;
}
</style>

