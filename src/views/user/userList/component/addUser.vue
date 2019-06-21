<template>
  <div class="event-street">
    <div class="street-form">
      <div class="street-form-inline">
        <span class="search-quest-title"><i class="form-must-tip">*</i>用户名：</span>
        <div class="street-form-input">
          <input v-model="userName" placeholder="请输入用户名">
        </div>
      </div>
    </div>
    <template v-if="commonTabInfo.text === '新增用户'">
      <div class="street-form">
        <div class="street-form-inline">
          <span class="search-quest-title"><i class="form-must-tip">*</i>密码：</span>
          <div class="street-form-input">
            <input v-model="password" type="password" placeholder="请输入密码">
          </div>
        </div>
      </div>
      <div class="street-form">
        <div class="street-form-inline">
          <span class="search-quest-title"><i class="form-must-tip">*</i>确认密码：</span>
          <div class="street-form-input">
            <input v-model="secPassword" type="password" placeholder="请输入确认密码">
          </div>
        </div>
      </div>
    </template>
    <div class="street-form">
      <div class="street-form-inline">
        <span class="search-quest-title"><i class="form-must-tip">*</i>真实姓名：</span>
        <div class="street-form-input">
          <input v-model="realName" placeholder="请输入真实姓名">
        </div>
      </div>
    </div>
    <div class="street-form">
      <div class="street-form-inline">
        <span class="search-quest-title"><i class="form-must-tip">*</i>角色：</span>
        <el-select v-model="roleId" placeholder="请选择角色">
          <el-option label="请选择" value=""></el-option>
          <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
        </el-select>
      </div>
    </div>
    <div class="street-form">
      <div class="street-form-inline">
        <span class="search-quest-title">所属地：</span>
        <template v-if="commonTabInfo.text === '新增用户'">
          <areachoose :type="areaSelectOption.type" :status="areaSelectOption.status" @areainfo="getAreaProps"></areachoose>
        </template>
        <template v-else>
          <template v-if="areaDefault">
            <span class="house-areaInfo">{{areaDefaultVal}}</span>
          </template>
          <template v-else>
            <areachoose ref="Areachoose" :type="areaSelectOption.type" :status="areaSelectOption.status" @areainfo="getAreaProps"></areachoose>
          </template>
          <template v-if="isSystem">
            <el-button type="primary" @click.native="toChangeArea">{{changeBtnText}}</el-button>
          </template>
        </template>
      </div>
    </div>
    <div class="street-form">
      <div class="street-form-inline">
        <span class="search-quest-title"><i class="form-must-tip">*</i>手机号：</span>
        <div class="street-form-input">
          <input v-model="phone" placeholder="请输入手机号" @input="inputPhone" maxlength="11">
        </div>
      </div>
    </div>
    <div class="street-form">
      <div class="street-form-inline">
        <span class="search-quest-title">生日：</span>
        <div class="street-form-input">
          <el-date-picker
            v-model="birthday"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </div>
      </div>
    </div>
    <div class="street-form">
      <div class="street-form-inline">
        <span class="search-quest-title">居住地址：</span>
        <div class="street-form-input">
          <input v-model="address" placeholder="请输入居住地址">
        </div>
      </div>
    </div>
    <div class="street-form">
      <div class="street-form-inline">
        <span class="search-quest-title">身份证号：</span>
        <div class="street-form-input">
          <input v-model="idCard" @input="inputIdcardLimint" @blur="blurIdcardInput" maxlength="18" placeholder="请输入身份证号">
        </div>
      </div>
    </div>
    <div class="street-form">
      <div class="street-form-inline">
        <span class="search-quest-title">性别：</span>
        <div class="street-form-input">
          <el-radio v-model="sex" label="男">男</el-radio>
          <el-radio v-model="sex" label="女">女</el-radio>
        </div>
      </div>
    </div>
    <div class="street-form">
      <div class="street-form-inline">
        <span class="search-quest-title">账号状态：</span>
        <div class="street-form-input">
          <el-radio v-model="delFlag" label="0">正常</el-radio>
          <el-radio v-model="delFlag" label="1">禁用</el-radio>
        </div>
      </div>
    </div>
    <div class="street-form">
      <div class="street-form-inline">
        <span class="search-quest-title">单点登录：</span>
        <div class="street-form-input">
          <el-radio v-model="loginStatus" label="0">是</el-radio>
          <el-radio v-model="loginStatus" label="1">否</el-radio>
        </div>
      </div>
    </div>
    <div class="street-form">
      <div class="street-form-inline">
        <span class="search-quest-title">组织机构：</span>
        <div class="street-form-input">
          <input v-model="org" placeholder="请输入组织机构">
        </div>
      </div>
    </div>
    <div class="street-form">
      <div class="street-form-inline">
        <span class="search-quest-title">钉钉标识：</span>
        <div class="street-form-input">
          <input v-model="dingTalkLogo" placeholder="请输入钉钉标识">
        </div>
      </div>
    </div>
    <div class="street-form street-form-textarea">
      <span class="search-quest-title">备注：</span>
      <el-input v-model="remarks" type="textarea"></el-input>
    </div>
    <div class="street-footer-btn">
      <el-button @click.native="eventStreet(false, '1', false, 'first')">取消</el-button>
      <template v-if="commonTabInfo.text === '新增用户'">
        <el-button type="primary" @click.native="addUser">保存</el-button>
      </template>
      <template v-else>
        <el-button type="primary" @click.native="editUser">保存编辑</el-button>
      </template>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import md5 from 'md5'
  import Areachoose from '@/components/areaChoose'
  import { addUser, getRoleList, updateUserInfo } from '@/api/requestConfig'
  export default {
    name: 'AddUser',
    data() {
      return {
        addFlag: true, // 新增标记
        userName: '',
        password: '',
        secPassword: '',
        birthday: '',
        sex: '男',
        delFlag: '0',
        phone: '',
        address: '',
        loginStatus: '0',
        isSystem: false,
        realName: '',
        dingTalkLogo: '',
        idCard: '',
        remarks: '',
        org: '',
        roleId: '', // 角色id
        roleList: [],
        areaDefault: true,
        areaDefaultVal: '',
        changeBtnText: '更改',
        areaSelectOption: {
          type: 5,
          data: '',
          status: ''
        } // 地区组件option
      }
    },
    created() {
      var userRole = JSON.parse(window.sessionStorage.getItem('userInfo')).userRole
      if (userRole === '系统管理人员') {
        this.isSystem = true
      }
      // 获取角色列表
      this.toGetRoleList()
      this.renderData()
    },
    watch: {
      'areaDefault': function(val, oldVal) {
        if (val) {
          this.changeBtnText = '更改'
        } else {
          this.changeBtnText = '返回'
        }
      }
    },
    computed: {
      ...mapGetters([
        'commonTabInfo'
      ])
    },
    components: {
      Areachoose
    },
    methods: {
      // 编辑地区
      toChangeArea() {
        this.areaDefault = !this.areaDefault
      },
      // 获取角色列表
      toGetRoleList() {
        getRoleList().then(res => {
          if (res.status === 200) {
            this.roleList = res.data
          } else {
            this.$message.error(res.message)
          }
        }).catch(error => {
          console.log(error)
        })
      },
      // 渲染值
      renderData() {
        if (this.commonTabInfo.text === '新增用户') {
          return
        }
        var userInfo = this.commonTabInfo.custom
        this.userName = userInfo.userName
        this.phone = userInfo.phone
        this.sex = userInfo.sex
        this.birthday = userInfo.birthday
        this.address = userInfo.address
        this.delFlag = userInfo.delFlag === 0 ? '0' : '1'
        this.realName = userInfo.realName
        this.idCard = userInfo.idCard
        this.org = userInfo.org
        this.dingTalkLogo = userInfo.dingTalkLogo
        this.remarks = userInfo.remarks
        this.roleId = userInfo.roleId
        this.areaDefaultVal = userInfo.areaName
      },
      // 街道操作
      eventStreet(flag, text, disabled, activeName) {
        this.$store.dispatch('handleTabInfo', {
          flag: flag,
          text: text,
          disabled: disabled,
          activeName: activeName
        })
      },
      // 获取子组件地区信息
      getAreaProps(needData) {
        this.areaSelectOption.data = needData
      },
      // 手机号输入
      inputPhone() {
        this.phone = this.phone.replace(/[^0-9]/g, '')
      },
      // 新增用户
      addUser() {
        if (!this.addFlag) {
          return
        }
        if (this.userName === '') {
          this.$message.error('请输入用户名')
          return
        }
        if (this.password === '') {
          this.$message.error('请输入密码')
          return
        }
        if (this.secPassword === '') {
          this.$message.error('请输入确认密码')
          return
        }
        if (this.secPassword !== this.password) {
          this.$message.error('两次输入的密码不一致')
          return
        }
        if (!this.realName) {
          this.$message.error('请填写真实姓名')
          return
        }
        if (!this.roleId) {
          this.$message.error('请选择角色')
          return
        }
        if (!this.phone) {
          this.$message.error('请填写手机号')
          return
        }
        var needData = {}
        var finishData = {}
        var houseInfo = this.areaSelectOption.data
        if (houseInfo.communityCode) {
          needData.areaCode = houseInfo.communityCode
          needData.areaType = 'COMMUNITY'
        } else if (houseInfo.communityCode === '' && houseInfo.streetCode) {
          needData.areaCode = houseInfo.streetCode
          needData.areaType = 'STREET'
        } else if (houseInfo.streetCode === '' && houseInfo.countyCode) {
          needData.areaCode = houseInfo.countyCode
          needData.areaType = 'COUNTY'
        } else if (houseInfo.countyCode === '' && houseInfo.cityCode) {
          needData.areaCode = houseInfo.cityCode
          needData.areaType = 'CITY'
        } else if (houseInfo.provinceCode) {
          needData.areaCode = houseInfo.provinceCode
          needData.areaType = 'PROVINCE'
        } else {
          needData.areaCode = 0
          needData.areaType = 'ALL'
        }
        needData.userName = this.userName
        needData.password = md5(this.password)
        needData.sex = this.sex
        needData.birthday = new Date(this.birthday).getTime()
        needData.address = this.address
        needData.delFlag = this.delFlag
        needData.realName = this.realName
        needData.idCard = this.idCard
        needData.org = this.org
        needData.dingTalkLogo = this.dingTalkLogo
        needData.phone = this.phone
        needData.remarks = this.remarks
        finishData.roleId = this.roleId
        finishData.user = needData
        this.addFlag = false
        var turnSelf = this
        addUser(finishData).then(res => {
          if (res.status === 200) {
            this.$message.success(res.message)
            var that = this
            setTimeout(function() {
              that.eventStreet(false, 'refresh', false, 'first')
            }, 2000)
          } else {
            this.$message.error(res.message)
          }
        }).catch(error => {
          console.log(error)
        })
        setTimeout(function() {
          turnSelf.addFlag = true
        }, 3000)
      },
      // 保存编辑
      editUser() {
        if (this.userName === '') {
          this.$message.error('请输入用户名')
          return
        }
        if (!this.realName) {
          this.$message.error('请填写真实姓名')
          return
        }
        if (!this.roleId) {
          this.$message.error('请选择角色')
          return
        }
        if (!this.phone) {
          this.$message.error('请填写手机号')
          return
        }
        var needData = {}
        var finishData = {}
        var userInfo = this.commonTabInfo.custom
        if (!this.areaDefault) {
          var houseInfo = this.areaSelectOption.data
          if (houseInfo.communityCode) {
            needData.areaCode = houseInfo.communityCode
            needData.areaType = 'COMMUNITY'
          } else if (houseInfo.communityCode === '' && houseInfo.streetCode) {
            needData.areaCode = houseInfo.streetCode
            needData.areaType = 'STREET'
          } else if (houseInfo.streetCode === '' && houseInfo.countyCode) {
            needData.areaCode = houseInfo.countyCode
            needData.areaType = 'COUNTY'
          } else if (houseInfo.countyCode === '' && houseInfo.cityCode) {
            needData.areaCode = houseInfo.cityCode
            needData.areaType = 'CITY'
          } else if (houseInfo.provinceCode) {
            needData.areaCode = houseInfo.provinceCode
            needData.areaType = 'PROVINCE'
          } else {
            needData.areaCode = 0
            needData.areaType = 'ALL'
          }
        } else {
          needData.areaCode = userInfo.areaCode
          needData.areaType = userInfo.areaType
        }
        needData.id = userInfo.id
        needData.password = userInfo.password
        needData.userName = this.userName
        needData.sex = this.sex
        needData.birthday = new Date(this.birthday).getTime()
        needData.address = this.address
        needData.delFlag = this.delFlag
        needData.realName = this.realName
        needData.org = this.org
        needData.dingTalkLogo = this.dingTalkLogo
        needData.idCard = this.idCard
        needData.phone = this.phone
        needData.remarks = this.remarks
        finishData.roleId = this.roleId
        finishData.user = needData
        updateUserInfo(finishData).then(res => {
          if (res.status === 200) {
            this.$message.success(res.message)
            var that = this
            setTimeout(function() {
              that.eventStreet(false, 'update', false, 'first')
            }, 2000)
          } else {
            this.$message.error(res.message)
          }
        }).catch(error => {
          console.log(error)
        })
      },
      // 输入框校验身份证号码
      blurIdcardInput() {
        if (this.idCard === '') return
        var checkData = this.checkIdCard(this.idCard)
        if (!checkData.pass) {
          this.$message.error(checkData.msg)
        }
      },
      // 输入身份证号限制
      inputIdcardLimint() {
        var reg = /[^0-9X]/ig
        this.idCard = this.idCard.replace(reg, function() {
          return ''
        })
        this.idCard = this.idCard.toUpperCase()
      },
      // 验证身份证号
      checkIdCard(code) {
        var aCity = {
          11: '北京',
          12: '天津',
          13: '河北',
          14: '山西',
          15: '内蒙古',
          21: '辽宁',
          22: '吉林',
          23: '黑龙江',
          31: '上海',
          32: '江苏',
          33: '浙江',
          34: '安徽',
          35: '福建',
          36: '江西',
          37: '山东',
          41: '河南',
          42: '湖北',
          43: '湖南',
          44: '广东',
          45: '广西',
          46: '海南',
          50: '重庆',
          51: '四川',
          52: '贵州',
          53: '云南',
          54: '西藏',
          61: '陕西',
          62: '甘肃',
          63: '青海',
          64: '宁夏',
          65: '新疆',
          71: '台湾',
          81: '香港',
          82: '澳门',
          91: '国外'
        }
        var row = {
          pass: true,
          msg: '验证成功'
        }
        var iSum = 0
        if (!/^\d{17}(\d|x)$/i.test(code)) {
          row = {
            pass: false,
            msg: '你输入的身份证长度或格式错误'
          }
        }
        code = code.replace(/x$/i, 'a')
        if (aCity[parseInt(code.substr(0, 2))] == null) {
          row = {
            pass: false,
            msg: '你的身份证地区非法'
          }
        }
        var sBirthday = code.substr(6, 4) + '-' + Number(code.substr(10, 2)) + '-' + Number(code.substr(12, 2))
        var d = new Date(sBirthday.replace(/-/g, '/'))
        if (sBirthday !== (d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate())) {
          row = {
            pass: false,
            msg: '身份证上的出生日期非法'
          }
        }
        for (var i = 17; i >= 0; i--) iSum += (Math.pow(2, i) % 11) * parseInt(code.charAt(17 - i), 11)
        if (iSum % 11 !== 1) {
          row = {
            pass: false,
            msg: '你输入的身份证号非法'
          }
        }
        return row
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .street-header-title{
    width: 100%;
    height: 50px;
    line-height: 50px;
  }
  .street-form{
    width: 100%;
    .street-form-input{
      display: inline-block;
      width: 220px;
      input{
        width: 220px;
        height: 40px;
        text-indent: 15px;
        border:1px solid #dcdfe6;
        border-radius: 5px;
      }
    }
    .el-select{
      width: 220px;
    }
    .el-textarea{
      width: 600px;
    }
    .search-quest-title{
      display: inline-block;
      text-align: right;
      height: 40px;
      line-height: 40px;
      width: 100px;
      .form-must-tip{
        color: #f56c6c;
        margin-right: 5px;
      }
    }
    .search-quest-title-long{
      width: 130px;
    }
    .street-form-inline{
      display: inline-block;
      margin:5px 80px 5px 0;
    }
  }
  .street-form-textarea{
    overflow: hidden;
    margin: 5px 0;
    .el-textarea{
      float: left;
    }
    span{
      float: left;
    }
  }
  .street-footer-btn{
    margin-top: 50px;
    text-align: center;
  }
  .house-areaInfo{
    display: inline-block;
    height: 40px;
    line-height: 40px;
    padding: 0 10px;
  }
</style>
