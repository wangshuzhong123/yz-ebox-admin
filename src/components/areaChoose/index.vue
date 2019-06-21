<!--select地区选择组件-->
<template>
  <span>
    <template v-if="type > 0 && provinceFlag">
      <el-select v-model="provinceVal" @change="changeProvince" placeholder="请选择">
        <el-option label="请选择" value=""></el-option>
        <el-option v-for="item in provinceList" :key="item.code" :label="item.name" :value="item.code"></el-option>
      </el-select>
    </template>
    <template v-if="type > 1 && cityFlag">
      <el-select v-if="cityList.length > 0" v-model="cityVal" @change="changeCity" placeholder="请选择">
        <el-option label="请选择" value=""></el-option>
        <el-option v-for="item in cityList" :key="item.code" :label="item.name" :value="item.code"></el-option>
      </el-select>
    </template>
    <template v-if="type > 2 && countyFlag">
      <el-select v-if="countyList.length > 0" v-model="countyVal" @change="changeCounty" placeholder="请选择">
        <el-option label="请选择" value=""></el-option>
        <el-option v-for="item in countyList" :key="item.code" :label="item.name" :value="item.code"></el-option>
      </el-select>
    </template>
    <template v-if="type > 3 && streetFlag">
      <el-select v-if="streetList.length > 0" v-model="streetVal" @change="changeStreet" placeholder="请选择">
        <el-option label="请选择" value=""></el-option>
        <el-option v-for="item in streetList" :key="item.code" :label="item.name" :value="item.code"></el-option>
      </el-select>
    </template>
    <template v-if="type > 4 && communityFlag">
      <el-select v-if="communityList.length > 0" v-model="communityVal" @change="changeCommunity" placeholder="请选择">
        <el-option label="请选择" value=""></el-option>
        <el-option v-for="item in communityList" :key="item.code" :label="item.name" :value="item.code"></el-option>
      </el-select>
    </template>
    <template v-if="type > 5 && houseFlag">
      <el-select v-if="houseList.length > 0" v-model="houseVal" @change="houseInfo" placeholder="请选择">
        <el-option label="请选择" value=""></el-option>
        <el-option v-for="(item,i) in houseList" :key="i" :label="item.house.name" :value="i"></el-option>
      </el-select>
    </template>
  </span>
</template>

