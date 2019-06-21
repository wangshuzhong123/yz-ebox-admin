<template>
  <el-select 
    v-model="ids" 
    :clearable="false"
    multiple 
    filterable 
    placeholder="输入关键字进行查找" 
    @change="handleChange" 
    style="width:100%" 
    remote 
    :loading="loading" 
    :remote-method="remoteMethod">
    <el-option v-for="x in list" :key="x.key" :label="x.value" :value="x.key" ></el-option>
  </el-select>
</template>

<script>
  import { GetReceiverList } from '@/api/requestConfig'
  export default {
    name: 'Receiver',
    props: ['value'],
    data() {
      return {
        list: [],
        ids: [],
        loading: false
      }
    },
    watch: {
      value: function(newValue, oldValue) {
        var self = this
        !oldValue && GetReceiverList({ ReceiverIds: newValue }).then(function(res) {
          self.list = res.data
          self.ids = newValue
        })
      }
    },
    methods: {
      handleChange(e) {
        this.$emit('event', e)
      },
      remoteMethod(keywords) {
        var self = this
        self.loading = true
        GetReceiverList({ RealName: keywords }).then(function(res) {
          self.loading = false
          self.list = res.data
        })
      }
    }
  }
</script>

<style scoped></style>
