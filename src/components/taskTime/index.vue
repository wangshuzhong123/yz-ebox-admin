<template>
  <el-radio-group v-model="type" @change="handleDayChange">
    <div>
        <el-radio style="width:30px;" :label="1">每天</el-radio>
        <el-input-number
          v-if="type==1" 
          v-model="day" 
          @change="handleDayChange" 
          style="width:100px;marginRight:10px"  
          controls-position="right"  
          :min="1" 
          :max="100">
         </el-input-number>
        <el-time-picker 
          v-if="type==1" 
          v-model="time" 
          @change="handleDayChange" 
          format="HH:mm" 
          :clearable="false"
          style="width:100px;" 
         >
        </el-time-picker>
    </div>
    <div>
        <el-radio style="width:30px;" :label="2">每周</el-radio>
        <el-select 
          v-if="type==2" 
          v-model="day" 
          @change="handleDayChange" 
          style="width:100px;marginRight:10px" >
          <el-option v-for="item in dateList" :key="item.key" :label="item.value" :value="item.key"></el-option>
        </el-select>
        <el-time-picker 
          v-if="type==2" 
          v-model="time"
          @change="handleDayChange"  
          format="HH:mm" 
          :clearable="false"
          style="width:100px;" 
          >
         </el-time-picker>
    </div>
    <div>
        <el-radio style="width:30px;" :label="3">每月</el-radio>
        <el-select 
          v-if="type==3" 
          v-model="day" 
          @change="handleDayChange"
           style="width:100px;marginRight:10px">
          <el-option  v-for="item in 31" :key="item" :label="item" :value="item"></el-option>
        </el-select>
        <el-time-picker 
          v-if="type==3"
          v-model="time" 
          @change="handleDayChange" 
          format="HH:mm" 
          :clearable="false"
          style="width:100px;"
          >
         </el-time-picker>
    </div>
  </el-radio-group>
</template>

<script>
  import { formatTime } from '@/filters/index'
  export default {
    name: 'TaskTimeCom',
    props: {
      value: {
        type: String
      }
    },
    data() {
      return {
        type: 0,
        day: 1,
        dateList: [
          { key: 0, value: '日' },
          { key: 1, value: '一' },
          { key: 2, value: '二' },
          { key: 3, value: '三' },
          { key: 4, value: '四' },
          { key: 5, value: '五' },
          { key: 6, value: '六' }
        ],
        time: new Date()
      }
    },
    watch: {
      value: function(newValue, oldValue) {
        console.log(newValue)
        console.log(oldValue)
        var nowDate = new Date().getTime()
        var time = (newValue + '' || '').split('~')
        this.type = time[0] ? time[0] : 1
        this.type = +this.type
        this.day = time[1] ? time[1] : 1
        this.day = +this.day
        if (time[2].length === 5) {
          var times = time[2]
          this.time = formatTime(nowDate) + ' ' + times
        } else {
          var nowTime = formatTime(nowDate, 5)
          this.time = formatTime(nowDate) + ' ' + nowTime
        }
      }
    },
    mounted() {
      this.type = 1
      this.handleDayChange()
    },
    methods: {
      handleDayChange() {
        if (this.type === 2 && this.day > 7) { this.day = 0 }
        if (this.type !== 2 && this.day === 0) { this.day = 1 }
        this.time = new Date(this.time)
        var times = this.time ? formatTime(this.time, 5) : ''
        var time = null
        if (!times) {
          time = ''
        } else {
          time = (this.type ? this.type : '') + '~' + (this.day ? this.day : '') + '~' + times
        }
        console.log(time)
        this.$emit('event', time)
      }
    }
  }
</script>

<style scoped></style>
