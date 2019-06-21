<!--
 * 名称:name (ok)
 * 编号:houseNo
 * 年份:year (ok)
 * 面积:area (ok)
 * 地址:address (ok)
 * 坐标-经度:lng (ok)
 * 坐标-维度:lat (ok)
 * 结构类型:structType (ok)
 * 土地性质:landNature (ok)
 * 产权性质:ownNature (ok)
 * 基础情况类型:baseTypeInfo (ok)
 * 竣工日期:completeDate (ok)
 * 总建筑面积:builtArea (ok)
 * 总层数:totalFloorNum (ok)
 * 地上层数:groundFloorNum (ok)
 * 地下层数:undergroundFloorNum (ok)
 * 单元数量:unitNum
 * 建设单位:buildUnitName (ok)
 * 设计单位:designUnitName (ok)
 * 施工单位:constructionUnitName (ok)
 * 监理单位:supervisorUnitName (ok)
 * 总套数:totalNumber (ok)
 * 直管公房套数:directPubHouseNum (ok)
 * 单位自管公房套数:unitSelfHouseNum (ok)
 * 私房数量:privateHouseNum (ok)
 * 商品房数量:commodityHouseNum (ok)
 * 房改房数量:housingReformhouseNum (ok)
 * 拆迁安置房数量:resettlementHouseNum (ok)
 * 其它数量:otherHouseNum (ok)
 * 房屋场地类型:housePlaceType (ok)
 * 化学侵蚀类型:chemicalAttackType (ok)
 * 结构拆改类型:changeType (ok)
 * 加层改造类型:addLayerType (ok)
 * 修缮类型:repairType (ok)
 * 历史灾害类型:historicalDisasterType (ok)
 * 使用功能变更类型:useFuncChangeType (ok)
 * 其他调查内容:otherQuiryContent (ok)
 * 鉴定情况类型:appraisalType (ok)   delete
 * 解危处置情况:disposalDangerInfo (ok)
 * 图纸资料类型:drawingDataType (ok)
 * 图纸资料存档信息:drawingArchive (ok)
 * 调查登记机构:investigationOrg (ok)
 * 主管部门:competentDept (ok)

 * 描述:descr (ok)
 * 物业单位名称:propertyUnitName (ok)
 * 物业单位负责人:propertyUnitDirector (ok)
 * 物业单位负责人电话:propertyUnitDirectorPhone (ok)
 * 物业单位联系人:propertyUnitContact (ok)
 * 物业单位联系人电话:propertyUnitContactPhone (ok)
 * 产权单位名称:ownerUnitName (ok)
 * 产权单位负责人:ownerUnitDirector (ok)
 * 产权单位负责人电话:ownerUnitDirectorPhone (ok)
 * 产权单位联系人:ownerUnitContact (ok)
 * 产权单位联系人电话:ownerUnitContactPhone (ok)
 * 属地管理社区负责人:localManager (ok)
 * 属地管理社区负责人电话:localManagerPhone (ok)
 * 房屋变形监测方案:deformationMonitorPlan (ok)
 * 结构主要缺陷:structDefect (ok)
 * 鉴定等级:String appraisalLevel (ok)
 * 处理意见:String processingAdvice (ok)
 * 房屋用途:String houseNature (ok)