<script>
  import { getAreaList, getCommunityByStreet, getHoseListByArea } from '@/api/requestConfig' // 引入api接口
  export default {
    data() {
      return {
        areaData: '', // 权限地区
        areaType: 'ALL', // 权限级别
        provinceList: [], // 省的列表
        provinceVal: '', // 省的code
        provinceFlag: true, // 省的权限
        cityList: [], // 市的列表
        cityVal: '', // 市的code
        cityFlag: true, // 市的权限
        countyList: [], // 县的列表
        countyVal: '', // 县的code
        countyFlag: true, // 县的权限
        streetList: [], // 街道数据
        streetVal: '', // 街道code
        streetFlag: true, // 街道的权限
        communityList: [], // 社区数据
        communityVal: '', // 社区code
        communityFlag: true, // 社区的权限
        houseList: [], // 房屋
        houseVal: '', // 房屋code
        houseFlag: true, // 房屋的权限
        houseId: '', // 房屋id
        houseName: '', // 房屋名称
        areaInfo: '' // 房屋地址
      }
    },
    props: {
      type: Number, // 代表有几层地区
      status: String
    },
    created() {
      this.areaData = JSON.parse(window.sessionStorage.getItem('roleArea'))
      if (this.areaData.type) {
        this.areaType = this.areaData.type
      }
      this.showSelectByAreaType(this.areaType)
    },
    methods: {
      // 根据级别操作地区
      showSelectByAreaType(areaType) {
        switch (areaType) {
          case 'ALL':
            this.provinceList = this.areaData
            break
          case 'PROVINCE':
            this.provinceFlag = false
            this.provinceVal = this.areaData.code
            if (this.areaData.sub[0].type === 'CITY') {
              this.cityList = this.areaData.sub
            } else {
              this.cityFlag = false
              this.countyList = this.areaData.sub
            }
            break
          case 'CITY':
            this.provinceFlag = false
            this.cityFlag = false
            this.provinceVal = this.areaData.parentCode
            this.cityVal = this.areaData.code
            this.countyList = this.areaData.sub
            break
          case 'COUNTY':
            this.provinceFlag = false
            this.cityFlag = false
            this.countyFlag = false
            this.countyVal = this.areaData.code
            this.streetList = this.areaData.sub
            var parCode = (this.areaData.parentCode).toString()
            var threeCode = parCode.substr(0, 3)
            // 判断是否是直辖市
            if (threeCode === '110' || threeCode === '120' || threeCode === '310' || threeCode === '500' || threeCode === '810' || threeCode === '820') {
              this.provinceVal = this.areaData.parentCode
            } else {
              this.cityVal = this.areaData.parentCode
            }
            break
          case 'STREET':
            this.provinceFlag = false
            this.cityFlag = false
            this.countyFlag = false
            this.streetFlag = false
            this.countyVal = this.areaData.parentCode
            this.streetVal = this.areaData.code
            this.communityList = this.areaData.sub
            break
          case 'COMMUNITY':
            this.provinceFlag = false
            this.cityFlag = false
            this.countyFlag = false
            this.streetFlag = false
            this.communityFlag = false
            this.streetVal = this.areaData.parentCode
            this.communityVal = this.areaData.code
            this.houseList = this.areaData.sub
            break
          case 'HOUSE':
            break
          default:
            console.log(areaType)
        }
      },
      // 改变省
      changeProvince() {
        this.cityVal = ''
        this.countyVal = ''
        this.streetVal = ''
        this.communityVal = ''
        this.houseVal = ''
        if (this.provinceVal) {
          if (this.areaType === 'ALL') {
            // 请求市区数据
            getAreaList(this.provinceVal).then(res => {
              if (res.status === 200) {
                if (res.data[0].type === 'CITY') {
                  this.cityList = res.data
                  this.countyList.splice(0)
                  this.streetList.splice(0)
                  this.communityList.splice(0)
                  this.houseList.splice(0)
                } else if (res.data[0].type === 'COUNTY') {
                  this.countyList = res.data
                  this.cityList.splice(0)
                  this.streetList.splice(0)
                  this.communityList.splice(0)
                  this.houseList.splice(0)
                }
              } else {
                this.$message.error(res.message)
              }
            })
          }
        } else {
          this.cityList.splice(0)
          this.countyList.splice(0)
          this.streetList.splice(0)
          this.communityList.splice(0)
          this.houseList.splice(0)
        }
        this.outputAreaInfo()
      },
      changeCity() {
        this.countyVal = ''
        this.streetVal = ''
        this.communityVal = ''
        this.houseVal = ''
        if (this.cityVal) {
          if (this.areaType === 'ALL') {
            // 请求县数据
            getAreaList(this.cityVal).then(res => {
              if (res.status === 200) {
                this.countyList = res.data
                this.streetList.splice(0)
                this.communityList.splice(0)
                this.houseList.splice(0)
              } else {
                this.$message.error(res.message)
              }
            })
          } else {
            if (this.areaType === 'PROVINCE') {
              var countyData = JSON.parse(window.sessionStorage.getItem('roleArea')).sub
              for (var i = 0; i < countyData.length; i++) {
                if (countyData[0].type === 'CITY') {
                  if (this.cityVal === countyData[i].code) {
                    this.countyList = countyData[i].sub
                    this.streetList.splice(0)
                    this.communityList.splice(0)
                    this.houseList.splice(0)
                    break
                  }
                } else {
                  if (this.countyVal === countyData[i].code) {
                    this.streetList = countyData[i].sub
                    this.communityList.splice(0)
                    this.houseList.splice(0)
                    break
                  }
                }
              }
            }
          }
        } else {
          this.countyList.splice(0)
          this.streetList.splice(0)
          this.communityList.splice(0)
          this.houseList.splice(0)
        }
        this.outputAreaInfo()
      },
      // 改变县
      changeCounty() {
        this.streetVal = ''
        this.communityVal = ''
        this.houseVal = ''
        if (this.countyVal) {
          if (this.areaType === 'ALL') {
            getAreaList(this.countyVal).then(res => {
              if (res.status === 200) {
                this.streetList = res.data
                this.communityList.splice(0)
                this.houseList.splice(0)
              } else {
                this.$message.error(res.message)
              }
            })
          } else {
            if (this.areaType === 'CITY') {
              var streetData = JSON.parse(window.sessionStorage.getItem('roleArea')).sub
              for (var i = 0; i < streetData.length; i++) {
                if (streetData[i].code === this.countyVal) {
                  this.streetList = streetData[i].sub
                  this.communityList.splice(0)
                  this.houseList.splice(0)
                  break
                }
              }
            } else if (this.areaType === 'PROVINCE') {
              var strData = JSON.parse(window.sessionStorage.getItem('roleArea')).sub
              if (strData[0].type === 'CITY') {
                for (var j = 0; j < strData.length; j++) {
                  if (strData[j].code === this.cityVal) {
                    var ctList = strData[j].sub
                    for (var k = 0; k < ctList.length; k++) {
                      if (this.countyVal === ctList[k].code) {
                        this.streetList = ctList[k].sub
                        this.communityList.splice(0)
                        this.houseList.splice(0)
                        break
                      }
                    }
                  }
                }
              } else {
                for (var x = 0; x < strData.length; x++) {
                  if (strData[x].code === this.countyVal) {
                    this.streetList = strData[x].sub
                    this.communityList.splice(0)
                    this.houseList.splice(0)
                    break
                  }
                }
              }
            }
          }
        } else {
          this.streetList.splice(0)
          this.communityList.splice(0)
          this.houseList.splice(0)
        }
        this.outputAreaInfo()
      },
      // 改变街道获取社区
      changeStreet() {
        this.communityVal = ''
        this.houseVal = ''
        if (this.streetVal) {
          if (this.areaType === 'ALL') {
            // 获取社区
            getCommunityByStreet(this.streetVal).then(res => {
              if (res.status === 200) {
                this.communityList = res.data
                this.houseList.splice(0)
              } else {
                this.$message.error(res.message)
              }
            })
          } else {
            if (this.areaType === 'COUNTY') {
              var streetData = JSON.parse(window.sessionStorage.getItem('roleArea')).sub
              for (var i = 0; i < streetData.length; i++) {
                if (streetData[i].code === this.streetVal) {
                  this.communityList = streetData[i].sub
                  this.houseList.splice(0)
                  break
                }
              }
            } else if (this.areaType === 'CITY') {
              var strData = JSON.parse(window.sessionStorage.getItem('roleArea')).sub
              for (var j = 0; j < strData.length; j++) {
                if (strData[j].code === this.countyVal) {
                  var ctList = strData[j].sub
                  for (var k = 0; k < ctList.length; k++) {
                    if (this.streetVal === ctList[k].code) {
                      this.communityList = ctList[k].sub
                      this.houseList.splice(0)
                      break
                    }
                  }
                }
              }
            } else if (this.areaType === 'PROVINCE') {
              var stData = JSON.parse(window.sessionStorage.getItem('roleArea')).sub
              if (stData[0].type === 'CITY') {
                for (var x = 0; x < stData.length; x++) {
                  if (stData[x].code === this.cityVal) {
                    var cList = stData[x].sub
                    for (var y = 0; y < cList.length; y++) {
                      if (this.countyVal === cList[y].code) {
                        var list = cList[y].sub
                        for (var z = 0; z < list.length; z++) {
                          if (this.streetVal === list[z].code) {
                            this.communityList = list[z].sub
                            this.houseList.splice(0)
                            break
                          }
                        }
                      }
                    }
                  }
                }
              } else {
                var zData = JSON.parse(window.sessionStorage.getItem('roleArea')).sub
                for (var n = 0; n < zData.length; n++) {
                  if (zData[n].code === this.countyVal) {
                    var nList = zData[n].sub
                    for (var m = 0; m < nList.length; m++) {
                      if (this.streetVal === nList[m].code) {
                        this.communityList = nList[m].sub
                        this.houseList.splice(0)
                        break
                      }
                    }
                  }
                }
              }
            }
          }
        } else {
          this.communityList.splice(0)
          this.houseList.splice(0)
        }
        this.outputAreaInfo()
      },
      // 改变社区
      changeCommunity() {
        this.houseVal = ''
        if (this.communityVal) {
          // 获取房屋
          var needData = {}
          needData.communityCode = this.communityVal
          getHoseListByArea(needData).then(res => {
            if (res.status === 200) {
              this.houseList = res.data
            } else {
              this.$message.error(res.message)
            }
          })
        } else {
          this.houseList.splice(0)
        }
        this.showSelectByAreaType(this.areaType)
        this.outputAreaInfo()
      },
      // 改变房屋获取房屋信息
      houseInfo() {
        if (this.houseVal !== '') {
          var thisHouseInfo = this.houseList[this.houseVal]
          this.houseId = thisHouseInfo.house.id
          this.houseName = thisHouseInfo.house.name
          if (thisHouseInfo.city) {
            this.areaInfo = thisHouseInfo.province + thisHouseInfo.city + thisHouseInfo.county + thisHouseInfo.street + thisHouseInfo.community + thisHouseInfo.house.name
          } else {
            this.areaInfo = thisHouseInfo.province + thisHouseInfo.county + thisHouseInfo.street + thisHouseInfo.community + thisHouseInfo.house.name
          }
        } else {
          this.areaInfo = ''
          this.houseId = ''
          this.houseName = ''
        }
        this.outputAreaInfo()
      },
      // 输出地区信息
      outputAreaInfo() {
        var outputInfo = {
          provinceList: this.provinceList,
          provinceCode: this.provinceVal,
          cityList: this.cityList,
          cityCode: this.cityVal,
          countyList: this.countyList,
          countyCode: this.countyVal,
          streetList: this.streetList,
          streetCode: this.streetVal,
          communityList: this.communityList,
          communityCode: this.communityVal,
          houseId: this.houseId,
          houseName: this.houseName,
          areaInfo: this.areaInfo
        }
        this.$emit('areainfo', outputInfo)
      },
      // 渲染地区
      renderAreaInfo(provinceCode, cityCode, countyCode, streetCode, communityCode) {
        this.provinceVal = provinceCode
        this.cityVal = cityCode
        this.countyVal = countyCode
        this.streetVal = streetCode
        this.communityVal = communityCode
      },
      // 清空已选择的信息
      clearAreaInfo() {
        if (this.areaType === 'ALL') {
          this.provinceVal = ''
          this.cityList.splice(0)
          this.cityVal = ''
          this.countyList.splice(0)
          this.countyVal = ''
          this.streetList.splice(0)
          this.streetVal = ''
          this.communityList.splice(0)
          this.communityVal = ''
          this.houseVal = ''
          this.houseList.splice(0)
          this.houseId = ''
          this.houseName = ''
          this.areaInfo = ''
        } else if (this.areaType === 'PROVINCE') {
          this.provinceVal = ''
          if (this.areaData.sub[0].type === 'CITY') {
            this.cityVal = ''
            this.countyList.splice(0)
            this.countyVal = ''
          } else {
            this.cityVal = ''
            this.countyVal = ''
          }
          this.streetList.splice(0)
          this.streetVal = ''
          this.communityList.splice(0)
          this.communityVal = ''
          this.houseVal = ''
          this.houseList.splice(0)
          this.houseId = ''
          this.houseName = ''
          this.areaInfo = ''
        } else if (this.areaType === 'CITY') {
          this.provinceVal = ''
          this.cityVal = ''
          this.countyVal = ''
          this.streetList.splice(0)
          this.streetVal = ''
          this.communityList.splice(0)
          this.communityVal = ''
          this.houseVal = ''
          this.houseList.splice(0)
          this.houseId = ''
          this.houseName = ''
          this.areaInfo = ''
        } else if (this.areaType === 'COUNTY') {
          this.provinceVal = ''
          this.cityVal = ''
          this.countyVal = ''
          this.streetVal = ''
          this.communityList.splice(0)
          this.communityVal = ''
          this.houseVal = ''
          this.houseList.splice(0)
          this.houseId = ''
          this.houseName = ''
          this.areaInfo = ''
        } else if (this.areaType === 'STREET') {
          this.provinceVal = ''
          this.cityVal = ''
          this.countyVal = ''
          this.streetVal = ''
          this.communityVal = ''
          this.houseVal = ''
          this.houseList.splice(0)
          this.houseId = ''
          this.houseName = ''
          this.areaInfo = ''
        } else if (this.areaType === 'COMMUNITY') {
          this.provinceVal = ''
          this.cityVal = ''
          this.countyVal = ''
          this.streetVal = ''
          this.communityVal = ''
          this.houseVal = ''
          this.houseId = ''
          this.houseName = ''
          this.areaInfo = ''
        }
        this.outputAreaInfo()
      }
    }
  }
</script>
