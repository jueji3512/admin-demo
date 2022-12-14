<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <demo></demo>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// demo
import demo from '@/components/ImageUpload'
export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  components: {
    demo
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