-->
<template>
  <div class="event-street">
    <div class="street-form">
      <div class="street-form-inline">
        <span class="search-quest-title"><i class="form-must-tip">*</i>房屋名称：</span>
        <div class="street-form-input">
          <el-input v-model="requestData.name" placeholder="请输入房屋名称"></el-input>
        </div>
      </div>
    </div>
    <div class="street-form">
      <div class="street-form-inline">
        <span class="search-quest-title"><i class="form-must-tip">*</i>所属地：</span>
        <template v-if="commonTabInfo.text === '新增房屋'">
          <areachoose ref="Areachoose" :type="areaSelectOption.type" :status="areaSelectOption.status" @areainfo="getAreaProps"></areachoose>
        </template>
        <template v-else>
          <template v-if="areaDefault">
            <span class="house-areaInfo">{{areaDefaultVal}}</span>
          </template>
          <template v-else>
            <areachoose ref="Areachoose" :type="areaSelectOption.type" :status="areaSelectOption.status" @areainfo="getAreaProps"></areachoose>
          </template>
          <template v-if="showChangeBtn">
            <el-button type="primary" @click.native="toChangeArea">{{changeBtnText}}</el-button>
          </template>
        </template>
      </div>
    </div>
    <div class="street-form">
      <div class="street-form-inline">
        <span class="search-quest-title">详细地址：</span>
        <div class="street-form-input">
          <el-input v-model="requestData.address" placeholder="请输入房屋详细地址"></el-input>
        </div>
      </div>
      <div class="street-form-inline">
        <span class="search-quest-title">年份：</span>
        <div class="street-form-input">
          <!--<el-input v-model="requestData.year" placeholder="请输入建房年份"></el-input>-->
          <el-date-picker
            v-model="requestData.year"
            align="left"
            type="year"
            :editable="false"
            placeholder="选择年">
          </el-date-picker>
        </div>
      </div>
      <div class="street-form-inline">
        <span class="search-quest-title">面积：</span>
        <div class="street-form-input">
          <el-input v-model="requestData.area" placeholder="请输入房屋面积"></el-input>
        </div>&nbsp;&nbsp;&nbsp;㎡
      </div>
    </div>
    <div class="street-form">
      <div class="street-form-inline">
        <span class="search-quest-title">总层数：</span>
        <div class="street-form-input">
          <el-input v-model="requestData.totalFloorNum" placeholder="请输入房屋总层数"></el-input>
        </div>
      </div>
      <div class="street-form-inline">
        <span class="search-quest-title">地上层数：</span>
        <div class="street-form-input">
          <el-input v-model="requestData.groundFloorNum" placeholder="请输入房屋地上层数"></el-input>
        </div>
      </div>
      <div class="street-form-inline">
        <span class="search-quest-title">地下层数：</span>
        <div class="street-form-input">
          <el-input v-model="requestData.undergroundFloorNum" placeholder="请输入房屋地下层数"></el-input>
        </div>
      </div>
    </div>
    <div class="street-form">
      <div class="street-form-inline">
        <span class="search-quest-title"><i class="form-must-tip">*</i>鉴定等级：</span>
        <div class="street-form-input">
          <el-select v-model="requestData.appraisalLevel" placeholder="请选择">
            <el-option label="请选择" value=""></el-option>
            <el-option label="A" value="A"></el-option>
            <el-option label="B" value="B"></el-option>
            <el-option label="C" value="C"></el-option>
            <el-option label="D" value="D"></el-option>
            <el-option label="未做鉴定" value="X"></el-option>
          </el-select>
        </div>
      </div>
      <div class="street-form-inline">
        <span class="search-quest-title">经纬度：</span>
        <div class="street-form-input">
          <el-input v-model="requestData.lng" placeholder="请输入经度"></el-input>
        </div>
        <div class="street-form-input">
          <el-input v-model="requestData.lat" placeholder="请输入纬度"></el-input>
        </div>
      </div>
      <div class="street-form-inline">
        <span class="search-quest-title">房屋用途：</span>
        <div class="street-form-input">
          <el-input v-model="requestData.houseNature" placeholder="请输入房屋用途"></el-input>
          <!--<el-select v-model="requestData.houseNature" placeholder="请选择">-->
            <!--<el-option label="请选择" value=""></el-option>-->
            <!--<el-option label="商业" value="商业"></el-option>-->
            <!--<el-option label="住宅" value="住宅"></el-option>-->
            <!--<el-option label="综合" value="综合"></el-option>-->
            <!--<el-option label="办公" value="办公"></el-option>-->
            <!--<el-option label="厂房" value="厂房"></el-option>-->
            <!--<el-option label="车库" value="车库"></el-option>-->
            <!--<el-option label="仓库" value="仓库"></el-option>-->
            <!--<el-option label="阁楼" value="阁楼"></el-option>-->
            <!--<el-option label="其他" value="其他"></el-option>-->
          <!--</el-select>-->
        </div>
      </div>
    </div>
    <div class="street-form">
      <div class="street-form-inline">
        <span class="search-quest-title">基础情况：</span>
        <div class="street-form-input">
          <el-select v-model="requestData.baseTypeInfo" placeholder="请选择">
            <el-option label="请选择" value=""></el-option>
            <el-option label="浅基础" value="1"></el-option>
            <el-option label="桩基础" value="2"></el-option>
          </el-select>
        </div>
      </div>
      <div class="street-form-inline">
        <span class="search-quest-title"><i class="form-must-tip">*</i>结构类型：</span>
        <div class="street-form-input">
          <el-select v-model="requestData.structType" placeholder="请选择">
            <el-option label="请选择" value=""></el-option>
            <el-option label="砖木结构" value="1"></el-option>
            <el-option label="砖混结构" value="2"></el-option>
            <el-option label="框架结构" value="3"></el-option>
            <el-option label="混合结构" value="4"></el-option>
            <el-option label="泥木结构" value="5"></el-option>
            <el-option label="砖木砖混" value="6"></el-option>
            <el-option label="木" value="7"></el-option>
            <el-option label="钢" value="8"></el-option>
          </el-select>
        </div>
      </div>
      <div class="street-form-inline">
        <span class="search-quest-title">土地性质：</span>
        <div class="street-form-input">
          <el-select v-model="requestData.landNature" placeholder="请选择">
            <el-option label="请选择" value=""></el-option>
            <el-option label="城镇国有土地" value="1"></el-option>
          </el-select>
        </div>
      </div>
      <div class="street-form-inline">
        <span class="search-quest-title">产权性质：</span>
        <div class="street-form-input">
          <el-select v-model="requestData.ownNature" placeholder="请选择">
            <el-option label="请选择" value="1"></el-option>
            <el-option label="直管公房" value="2"></el-option>
            <el-option label="单位自管公房" value="3"></el-option>
            <el-option label="私房" value="4"></el-option>
            <el-option label="其他" value="5"></el-option>
          </el-select>
        </div>
      </div>
    </div>
    <div class="street-form">
      <div class="street-form-inline">
        <span class="search-quest-title">竣工日期：</span>
        <div class="street-form-input">
          <el-date-picker
            v-model="requestData.completeDate"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </div>
      </div>
      <div class="street-form-inline">
        <span class="search-quest-title">总建筑面积：</span>
        <div class="street-form-input">
          <el-input v-model="requestData.builtArea" placeholder="请输入总建筑面积"></el-input>
        </div>
      </div>
      <div class="street-form-inline">
        <span class="search-quest-title">建设单位：</span>
        <div class="street-form-input">
          <el-input v-model="requestData.buildUnitName" placeholder="请输入建设单位"></el-input>
        </div>
      </div>
      <div class="street-form-inline">
        <span class="search-quest-title">设计单位：</span>
        <div class="street-form-input">
          <el-input v-model="requestData.designUnitName" placeholder="请输入设计单位"></el-input>
        </div>
      </div>
    </div>
    <div class="street-form">
      <div class="street-form-inline">
        <span class="search-quest-title">施工单位：</span>
        <div class="street-form-input">
          <el-input v-model="requestData.constructionUnitName" placeholder="请输入施工单位"></el-input>
        </div>
      </div>
      <div class="street-form-inline">
        <span class="search-quest-title">监理单位：</span>
        <div class="street-form-input">
          <el-input v-model="requestData.supervisorUnitName" placeholder="请输入监理单位"></el-input>
        </div>
      </div>
      <div class="street-form-inline">
        <span class="">直管公房套数：</span>
        <div class="street-form-input">
          <el-input v-model="requestData.directPubHouseNum" placeholder="直管公房套数"></el-input>
        </div>
      </div>
      <div class="street-form-inline">
        <span class="">单位自管公房套数：</span>
        <div class="street-form-input">
          <el-input v-model="requestData.unitSelfHouseNum" placeholder="单位自管公房套数"></el-input>
        </div>
      </div>
    </div>
    <div class="street-form">
        <span class="search-quest-title">私房套数：</span>
        <div class="street-form-input">
          <el-input v-model="requestData.privateHouseNum" placeholder="私房套数"></el-input>
        </div>
        <span style="margin: 0 20px;">其中</span>
        <span class="">商品房：</span>
        <div class="street-form-input">
          <el-input v-model="requestData.commodityHouseNum" placeholder="商品房套数"></el-input>
        </div>
        <span class="">房改房：</span>
        <div class="street-form-input">
          <el-input v-model="requestData.housingReformhouseNum" placeholder="房改房套数"></el-input>
        </div>
        <span class="">拆迁安置房：</span>
        <div class="street-form-input">
          <el-input v-model="requestData.resettlementHouseNum" placeholder="拆迁安置房套数"></el-input>
        </div>
    </div>
    <div class="street-form">
      <div class="street-form-inline">
        <span class="search-quest-title">其他套数：</span>
        <div class="street-form-input">
          <el-input v-model="requestData.otherHouseNum" placeholder="其他套数"></el-input>
        </div>
      </div>
      <div class="street-form-inline">
        <span class="search-quest-title">总套数：</span>
        <div class="street-form-input">
          <el-input v-model="requestData.totalNumber" placeholder="总套数"></el-input>
        </div>
      </div>
    </div>
    <div class="street-form">
      <div class="street-form-inline">
        <span class="search-quest-title">物业单位名称：</span>
        <div class="street-form-input">
          <el-input v-model="requestData.propertyUnitName" placeholder="物业单位名称"></el-input>
        </div>
      </div>
      <div class="street-form-inline">
        <span class="">物业单位负责人：</span>
        <div class="street-form-input">
          <el-input v-model="requestData.propertyUnitDirector" placeholder="物业单位负责人"></el-input>
        </div>
      </div>
      <div class="street-form-inline">
        <span class="">物业单位负责人电话：</span>
        <div class="street-form-input">
          <el-input v-model="requestData.propertyUnitDirectorPhone" placeholder="物业单位负责人电话"></el-input>
        </div>
      </div>
      <div class="street-form-inline">
        <span class="">物业单位联系人：</span>
        <div class="street-form-input">
          <el-input v-model="requestData.propertyUnitContact" placeholder="物业单位联系人"></el-input>
        </div>
      </div>
      <div class="street-form-inline">
        <span class="">物业单位联系人电话：</span>
        <div class="street-form-input">
          <el-input v-model="requestData.propertyUnitContactPhone" placeholder="物业单位联系人电话"></el-input>
        </div>
      </div>
    </div>
    <div class="street-form">
      <div class="street-form-inline">
        <span class="search-quest-title">产权单位名称：</span>
        <div class="street-form-input">
          <el-input v-model="requestData.ownerUnitName" placeholder="产权单位名称"></el-input>
        </div>
      </div>
      <div class="street-form-inline">
        <span class="">产权单位负责人：</span>
        <div class="street-form-input">
          <el-input v-model="requestData.ownerUnitDirector" placeholder="产权单位负责人"></el-input>
        </div>
      </div>
      <div class="street-form-inline">
        <span class="">产权单位负责人电话：</span>
        <div class="street-form-input">
          <el-input v-model="requestData.ownerUnitDirectorPhone" placeholder="产权单位负责人电话"></el-input>
        </div>
      </div>
      <div class="street-form-inline">
        <span class="">产权单位联系人：</span>
        <div class="street-form-input">
          <el-input v-model="requestData.ownerUnitContact" placeholder="产权单位联系人"></el-input>
        </div>
      </div>
      <div class="street-form-inline">
        <span class="">产权单位联系人电话：</span>
        <div class="street-form-input">
          <el-input v-model="requestData.ownerUnitContactPhone" placeholder="产权单位联系人电话"></el-input>
        </div>
      </div>
    </div>
    <div class="street-form">
      <div class="street-form-inline">
        <span class="search-quest-title">房屋场地：</span>
        <div class="street-form-input">
          <el-select v-model="requestData.housePlaceType" placeholder="请选择">
            <el-option label="请选择" value=""></el-option>
            <el-option label="平底" value="1"></el-option>
            <el-option label="山脚" value="2"></el-option>
          </el-select>
        </div>
      </div>
      <div class="street-form-inline">
        <span class="search-quest-title">化学侵蚀：</span>
        <div class="street-form-input">
          <el-select v-model="requestData.chemicalAttackType" placeholder="请选择">
            <el-option label="请选择" value=""></el-option>
            <el-option label="盐酸" value="1"></el-option>
            <el-option label="硫酸" value="2"></el-option>
            <el-option label="暂无" value="3"></el-option>
          </el-select>
        </div>
      </div>
      <div class="street-form-inline">
        <span class="search-quest-title">结构拆改：</span>
        <div class="street-form-input">
          <el-select v-model="requestData.changeType" placeholder="请选择">
            <el-option label="请选择" value=""></el-option>
            <el-option label="无拆改" value="1"></el-option>
            <el-option label="有拆改" value="2"></el-option>
          </el-select>
        </div>
      </div>
      <div class="street-form-inline">
        <span class="search-quest-title">加层改造：</span>
        <div class="street-form-input">
          <el-select v-model="requestData.addLayerType" placeholder="请选择">
            <el-option label="请选择" value=""></el-option>
            <el-option label="无加层" value="1"></el-option>
            <el-option label="有加层" value="2"></el-option>
          </el-select>
        </div>
      </div>
    </div>
    <div class="street-form">
      <div class="street-form-inline">
        <span class="search-quest-title">修缮加固：</span>
        <div class="street-form-input">
          <el-select v-model="requestData.repairType" placeholder="请选择">
            <el-option label="请选择" value=""></el-option>
            <el-option label="正常使用" value="1"></el-option>
          </el-select>
        </div>
      </div>
      <div class="street-form-inline">
        <span class="search-quest-title">历史灾害：</span>
        <div class="street-form-input">
          <el-select v-model="requestData.historicalDisasterType" placeholder="请选择">
            <el-option label="请选择" value=""></el-option>
            <el-option label="正常使用" value="1"></el-option>
            <el-option label="火灾" value="2"></el-option>
          </el-select>
        </div>
      </div>
      <div class="street-form-inline">
        <span class="search-quest-title">使用功能变更：</span>
        <div class="street-form-input">
          <el-select v-model="requestData.useFuncChangeType" placeholder="请选择">
            <el-option label="请选择" value=""></el-option>
            <el-option label="无变更" value="1"></el-option>
            <el-option label="有变更" value="2"></el-option>
          </el-select>
        </div>
      </div>
    </div>
    <div class="street-form">
      <div class="street-form-inline">
        <span class="search-quest-title">图纸资料：</span>
        <div class="street-form-input">
          <el-select v-model="requestData.drawingDataType" placeholder="请选择">
            <el-option label="齐全" value="0"></el-option>
            <el-option label="不齐全" value="1"></el-option>
            <el-option label="无" value="2"></el-option>
          </el-select>
        </div>
      </div>
      <div class="street-form-inline">
        <span class="search-quest-title">图纸资料存档：</span>
        <div class="street-form-input">
          <el-input v-model="requestData.drawingArchive" placeholder="图纸资料存档"></el-input>
        </div>
      </div>
      <div class="street-form-inline">
        <span class="search-quest-title">调查登记机构：</span>
        <div class="street-form-input">
          <el-input v-model="requestData.investigationOrg" placeholder="调查登记机构"></el-input>
        </div>
      </div>
      <div class="street-form-inline">
        <span class="search-quest-title">主管部门：</span>
        <div class="street-form-input">
          <el-input v-model="requestData.competentDept" placeholder="主管部门"></el-input>
        </div>
      </div>
    </div>
    <div class="street-form">
      <div class="street-form-inline">
        <span class="">属地管理社区负责人：</span>
        <div class="street-form-input">
          <el-input v-model="requestData.localManager" placeholder="属地管理社区负责人"></el-input>
        </div>
      </div>
      <div class="street-form-inline">
        <span class="">属地管理社区负责人电话：</span>
        <div class="street-form-input">
          <el-input v-model="requestData.localManagerPhone" placeholder="属地管理社区负责人电话"></el-input>
        </div>
      </div>
    </div>
    <div class="street-form street-form-textarea">
      <span class="search-quest-title">描述：</span>
      <el-input type="textarea" v-model="requestData.descr"></el-input>
    </div>
    <div class="street-form street-form-textarea">
      <span class="search-quest-title">处理意见：</span>
      <el-input type="textarea" v-model="requestData.processingAdvice"></el-input>
    </div>
    <div class="street-form street-form-textarea">
      <span class="search-quest-title">其它调查内容：</span>
      <el-input type="textarea" v-model="requestData.otherQuiryContent"></el-input>
    </div>
    <div class="street-form street-form-textarea">
      <span class="search-quest-title">解危处置情况：</span>
      <el-input type="textarea" v-model="requestData.disposalDangerInfo"></el-input>
    </div>
    <div class="street-form street-form-textarea">
      <span class="search-quest-title">结构主要缺陷：</span>
      <el-input type="textarea" v-model="requestData.structDefect"></el-input>
    </div>
    <div class="street-form street-form-textarea">
      <span class="search-quest-title search-quest-title-long">房屋变形监测方案：</span>
      <el-input type="textarea" v-model="requestData.deformationMonitorPlan"></el-input>
    </div>
    <!--<div class="street-form">-->
      <!--<span class="search-quest-title">证书列表：</span>-->
    <!--</div>-->
    <!--<div class="street-form">-->
      <!--<span class="search-quest-title">人工巡检：</span>-->
    <!--</div>-->
    <div class="street-footer-btn">
      <el-button @click.native="eventStreet(false, '1', false, 'first', '')">取消</el-button>
      <template v-if="commonTabInfo.text === '新增房屋'">
        <el-button type="primary" @click.native="toAddHouse">保存</el-button>
      </template>
      <template v-else>
        <el-button type="primary" @click.native="toEditHouse">保存编辑</el-button>
      </template>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Areachoose from '@/components/areaChoose'
  import { buildHouseAndArea, editbuildHouseAndArea } from '@/api/requestConfig'
  export default {
    name: 'HouseInfo',
    data() {
      return {
        activeName: 'first',
        eventFlag: false,
        secondLable: '',
        areaDefault: true,
        changeBtnText: '更改',
        showChangeBtn: true,
        areaDefaultVal: '',
        addFlag: true, // 新增标记
        areaSelectOption: {
          type: 5,
          data: '',
          status: ''
        }, // 地区组件option
        requestData: {
          name: '', // 房屋名称
          address: '', // 详细地址
          year: '', // 年份
          area: '', // 面积
          lat: '', // 纬度
          lng: '', // 经度
          baseTypeInfo: '', // 基础情况
          structType: '', // 结构类型
          totalFloorNum: '', // 总层数
          groundFloorNum: '', // 地上层数
          undergroundFloorNum: '', // 地下层数
          builtArea: '', // 总建筑面积
          completeDate: '', // 竣工日期
          landNature: '', // 土地性质
          ownNature: '', // 产权性质
          buildUnitName: '', // 建设单位
          designUnitName: '', // 设计单位
          constructionUnitName: '', // 施工单位
          supervisorUnitName: '', // 监理单位
          totalNumber: '', // 总套数
          directPubHouseNum: '', // 直管公房套数
          unitSelfHouseNum: '', // 单位自管公房套数
          privateHouseNum: '', // 私房套数
          commodityHouseNum: '', // 商品房套数
          housingReformhouseNum: '', // 房改房套数
          resettlementHouseNum: '', // 安置房套数
          otherHouseNum: '', // 其他套数
          housePlaceType: '', // 房屋场地
          chemicalAttackType: '', // 化学侵蚀
          changeType: '', // 结构拆改
          addLayerType: '', // 加层改造
          repairType: '', // 修缮加固
          historicalDisasterType: '', // 历史灾害
          useFuncChangeType: '', // 使用功能
          otherQuiryContent: '', // 其他调查内容
          disposalDangerInfo: '', // 解危处置
          drawingDataType: '', // 图纸资料
          drawingArchive: '', // 图纸资料存档
          investigationOrg: '', // 调查登记机构
          competentDept: '', // 主管部门
          propertyUnitName: '', // 物业单位名称
          propertyUnitDirector: '', // 物业单位负责人
          propertyUnitDirectorPhone: '', // 物业单位负责人电话
          propertyUnitContact: '', // 物业单位联系人
          propertyUnitContactPhone: '', // 物业单位联系人电话
          ownerUnitName: '', // 产权单位名称
          ownerUnitDirector: '', // 产权单位负责人
          ownerUnitDirectorPhone: '', // 产权单位负责人电话
          ownerUnitContact: '', // 产权单位联系人
          ownerUnitContactPhone: '', // 产权单位联系人电话
          descr: '', // 描述
          structDefect: '', // 结构主要缺陷
          deformationMonitorPlan: '', // 房屋变形监测方案
          localManager: '', // 属地管理社区负责人
          localManagerPhone: '', // 属地管理社区负责人电话
          appraisalLevel: 'C', // 鉴定等级
          houseNature: '', // 房屋用途
          processingAdvice: '' // 处理意见
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
    watch: {
      'areaDefault': function(val, oldVal) {
        if (val) {
          this.changeBtnText = '更改'
        } else {
          this.changeBtnText = '返回'
        }
      }
    },
    mounted() {
      this.renderData()
    },
    methods: {
      // 编辑地区
      toChangeArea() {
        this.areaDefault = !this.areaDefault
      },
      // 渲染值
      renderData() {
        if (this.commonTabInfo.custom === '') {
          return
        }
        for (var k in this.requestData) {
          if (this.commonTabInfo.custom.house[k]) {
            this.requestData[k] = (this.commonTabInfo.custom.house[k]).toString()
          } else {
            this.requestData[k] = this.commonTabInfo.custom.house[k]
          }
        }
        if (this.requestData.year) {
          this.requestData.year = (this.requestData.year).toString()
        }
        var handlerProvince = this.commonTabInfo.custom.province ? this.commonTabInfo.custom.province : ''
        var handlerCity = this.commonTabInfo.custom.city ? this.commonTabInfo.custom.city : ''
        var handlerCounty = this.commonTabInfo.custom.county ? this.commonTabInfo.custom.county : ''
        var handlerStreet = this.commonTabInfo.custom.street ? this.commonTabInfo.custom.street : ''
        var handlerCommunity = this.commonTabInfo.custom.community ? this.commonTabInfo.custom.community : ''
        this.areaDefaultVal = handlerProvince + handlerCity + handlerCounty + handlerStreet + handlerCommunity
        var userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'))
        var areaType = userInfo.areaType
        if (areaType === 'COMMUNITY') {
          this.showChangeBtn = false
        }
      },
      // 街道操作
      eventStreet(flag, text, disabled, activeName, custom) {
        this.$store.dispatch('handleTabInfo', {
          flag: flag,
          text: text,
          disabled: disabled,
          activeName: activeName,
          custom: custom
        })
      },
      // 获取子组件地区信息
      getAreaProps(needData) {
        this.areaSelectOption.data = needData
      },
      // 新增房屋
      toAddHouse() {
        if (!this.addFlag) {
          return
        }
        var houseData = {}
        var areaData = {}
        if (!this.requestData.name) {
          this.$message.error('请填写房屋名称')
          return
        }
        var houseAreaInfo = this.areaSelectOption.data
        if (houseAreaInfo.communityCode || houseAreaInfo.streetCode || houseAreaInfo.countyCode) {
          areaData.provinceCode = houseAreaInfo.provinceCode
          if (houseAreaInfo.cityCode) {
            areaData.cityCode = houseAreaInfo.cityCode
          }
          areaData.countyCode = houseAreaInfo.countyCode
          if (houseAreaInfo.streetCode) {
            areaData.streetCode = houseAreaInfo.streetCode
          }
          if (houseAreaInfo.communityCode) {
            areaData.communityCode = houseAreaInfo.communityCode
          }
        } else {
          this.$message.error('请选择所属地')
          return
        }
        if (!this.requestData.appraisalLevel) {
          this.$message.error('请选择房屋鉴定等级')
          return
        }
        if (!this.requestData.structType) {
          this.$message.error('请选择房屋结构类型')
          return
        }
        for (var k in this.requestData) {
          if (this.requestData[k] !== '') {
            houseData[k] = this.requestData[k]
          }
        }
        // 年份
        if (this.requestData.year) {
          houseData.year = (this.requestData.year).getFullYear()
        }
        areaData.isTarget = 0
        var lastNeed = {}
        lastNeed.areaHouse = areaData
        lastNeed.house = houseData
        this.addFlag = false
        var turnSelf = this
        buildHouseAndArea(lastNeed).then(res => {
          if (res.status === 200) {
            this.$message.success(res.message)
            var that = this
            setTimeout(function() {
              that.eventStreet(false, 'refresh', false, 'first', '')
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
      // 编辑房屋
      toEditHouse() {
        var houseData = {}
        var areaData = {}
        if (!this.requestData.name) {
          this.$message.error('请填写房屋名称')
          return
        }
        var houseAreaInfo = this.areaSelectOption.data
        if (this.areaDefault) {
          areaData.provinceCode = this.commonTabInfo.custom.provinceCode
          areaData.cityCode = this.commonTabInfo.custom.cityCode
          areaData.countyCode = this.commonTabInfo.custom.countyCode
          areaData.streetCode = this.commonTabInfo.custom.streetCode
          areaData.communityCode = this.commonTabInfo.custom.communityCode
        } else {
          if (houseAreaInfo.communityCode || houseAreaInfo.streetCode || houseAreaInfo.countyCode) {
            areaData.provinceCode = houseAreaInfo.provinceCode
            areaData.cityCode = houseAreaInfo.cityCode
            areaData.countyCode = houseAreaInfo.countyCode
            areaData.streetCode = houseAreaInfo.streetCode
            areaData.communityCode = houseAreaInfo.communityCode
          } else {
            this.$message.error('请选择所属地')
            return
          }
        }
        if (!this.requestData.appraisalLevel) {
          this.$message.error('请选择房屋鉴定等级')
          return
        }
        if (!this.requestData.structType) {
          this.$message.error('请选择房屋结构类型')
          return
        }
        for (var k in this.requestData) {
          if (this.requestData[k] !== '') {
            houseData[k] = this.requestData[k]
          }
        }
        // 编辑年份
        if (houseData.year) {
          if (Number(houseData.year) !== this.commonTabInfo.custom.house.year) {
            houseData.year = (this.requestData.year).getFullYear()
          } else {
            houseData.year = Number(houseData.year)
          }
        }
        houseData.id = this.commonTabInfo.custom.house.id
        areaData.houseId = this.commonTabInfo.custom.house.id
        areaData.houseName = houseData.name
        areaData.id = this.commonTabInfo.custom.areaHouseId
        areaData.isTarget = this.commonTabInfo.custom.isTarget
        var lastNeedData = {}
        lastNeedData.areaHouse = areaData
        lastNeedData.house = houseData
        editbuildHouseAndArea(lastNeedData).then(res => {
          if (res.status === 200) {
            this.$message.success(res.message)
            var that = this
            setTimeout(function() {
              that.eventStreet(false, 'update', false, 'first', '')
            }, 2000)
          } else {
            this.$message.error(res.message)
          }
        }).catch(error => {
          console.log(error)
        })
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
    }
    .el-select{
      width: 220px;
    }
    .el-textarea{
      width: 600px;
    }
    .house-areaInfo{
      display: inline-block;
      height: 40px;
      line-height: 40px;
      padding: 0 10px;
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
</style>
