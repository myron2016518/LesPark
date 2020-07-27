<template>
  <div class="userLive">
    <!-- 直播间 -->
    <div id="Live">
      <div class="wrap">
        <div class="LiveContent fx">

          <!-- 用户信息和热门直播 -->
          <div class="userinfoandhot tc_yy">
            <!-- 个人信息 -->
            <el-row>
              <img :src="liveObj['LiveAvatar']"
                   alt="头像"
                   @click="gotoUserInfo"
                   class="avatar ll_cursor" />
            </el-row>
            <el-row> <span @click="gotoUserInfo"
                    class="ll_cursor">{{liveObj['LiveNickName']}}</span> </el-row>
            <el-row class="live_user_id"> LesPark ID:{{lgId}}</el-row>
            <el-row class="live_user_1">
              <div class="label "
                   v-if="anchor_star_new!=''">
                <img :src="anchorImgList[anImgIndex]"
                     class="starLabel" />
                <span class="labelText">{{anchor_star_new}}</span>
              </div>
              爱豆 {{lmoney_total}}
            </el-row>
            <el-row>
              <div class="follow live_user_2"
                   @click="followAnchor"
                   v-if="!isFollow">
                <img src="../../../images/live/add.png"
                     class="add" />
                <div>{{$t('live.nav1')}}</div>
              </div>
            </el-row>
            <el-row class="live_hot_title"> {{$t('home.liveTitle2')}} </el-row>
            <el-row class="live_hot_content">
              <livehot refs="livehot"></livehot>
            </el-row>
            <!-- <div class="userCell fx">
              <div class="">
                <img :src="liveObj['LiveAvatar']"
                     alt="头像"
                     class="avatar" />
                <div class=" userInfo">
                  <div class="nickName">
                    <span>{{liveObj['LiveNickName']}}</span>
                    <div class="label "
                         v-if="anchor_star_new!=''">
                      <img :src="anchorImgList[anImgIndex]"
                           class="starLabel" />
                      <span class="labelText">{{anchor_star_new}}</span>
                    </div>
                  </div>

                  <div class="lgId">LesPark ID:{{lgId}}</div>
                </div>
              </div>
              <div class="follow fxMiddle"
                   @click="followAnchor"
                   v-if="!isFollow">
                <img src="../../../images/live/add.png"
                     class="add" />
                <div>{{$t('live.nav1')}}</div>
              </div>

            </div> -->

          </div>
          <!--观看人数和热门排名 -->
          <div class="liveTop">
            <div class="rank"
                 v-show="rank!=''">
              <img src="../../../images/live/rank.png"
                   alt="热门排名" />
              <span>{{rank}}</span>
            </div>
            <div class="rank"
                 :style="rank!=''? 'one':'two' "
                 v-show="view_num!=''">
              <img src="../../../images/live/watch.png"
                   alt="观看人数" />
              <span>{{view_num}}</span>
            </div>
          </div>
          <!--ID 和日期 -->
          <div class="liveIdAndDate">
            <div class="rankID"
                 v-show="lgId!=''">
              <img src="../../../images/live/live1.png" />
              <span>ID:{{lgId}}</span>
            </div>
            <div class="rankID">
              <span>{{userpclivetime}}</span>
            </div>
          </div>
          <!-- 直播 / 电台 -->
          <video-player class="video-player vjs-custom-skin LiveDialog tc_yy2"
                        :style="{width:videowidth + 'px',height:videoHeight + 'px'}"
                        ref="videoPlayer"
                        :options="playerOptions"
                        :playsinline="true"
                        customEventName="customstatechangedeventname"
                        @ready="playerReadied"
                        v-if="!IsEnd&&loadingGetEnd">
          </video-player>
          <!-- 电台 -->
          <div class="radioLive fx fxMiddle"
               v-if="IsAudio&&!IsEnd">
            <!-- 电台背景图 -->
            <img src="https://img2.lespark.cn/web/radioBg.png"
                 class="radioPic" />
            <!-- 没有图片 -->
            <div class="circleWrap">
              <div class="circleImg">
                <img src="../../../images/live/circlePic.png"
                     class="circlePic" />
                <div class="avatarImg">
                  <img :src="liveObj['LiveAvatar']"
                       class="avatarPic" />
                </div>
              </div>
            </div>
          </div>

          <!-- 直播结束 -->
          <div v-if="IsEnd"
               class="endModal">
            <div class="engPic">
              <img :src="liveObj['LiveAvatar']"
                   class="endImg" />
            </div>
            <div class="recordText">{{$t('live.nav6')}}</div>
            <div class="recordBtn RecordFollow"
                 @click="followAnchor"
                 v-show="!isFollow">
              <span>{{$t('live.nav7')}}</span>
            </div>
            <!-- 热门 -->
            <div class="recordBtn RecordHot"
                 @click="toHot">{{$t('live.nav8')}}</div>
          </div>
          <!-- 礼物一 -->
          <div class="giftWrap"
               v-show="!IsEnd"
               v-for="(item,index) in showListOne"
               :key="index"
               refs="1">
            <img :src="bgImgList[0]"
                 class="bgImg"
                 v-if="item.num>0&&item.num<=9" />
            <img :src="bgImgList[1]"
                 class="bgImg"
                 v-else-if="item.num>=10&&item.num<=19" />
            <img :src="bgImgList[2]"
                 class="bgImg"
                 v-else-if="item.num>20&&item.num<=29" />
            <img :src="bgImgList[3]"
                 class="bgImg"
                 v-else-if="item.num>30&&item.num<=39" />
            <img :src="bgImgList[4]"
                 class="bgImg"
                 v-else-if="item.num>40&&item.num<=49" />
            <img :src="bgImgList[5]"
                 class="bgImg"
                 v-else-if="item.num>=50" />
            <div class="giftItem">
              <img :src="item.avatar"
                   class="gift_avatar" />
              <div class="message">
                <div class="gift_userName">{{item.nickName}}</div>
                <div class="gift_tips">{{item.giftName}}</div>
              </div>
              <div id="canvasOne"
                   class="svgaImg"
                   v-show="item.isSVGA==1"></div>
              <div class="normalImg"
                   v-show="item.isSVGA==0">
                <img :src="item.imgPic"
                     class="giftImg" />
              </div>
              <div class="stateNum">X {{item.num}}</div>

            </div>
          </div>
          <!-- 礼物二 -->
          <div class="giftWrap"
               v-show="!IsEnd"
               v-for="(item,index) in showListTwo"
               :key="index"
               refs="2">
            <img :src="bgImgList[0]"
                 class="bgImg"
                 v-if="item.num>0&&item.num<=9" />
            <img :src="bgImgList[1]"
                 class="bgImg"
                 v-else-if="item.num>=10&&item.num<=19" />
            <img :src="bgImgList[2]"
                 class="bgImg"
                 v-else-if="item.num>20&&item.num<=29" />
            <img :src="bgImgList[3]"
                 class="bgImg"
                 v-else-if="item.num>30&&item.num<=39" />
            <img :src="bgImgList[4]"
                 class="bgImg"
                 v-else-if="item.num>40&&item.num<=49" />
            <img :src="bgImgList[5]"
                 class="bgImg"
                 v-else-if="item.num>=50" />
            <div class="giftItem">
              <img :src="item.avatar"
                   class="gift_avatar" />
              <div class="message">
                <div class="gift_userName">{{item.nickName}}</div>
                <div class="gift_tips">{{item.giftName}}</div>
              </div>
              <div id="canvasTwo"
                   class="svgaImg"
                   v-show="item.isSVGA==1"></div>
              <div class="normalImg"
                   v-show="item.isSVGA==0">
                <img :src="item.imgPic"
                     class="giftImg" />
              </div>
              <div class="stateNum2">X{{item.num}}</div>

            </div>
          </div>
          <!-- 聊天室 -->
          <div class="ChatRoom">
            <!-- 聊天信息 -->
            <div id="ChatContent"
                 v-chat-scroll="{always: false, smooth: true}">
              <div v-for="(item,index) in messages"
                   :key="index"
                   id="list">
                <div class="MeassgeCell"
                     style="margin-top:5px;"
                     v-if="item.comment_type==3">
                  <img :src="item.avatar"
                       class="chatAvatar"
                       v-if="item.avatar&&item.avatar!=''" />
                  <!-- <div :style="{backgroundImage:'url('+item.avatar+')'}"
                       v-if="item.avatar&&item.avatar!=''"
                       class="chatAvatar"></div> -->
                  <div class="chatInfo "
                       :class="item.avatar&&item.avatar!='' ? 'hasLeft':''"
                       :style="{color:item.is_vip>0?'yellow':'#fff'}">
                    <div class="chatNickName"
                         v-if="item.nickname&&item.nickname!=''">{{item.nickname}}</div>
                    <div class="chatMessage nextLine">{{item.comment}}</div>
                  </div>
                </div>
                <div class="MeassgeCell"
                     style="margin-top:5px;"
                     v-else>
                  <img :src="item.avatar"
                       class="chatAvatar"
                       v-if="item.avatar&&item.avatar!=''" />
                  <!-- <div :style="{backgroundImage:'url('+item.avatar+')'}"
                       v-if="item.avatar&&item.avatar!=''"
                       class="chatAvatar"></div> -->
                  <div class="chatInfo"
                       :class="item.avatar&&item.avatar!='' ? 'hasLeft':''"
                       :style="{color:item.is_vip>0?'yellow':'#fff'}">
                    <!-- 家族标签 -->
                    <div v-if="item.my_title!=''"
                         class='fx fxMiddle inBlock'>
                      <div :class="item.my_title!=''&&item.my_title ?'label' :''">
                        <span class="labelText">{{item.my_title}}</span>
                      </div>
                    </div>
                    <div v-else
                         class="fx fxMiddle inBlock"
                         style="fontSize:15px;color:#fff;">
                      <!-- 贵族标签 -->
                      <div class="label nobleColor"
                           v-show="item.noble_star_new>2"
                           refs="1">
                        <img :src="nobleImgList[0]"
                             class="starLabel"
                             v-if="item.noble_star_new >=2&&item.noble_star_new<=20" />
                        <img :src="nobleImgList[1]"
                             class="starLabel"
                             v-else-if="item.noble_star_new >=21&&item.noble_star_new<=60" />
                        <img :src="nobleImgList[2]"
                             class="starLabel"
                             v-else-if="item.noble_star_new >=61&&item.noble_star_new<=80" />
                        <img :src="nobleImgList[3]"
                             class="starLabel"
                             v-else-if="item.noble_star_new >=81&&item.noble_star_new<=90" />
                        <span class="labelText"
                              :style="{color:item.noble_star_new>81?'#fef100' :'#fff'}">{{item.noble_star_new}}</span>
                      </div>
                      <!-- 主播标签 -->
                      <div class="label"
                           v-show="item.user_anchor_star_new>2"
                           refs="2">
                        <img :src="anchorImgList[0]"
                             class="starLabel"
                             v-if="item.user_anchor_star_new>=2&&item.user_anchor_star_new<=20" />
                        <img :src="anchorImgList[1]"
                             class="starLabel"
                             v-else-if="item.user_anchor_star_new>=21&&item.user_anchor_star_new<=40" />
                        <img :src="anchorImgList[2]"
                             class="starLabel"
                             v-else-if="item.user_anchor_star_new>=41&&item.user_anchor_star_new<=60" />
                        <img :src="anchorImgList[3]"
                             class="starLabel"
                             v-else-if="item.user_anchor_star_new>=61&&item.user_anchor_star_new<=80" />
                        <img :src="anchorImgList[4]"
                             class="starLabel"
                             v-else-if="item.user_anchor_star_new>=81&&item.user_anchor_star_new<=100" />
                        <span class="labelText"
                              :style="{color:item.user_anchor_star_new>81?'#ffc500' :'#fff'}">{{item.user_anchor_star_new}}</span>
                      </div>
                    </div>
                    <div class="chatNickName inBlock"
                         v-if="item.nickname&&item.nickname!=''">{{item.nickname}} :</div>
                    <span v-if="item.comment_type==2||item.comment_type==20"
                          class="giftColor">{{item.comment}}</span>
                    <span v-else-if="item.comment_type==6||item.comment_type==25 || item.comment_type==7"
                          class="shareColor">{{item.comment}}</span>
                    <span v-else>{{item.comment}}</span>
                    <!-- 爱心 -->
                    <div v-if="item.comment_type==4 || item.comment_type==11"
                         class="inBlock">
                      <img :src="loveImgList[0]"
                           class="loveImg"
                           v-if="item.heart_index >=0&&item.heart_index<=3" />
                      <img :src="loveImgList[1]"
                           class="loveImg"
                           v-else-if="item.heart_index >=4&&item.heart_index<=7" />
                      <img :src="loveImgList[2]"
                           class="loveImg"
                           v-else-if="item.heart_index >=8&&item.heart_index<=11" />
                      <img :src="loveImgList[3]"
                           class="loveImg"
                           v-else-if="item.heart_index >=12&&item.heart_index<=15" />
                      <img :src="loveImgList[4]"
                           class="loveImg"
                           v-else-if="item.heart_index >=16&&item.heart_index<=19" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!--发送 -->
            <div class="sendCell fx">
              <input class="inputMessage"
                     placeholder="您暂时被禁言"
                     type="text"
                     disabled="disabled"
                     v-if="isSilence" />
              <input class="inputMessage"
                     placeholder="说点什么吧。"
                     v-model="inputMessage"
                     type="text"
                     maxlength="200"
                     @keyup.enter="sendMessage"
                     v-else />
              <div class="sendBtn disSend"
                   v-if="isSilence"
                   disabled="disabled">{{$t('live.nav4')}}</div>
              <div class="sendBtn"
                   @click="sendMessage"
                   v-else>{{$t('live.nav4')}}</div>
            </div>
            <!-- 礼物列表 -->
            <div class="giftContent tc_yy2">
              <div class="gc_row_1">
                <div class="gc_col"
                     v-for="(item,index) in giftList"
                     :key="index">
                  <div @click="changegiftItem(item)"
                       :class="changegift===item.type?'changegift gc_col_div':'gc_col_div'">
                    <img :src="item.imgPic" />
                    <span class="gc_col_p3"
                          v-if="item.isVip">VIP</span>
                    <p class="gc_col_p1">{{item.giftName}}</p>
                    <p class="gc_col_p2">{{item.giftDiamonds}} <img :src="diamondImg"
                           class="gc_col_d1" /></p>
                  </div>
                </div>
              </div>
              <el-row class="gc_row_2">
                <el-col :span="15"
                        class="gcr_col_1">
                  <img :src="diamondImg"
                       class="gc_col_d2" />
                  {{diamond}}<i class="el-icon-arrow-right"></i>
                  <el-button class="gcr_col_b1"
                             @click="pay"
                             size="small">充值</el-button>
                </el-col>
                <el-col :span="9">
                  <el-select v-model="giftSendNumber"
                             class="gcr_col_i1">
                    <el-option v-for="item in giftNumber"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                  </el-select>
                  <el-button class="gcr_col_b2"
                             @click="sendLiveGift">送出</el-button>

                </el-col>
              </el-row>
            </div>
          </div>

          <div class="btnGroup"
               style="display:none;">
            <div class="hotBtn"
                 @click="toHot">
              <img src="../../../images/hot.png"
                   alt="关注"
                   class="btnImg" />
            </div>
            <div class="hotBtn1"
                 @click="toFollow">
              <img src="../../../images/attention.png"
                   alt="热门"
                   class="btnImg" />
            </div>
          </div>

        </div>

      </div>

    </div>

    <!-- 关注 -->
    <div class="attentionContent">
      <attention refs="attention"></attention>
    </div>

    <!-- 热门 -->
    <!-- <hot refs="hot"></hot> -->

    <!-- totop -->
    <div class="totop"
         @click="backTop()"
         v-show="iftotop">
      <img class="totopimg"
           src="../../../images/totop.png" />
    </div>

  </div>
</template>

<script>
import Vue from "vue";
import ajax from "Common/ajax";
import constans from "Constans";
import Utils from "Common/util";
import cookie from "Common/cookie";
import livehot from "Views/components/livehot";
import attention from "Views/components/attention";
import bus from "Common/events-bus";
require("svgaplayerweb");
import { videoPlayer } from "vue-video-player";
import { Button, MessageBox, Row, Col, Input, Select, Option } from "element-ui";

Vue.use(Button);
Vue.use(Row);
Vue.use(Col);
Vue.use(Input);
Vue.use(Select);
Vue.use(Option);
Vue.prototype.$message = MessageBox;
Vue.prototype.$prompt = MessageBox.prompt;
const userUrl = constans.AllUrl.url.dev;

export default {
  name: "userList",
  components: {
    livehot,
    attention,
    videoPlayer
  },
  data () {
    return {
      iftotop: false,
      showTip: true,
      firstPost: true,
      view_num: "",
      countData: {},
      rank: "",
      playerOptions: {
        loop: true,
        controls: false,
        width: "512",
        height: "920",
        autoplay: true,
        techOrder: ["html5"],
        muted: false,
        fluid: true,
        preload: "auto",
        aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        notSupportedMessage: "此直播暂无法播放，请稍后再试",
        language: "简体中文",
        sources: [
          {
            withCredentials: false,
            type: "application/x-mpegURL",
            // type:"video/flv",
            src: ""
          }
        ],
        poster: ""
      },
      lid: null, //主播live_obj_id
      liveObj: {}, //直播对象信息
      inputMessage: "", //发送的信息
      messages: [], //聊天室信息
      attentionList: [], //我的关注列表
      isFollow: false, //是否关注主播
      diamond: 0, //钻石数
      lmoney_total: 0, //主播爱豆数
      avatar: null, //我的头像
      nickName: "", //我的昵称
      is_noble_mysterious_man: false, //是否是神秘人
      IsAudio: false, //是否是电台
      IsEnd: false, //是否直播结束
      lgId: null, //直播拉拉号
      bgPicList: [], //电台背景
      ViewNum: 0, //观看人数
      anchor_star_new: "", //主播等级
      anchorImgList: [
        //存放主播等级图片
        "/static/img/star1.png",
        "/static/img/star2.png",
        "/static/img/star3.png",
        "/static/img/star4.png",
        "/static/img/star5.png"
      ],
      loveImgList: [
        //点赞存放图片
        "/static/img/1.png",
        "/static/img/2.png",
        "/static/img/3.png",
        "/static/img/4.png",
        "/static/img/5.png"
      ],
      anImgIndex: 0, //选中主播等级下标

      nobleImgList: [
        "/static/img/noble1.png",
        "/static/img/noble2.png",
        "/static/img/noble3.png",
        "/static/img/noble4.png",
        "/static/img/noble5.png"
      ],
      bgImgList: [
        "/static/img/bg1.png",
        "/static/img/bg2.png",
        "/static/img/bg3.png",
        "/static/img/bg4.png",
        "/static/img/bg5.png",
        "/static/img/bg6.png"
      ],
      giftList: [], //礼物列表
      showListOne: [], //展示队列一
      showListTwo: [], //展示队列二
      waitingList: [], //待展示队列
      attentionShow: false, //attention组件是否显示
      loadingGetEnd: false, //get加载结束
      changegift: '', // 选择的礼物id
      changegiftOb: {}, // 选择的礼物

      my_title: "", //家族名称
      my_level: 0, //家族等级
      noble_star_new: 0, //贵族等级
      user_anchor_star_new: 0, //主播等级
      is_vip: false, //是不是VIP

      // 直播
      user_sig: null,
      im_app_id: "",
      account_type: "",
      videowidth: 517,
      videoHeight: 920,
      isSilence: false,//是否被禁言

      attentionMsg: "",
      //动画
      timer1: null, //控制状态位,
      timer2: null,
      lineOneNumber: 1, //动画队列一时间数
      lineTwoNumber: 2,

      giftNumber: [
        { value: '1', label: '1' },
        { value: '5', label: '5' },
        { value: '8', label: '8' },
        { value: '10', label: '10' },
        { value: '88', label: '88' },
        { value: '100', label: '100' },
        { value: '520', label: '520' },
        { value: '1314', label: '1314' },
      ],
      giftSendNumber: '1',
      diamondImg: "/static/img/diamond.png",   // 砖石图片
      userpclivetime: '',
    };
  },
  computed: {
    player () {
      return this.$refs.videoPlayer.player;
    }
  },

  methods: {
    //初始化IM
    initIM () {
      var _ = this;
      //基本配置
      var Config = {
        sdkappid: _.im_app_id,
        accountType: _.account_type,
        accountMode: 0, //帐号模式，0-表示独立模式，1-表示托管模式
        avChatRoomId: _.lid, //房间号ID
        UserSig: _.user_sig //用户身份凭证
      };
      //当前用户身份信息
      var nickName =
        cookie.getCookie("nickname") != ""
          ? cookie.getCookie("nickname")
          : this.nickName;
      var userId =
        cookie.getCookie("lespark_user_id") != ""
          ? cookie.getCookie("lespark_user_id")
          : this.avatar;
      this.nickName = nickName;
      var loginInfo = {
        sdkAppID: Config.sdkappid, //用户所属应用id,必填
        appIDAt3rd: Config.sdkappid, //用户所属应用id，必填
        accountType: Config.accountType, //用户所属应用帐号类型，必填，
        identifier: userId, //当前用户ID,必须是否字符串类型，选填
        identifierNick: nickName, //当前用户昵称，选填
        userSig: Config.UserSig //当前用户身份凭证，必须是字符串类型，选填
      };
      init({
        accountMode: Config.accountMode,
        accountType: Config.accountType,
        sdkAppID: Config.sdkappid,
        avChatRoomId: Config.avChatRoomId, //默认房间群ID，群类型必须是直播聊天室（AVChatRoom），这个为官方测试ID(托管模式)
        selType: webim.SESSION_TYPE.GROUP, //聊天类型 ：群聊
        selToID: Config.avChatRoomId,
        selSess: null, //当前聊天会话
        loginInfo: loginInfo
      });

      var onGroupSystemNotifys = {
        "5": onDestoryGroupNotify, //群被解散(全员接收)
        "11": onRevokeGroupNotify, //群已被回收(全员接收)
        "255": onCustomGroupNotify //用户自定义通知(默认全员接收)
      };
      //用户状态变化处理属性
      var onConnNotify = function (resp) {
        switch (resp.ErrorCode) {
          case webim.CONNECTION_STATUS.OFF:
            webim.Log.warn(
              "连接已断开，无法收到新消息，请检查下你的网络是否正常"
            );
            break;
          default:
            webim.Log.error("未知连接状态,status=" + resp.ErrorCode);
            break;
        }
      };

      //事件回调对象 listeners
      var listeners = {
        onConnNotify: onConnNotify, //用于监听用户连接状态变化的函数，选填
        onBigGroupMsgNotify: function (msg) {
          //监听消息
          _.receiveMsgs(msg);
        }, //监听新消息(大群)事件，必填
        onMsgNotify: onMsgNotify, //监听新消息(私聊(包括普通消息和全员推送消息)，普通群(非直播聊天室)消息)事件，必填
        onGroupSystemNotifys: onGroupSystemNotifys, //监听（多终端同步）群系统消息事件，必填
        onGroupInfoChangeNotify: onGroupInfoChangeNotify //监听群资料变化事件，选填
      };
      //其他对象，选填
      var options = {};

      //2.登陆
      if (accountMode == 1) {
        //托管模式
        //判断是否已经拿到临时身份凭证
        if (webim.Tool.getQueryString("tmpsig")) {
          if (loginInfo.identifier == null) {
            webim.Log.info("start fetchUserSig");
            //获取正式身份凭证，成功后会回调tlsGetUserSig(res)函数
            TLSHelper.fetchUserSig();
          }
        } else {
          //未登录,无登录态模式
          //sdk登录
          sdkLogin();
        }
      } else {
        //独立模式
        //sdk登录
        sdkLogin(loginInfo, listeners, options, Config.avChatRoomId);
      }
    },
    //发送
    sendMessage (e) {
      var _ = this;
      //判断有否登陆
      _.is_login();
      let user_id = cookie.getCookie("lespark_user_id")
      if (user_id == "") {
        _.is_login();
      }
      if (_.isSilence) {
        alert('已被禁言');
      }

      //发送input信息
      let value = _.inputMessage;
      if (!value.replace(/^\s*|\s*$/g, "")) return;
      var content = _.DealMessages(1, value);
      onSendMsg(content, function () {
        _.inputMessage = "";
      });
    },

    //改变Id
    gernerateId (index) {
      return "canvasItem_" + index;
    },

    //处理发送信息
    DealMessages (type, comment) {
      var _ = this;
      var userId = cookie.getCookie("lespark_user_id")
      var avatar = cookie.getCookie("avatar");
      if (this.is_noble_mysterious_man) {
        userId = userId + "_m";
      }
      var nickName = cookie.getCookie("nickname");

      var data =
        "{" +
        '"my_title" : "' +
        this.my_title +
        '","my_level":"' +
        this.my_level +
        '","user_id" :"' +
        userId +
        '","avatar" : "' +
        avatar +
        '","nickname" : "' +
        nickName +
        '","comment_type" :' +
        type +
        ',"comment" : "' +
        comment +
        '","is_vip":' +
        this.is_vip +
        ',"noble_star_new":' +
        this.noble_star_new +
        ',"user_anchor_star_new" : ' +
        this.user_anchor_star_new +
        "}";

      return data;
    },

    //处理收取信息
    receiveMsgs (msgs) {
      if (msgs.length > 0) {
        // console.log('===item==', JSON.stringify(msgs));
        msgs.forEach(item => {
          if (item.elems[0].type == "TIMCustomElem") {
            let content = JSON.parse(item.elems[0].content.data);
            let type = content.comment_type;
            //1.普通，3.vip评论,4点赞，5.vip进场 ,6关注了主播，
            if (
              type == 1 ||
              type == 3 ||
              type == 5 ||
              type == 10 ||
              type == 53 ||
              type == 6 ||
              type == 20 ||
              type == 31 ||
              type == 2 ||
              type == 20 ||
              type == 12 ||
              type == 7 ||
              type == 9
            ) {
              if (
                type == 1 ||
                type == 31 ||
                type == 5 ||
                type == 9
              ) {
                this.messages.push(content);
              }
              //点亮了 
              if (type == 7 || type == 10) {
                if (this.language == '简体中文') {
                  content.comment = '点亮了';

                } else if (this.language == '繁體中文') {
                  content.comment = '點亮了';

                } else if (this.language == 'English') {
                  content.comment = 'sent the heart';
                }
                this.messages.push(content);
              }

              //关注
              if (type == 6) {
                if (this.language == '简体中文') {
                  content.comment = content.nickname + '关注了主播';

                } else if (this.language == '繁體中文') {
                  content.comment = content.nickname + '關注了主播';

                } else if (this.language == 'English') {
                  content.comment = content.nickname + 'followed the anchor';
                }
                this.messages.push(content);
              }

              if (type == 53) {
                content.comment = "直播结束，主播结束";
                this.IsEnd = true;
                this.messages.push(content);
                quitBigGroup(this.lgId);
                // return (window.location.href = "index,html");
              }
              if (type == 3) {
                //系统消息
                content.nickname = "";
                content.avatar = "";
                this.messages.push(content);
              }
              if (type == 2 || type == 20) {
                if (content.live_rank != undefined) {
                  this.rank = content.live_rank;
                }
                if (content.user_count != undefined) {
                  this.view_num = content.user_count;
                }

                //送礼物
                let giftName = "我送了一个神秘礼物";
                let isSVGA = 0;
                let imgPic = null;
                let svgaUrl = null;

                console.log('=====content.gift_type============', content);
                //模拟数据
                // content.gift_type = 379;
                // content.gift_num = this.giftSendNumber;

                //找出对应礼物类型对应的名称
                for (let i = 0; i < this.giftList.length; i++) {
                  if (this.giftList[i].type == content.gift_type) {
                    giftName = this.giftList[i].name;
                    isSVGA = this.giftList[i].isSVGA;
                    svgaUrl = this.giftList[i].svgaUrl;
                    imgPic = this.giftList[i].imgPic;
                  }
                }
                //加入队列
                let waitingItem = {};
                waitingItem["nickName"] = content.nickname;
                waitingItem["avatar"] = content.avatar;
                waitingItem["giftName"] = giftName;
                waitingItem["giftNum"] = content.gift_num;
                waitingItem["giftType"] = content.gift_type;
                waitingItem["imgPic"] = imgPic; //图片路径
                waitingItem["isSVGA"] = isSVGA;
                waitingItem["svgaUrl"] = svgaUrl;
                waitingItem["state"] = 0; //状态位
                waitingItem["num"] = 1; //开始数量
                this.waitingList.push(waitingItem);
                content.comment = giftName + "X" + content.gift_num;

                console.log('=====我进来了送礼物============', waitingItem);
                // this.joinItem();
                this.messages.push(content);
              }

              if (type == 12) {
                //收发观看内容
                if (content.live_rank != undefined) {
                  this.rank = content.live_rank;
                }
                if (content.user_count != undefined) {
                  this.view_num = content.user_count;
                }
              }
            }
          }
        });
      }
    },

    //获取展示队列长度
    showLen (ele) {
      return ele.length;
    },
    //清空队列
    clearList (ele) {
      ele = [];
    },
    //判断队列是否为空
    isEmpty (ele) {
      return ele.length === 0;
    },
    //获取等待队列第一个
    hasfront () {
      return this.waitingList.shift();
    },

    //加入队列
    joinItem () {
      var _ = this;
      var waitingList = _.waitingList;
      var one = _.showListOne;
      var two = _.showListTwo;
      if (waitingList.length > 0) {
        let firstItem = _.hasfront();
        //选择加入的队列
        if (_.showListOne.length <= 0) {
          _.showListOne.push(firstItem);
          _.playItem(0);
        } else if (_.showListTwo.length <= 0) {
          _.showListTwo.push(firstItem);
          _.playItem(1);
        } else {
          return;
        }
      }
    },

    //监听状态位 0未完成, 1完成
    ObserveStateOne (e) {
      let _ = this;
      let timer = _.timer1;
      let one = _.showListOne;
      timer = setInterval(() => {
        //分别判断两个队列
        if (!_.isEmpty(one)) {
          if (_.showListOne[0]["state"] == 1) {
            _.showListOne[0]["state"] = _.showListOne[0]["giftNum"];
            _.showListOne.splice(0, 1);
          }
        } else {
          _.joinItem();
        }
      }, 500);
    },

    ObserveStateTwo (e) {
      let _ = this;
      let timer = _.timer2;
      let two = _.showListTwo;
      timer = setInterval(() => {
        if (!_.isEmpty(two)) {
          if (_.showListTwo[0]["state"] == 1) {
            _.showListTwo[0]["state"] = _.showListTwo[0]["giftNum"];
            _.showListTwo.splice(0, 1);
          }
        } else {
          _.joinItem();
        }
      }, 499);
    },

    //选择播放
    playItem (type) {
      let _ = this;
      let id = type;
      let i = 0;
      console.log('===showListOne====', _.showListOne);
      if (type == 0) {
        if (_.showListOne[0]["state"] != 1) {
          let scaleNumber = _.showListOne[0].giftNum;
          let NumberTimer = null;
          let num = 1;
          if (_.showListOne[0]["isSVGA"] == 1) {
            //播放SVGA
            var Gifttype = _.showListOne[0].giftType;
            this.$nextTick(function () {
              _.playSVGA(id, Gifttype, scaleNumber);
            });
          }
          NumberTimer = setInterval(() => {
            if (num == scaleNumber) {
              clearInterval(NumberTimer);
              _.showListOne[0]["num"] = scaleNumber;
              if (_.showListOne[0]["isSVGA"] == 0) {
                _.showListOne[0]["state"] = 1;


              } else {
                //控制svga 当连击数时长大于svga时长
                _.lineOneNumber = num;
              }
            } else {
              _.showListOne[0]["num"] = num;
              num++;
            }
          }, 949);
        }
      } else if (type == 1) {
        if (_.showListTwo[0]["state"] != 1) {
          let NumberTimer = null;
          let scaleNumber = _.showListTwo[0].giftNum;
          let num = 1;
          if (_.showListTwo[0]["isSVGA"] == 1) {
            //播放SVGA
            var Gifttype = _.showListTwo[i].giftType;
            this.$nextTick(function () {
              _.playSVGA(id, Gifttype, scaleNumber);
            });
          }
          NumberTimer = setInterval(() => {
            if (num == scaleNumber) {
              _.showListTwo[0]["num"] = scaleNumber;
              clearInterval(NumberTimer);
              if (_.showListTwo[0]["isSVGA"] == 0) {
                _.showListTwo[0]["state"] = 1;
              } else {
                //控制svga 当连击数时长大于svga时长
                _.lineTwoNumber = num;
              }
            } else {
              _.showListTwo[0]["num"] = num;
              num++;
            }
          }, 949);
        }
      }
    },

    //使用svga动画
    /** 
    i  队列
    number 礼物类型
    giftNum 礼物最大数量
    **/
    playSVGA (i, type, gNumber) {
      let _ = this;
      let id;
      let giftNum = gNumber;
      if (i == 0) {
        id = "canvasOne";
      } else {
        id = "canvasTwo";
      }
      var player = new SVGA.Player("#" + id);
      player.loops = giftNum;
      var parser = new SVGA.Parser("#" + id);
      var url = "http://img-live.lespark.cn/animation/" + type + ".svga";
      parser.load(
        url,
        function (videoItem) {
          player.setVideoItem(videoItem);
          player.startAnimation();

          player.onFinished(function (res) {
            if (i == 0 && _.lineOneNumber == giftNum) {
              player.stopAnimation();
              player.clearDynamicObjects();
              _.showListOne[0]["state"] = 1;
              _.lineOneNumber = 1;
            } else if (i == 1 && _.lineTwoNumber == giftNum) {
              player.stopAnimation();
              player.clearDynamicObjects();
              _.showListTwo[0]["state"] = 1;
              _.lineTwoNumber = 1;
            } else {
              player.startAnimation();
            }
          });
        },
        function (error) {
          if (i == 0 && _.lineOneNumber == giftNum) {
            player.stopAnimation();
            player.clearDynamicObjects();
            _.showListOne[0]["state"] = 1;
            _.lineOneNumber = 1;
          } else if (i == 1 && _.lineTwoNumber == giftNum) {
            player.stopAnimation();
            player.clearDynamicObjects();
            _.showListTwo[0]["state"] = 1;
            _.lineTwoNumber = 1;
          } else {
            player.startAnimation();
          }
        }
      );
    },


    //获取url的动态参数
    getParamsId () {
      var url = window.location.href;
      var r = url.lastIndexOf('/');
      var id = url.slice(r + 1, r.length);
      return id;
    },

    //获取外部参数
    getQueryArgument () {
      var that = this
      let id = Utils.getQueryString("id");
      if (id == '' || id == undefined) {
        id = this.getParamsId();
      }
      that.lgId = id;
      //先获取直播间数据
      ajax
        .Get({
          url: userUrl + "/pc_live_view?lgid=" + that.lgId,
          data: {
            lgid: that.lgId,
          },
          headers: {
            bundle_id: "pc",
            'bundle-id': 'pc',
            lang: "zh-hans",
            token: cookie.getCookie("lespark_token") || "",
            user_id: cookie.getCookie("lespark_user_id"),
            //token: "8e56647f892c0a42d0e215cdb1f29e2d",
            //user_id: "5ba06ceed3b46465cc2130f8",
            "content-type": "application/x-www-form-urlencoded"
          }
        })
        .then(res => {
          that.countData = res.data
          that.lid = res.data.live_obj_id;
          //判断是否私密直播间
          that.isSecret(that.countData.live_obj_id)
        })
    },

    unique (arr) {
      return Array.from(new Set(arr));
    },

    backTop () {
      window.scrollTo(0, 0);
      this.iftotop = false;
    },
    ifscroll () {
      var _this = this;
      window.addEventListener("scroll", function () {
        if (document.documentElement.scrollTop == 0) {
          _this.iftotop = false;
        } else {
          _this.iftotop = true;
        }
      });
    },


    quitGroup () {
      var lgId = this.lgId;
      quitBigGroup(lgId, function () {
        logout();
      })
    },
    //获取直播间信息Post
    getLiveView () {
      if (!this.firstPost) return;
      ajax
        .Post({
          url: userUrl + "/pc_live_view",
          data: {
            lgid: this.lgId
          },
          headers: {
            bundle_id: "pc",
            'bundle-id': 'pc',
            lang: "zh-hans",
            token: cookie.getCookie("lespark_token") || '',
            user_id: cookie.getCookie("lespark_user_id")
            // token: "8e56647f892c0a42d0e215cdb1f29e2d",
            //user_id: "5ba06ceed3b46465cc2130f8"
          }
        })
        .then(res => {
          let { data } = res;
          let {
            add_date,
            live_obj_id,
            is_user_follow_live_user,
            live_user_lgid,
            live_ban,
            live_end,
            is_audio,
            is_noble_mysterious_man,
            is_silence,
            mysterious_man_nickname,
            mysterious_man_avatar,
            tags,
            // user_sig,
            my_level,
            my_title
          } = data;
          //是否禁止进入
          if (live_ban) {
            alert('禁止进入直播间');
            window.location.href = "../index.html";
            return;
          }
          //是否神秘人
          if (is_noble_mysterious_man) {
            this.is_noble_mysterious_man = is_noble_mysterious_man;
            this.avatar = mysterious_man_avatar;
            this.nickName = mysterious_man_nickname;
          }
          //电台还是直播
          if (is_audio) {
            this.IsAudio = is_audio;
          } else {
            if (live_end) {
              this.IsEnd = live_end;
            }
          }
          //被禁言
          if (is_silence) {
            this.isSilence = is_silence;
          }
          this.lid = live_obj_id;
          this.lgId = live_user_lgid;
          this.isFollow = is_user_follow_live_user;
          this.tags = tags;
          this.my_level = my_level;
          this.my_title = my_title;
          this.firstPost = false;
          this.userpclivetime = Utils.formatTime(add_date, 'Y.M.D');

          // this.user_sig = data.user_sig;
        })
        .then(() => {
          this.initIM();
        });
    },

    //获取直播间信息(游客/初始化get)
    getLiveViewTwo (lid) {
      var that = this
      var data = that.countData;
      let {
        live_obj_id,
        live_lgid,
        live_ban,
        live_end,
        is_audio,
        anchor_star_new,
        view_num,
        hourly_rank
      } = data;
      //是否禁止进入
      if (live_ban) {
        alert('禁止进入直播间');
        window.location.href = "../index.html"
        return;
      }
      //电台还是直播
      if (is_audio) {
        this.IsAudio = is_audio;
        if (this.IsAudio) {
          this.videowidth = 0;
          this.videoHeight = 0;
        }
      } else {
        if (live_end) {
          this.IsEnd = live_end;
        }
      }
      this.lid = live_obj_id;
      this.lgId = live_lgid;
      this.view_num = view_num;
      this.rank = hourly_rank;
      if (anchor_star_new > 0 && anchor_star_new <= 20) {
        this.anImgIndex = 0;
      } else if (anchor_star_new >= 21 && anchor_star_new <= 40) {
        this.anImgIndex = 1;
      } else if (anchor_star_new >= 41 && anchor_star_new <= 60) {
        this.anImgIndex = 2;
      } else if (anchor_star_new >= 61 && anchor_star_new <= 80) {
        this.anImgIndex = 3;
      } else if (anchor_star_new >= 81 && anchor_star_new <= 100) {
        this.anImgIndex = 4;
      }
      this.anchor_star_new = anchor_star_new;
      this.account_type = data.account_type;
      this.user_sig = data.user_sig;
      this.im_app_id = data.im_app_id;
      this.diamond = data.diamond_now;
      this.bgPicList = data.fm_bgpic_path;
      let liveObj = {};
      liveObj["LiveId"] = data.live_user_id;
      liveObj["LiveNickName"] = data.live_nickname;
      liveObj["LiveAvatar"] = data.live_avatar;
      liveObj["ImoneyTotal"] = data.lmoney_total;
      liveObj["LiveRtmpUrl"] = data.hls_url;
      let path = data.hls_url;

      this.author_live = data.live_nickname
      cookie.setCookie('author_live', data.live_nickname)
      // 标题
      var cookie_language = cookie.getCookie('language') != '' ? cookie.getCookie('language') : '简体中文'
      if (cookie_language == '简体中文') {
        window.document.title =
          '“' + data.live_nickname + "”的直播间 - LesPark 直播";
      }
      else if (cookie_language == '繁體中文') {
        window.document.title =
          '“' + data.live_nickname + "”的直播间 - LesPark 直播";
      }
      else if (cookie_language == 'English') {
        window.document.title =
          '“' + data.live_nickname + "”的直播间 - LesPark Live";
      }
      // window.document.title =
      //   data.live_nickname + "的直播间 - LesPark 直播 ";
      this.loadingGetEnd = true;
      this.playerOptions.sources[0].src = path;
      this.liveObj = liveObj;
      let tips = data.live_notice; //直播间提示
      tips = tips.replace('，或关注微信公众号：LesPark', "").replace('，或關註微信公眾號：LesPark', "")
        .replace('Any questions please follow the WeChat account: LesPark', "")
      let tipsObj = {
        avatar: "",
        nickname: "",
        comment: tips,
        comment_type: 3
      };
      let messages = [];
      messages.push(tipsObj);
      this.messages = messages;

      //判断是否有登录
      let userId = cookie.getCookie("lespark_user_id");
      let token = cookie.getCookie("lespark_token") || '';
      if (userId != "" && token != "") {
        this.getLiveView();
      } else {
        this.initIM();
      }



    },
    //判断私密聊天室密码是否正确
    openLive: function (pwd) {
      var that = this
      var live_obj_id = that.lid
      ajax
        .Post({
          url: userUrl + "/secret_live_pwd/judge",
          data: {
            live_view_pwd: pwd,
            live_obj_id: live_obj_id
          },
          headers: {
            bundle_id: "pc",
            'bundle-id': 'pc',
            lang: "zh-hans",
            user_id: cookie.getCookie("lespark_user_id"),
            token: cookie.getCookie("lespark_token") || ''
          }
        })
        .then(ref => {
          if (ref.error == 0) {
            that.getGiftList();
            that.getLiveViewTwo(that.lgId);
          } else {
            this.$message({
              type: "info",
              message: ref.msg
            });
            that.isSecret(live_obj_id)
          }
        })
        .catch(ref => {
          this.$message({
            type: "error",
            message: ref.msg
          });
          that.isSecret(live_obj_id)
        });
    },
    //判断是否私密聊天室
    isSecret (live_obj_id) {
      var that = this
      ajax
        .Get({
          url: userUrl + "/is_secret_room?live_obj_id=" + live_obj_id,
          headers: {
            bundle_id: "pc",
            'bundle-id': 'pc',
            lang: "zh-hans",
            token: cookie.getCookie("lespark_token"),
            user_id: cookie.getCookie("lespark_user_id"),
            //token: "8e56647f892c0a42d0e215cdb1f29e2d",
            //user_id: "5ba06ceed3b46465cc2130f8",
            "content-type": "application/x-www-form-urlencoded"
          }
        })
        .then(res => {
          if (res.error == 0) {
            //1为私密聊天室
            if (res.data.is_secret_live) {
              //显示密码输入框
              this.$prompt("请输入直播间密码", "提示", {
                confirmButtonText: "确定",
                inputPattern: /^[0-9]\d*$/,
                inputType: "password",
                showClose: false,
                showCancelButton: false,
                closeOnClickModal: false,
                inputErrorMessage: "密码格式不正确",
                inputPlaceholder: '密码为纯数字哦',
                closeOnPressEscape: false,
                lockScroll: false
              })
                .then(({ value }) => {
                  this.openLive(value);
                })
                .catch(() => {

                });
            } else {
              that.getGiftList();
              that.getLiveViewTwo(that.lgId);
            }
          } else {
            this.$message({
              type: "info",
              message: '网络错误或者房间已关闭,即将为您返回首页。'
            })
            setTimeout(() => {
              location.href = '../index.html#hot';
            }, 2000)
          }
        })
        .catch(res => {
          console.log(res)
        })
    },
    //获取礼物列表
    getGiftList () {
      ajax
        .Get({
          url: userUrl + "/pc_live_gift_list",
          headers: {
            bundle_id: "pc",
            'bundle-id': 'pc',
            lang: "zh-hans",
            token: cookie.getCookie("lespark_token"),
            user_id: cookie.getCookie("lespark_user_id"),
            // token: "8e56647f892c0a42d0e215cdb1f29e2d",
            // user_id: "5ba06ceed3b46465cc2130f8",
            "content-type": "application/x-www-form-urlencoded"
          }
        })
        .then(res => {
          let giftTypeList = [];
          var data = res.data;
          let hiddenList = data.hidden_list;
          let giftClassList = data.gift_class_list;

          let giftDetail = [];
          for (let i = 0; i < giftClassList.length; i++) {
            giftDetail = giftDetail.concat(giftClassList[i]["gift_details"]);
          }
          //合并，去重
          // let giftList = hiddenList.concat(giftDetail);
          let giftList = giftDetail;
          giftList = this.unique(giftList);
          for (let i = 0; i < giftList.length; i++) {
            let item = {};
            item.type = giftList[i].gift_type;
            item.name = giftList[i].gift_message;
            item.giftName = giftList[i].gift_name;
            item.isSVGA = giftList[i].is_svga;
            item.isVip = giftList[i].is_vip;
            item.imgPic = giftList[i].gift_pic; //礼物图片
            item.svgaUrl = giftList[i].svga_url;//svga礼物路径，如果没有返回空字符串
            item.giftDiamonds = giftList[i].gift_diamonds; //单价
            giftTypeList[i] = item;
          }
          this.giftList = giftTypeList;
        });
    },

    //关注
    followAnchor () {
      let _ = this;
      //没登录，弹出登录框
      _.is_login();
      let user_id = cookie.getCookie("lespark_user_id");
      if (user_id == "") {
        _.is_login();
        return;
      }
      //是否有关注
      let url = "";
      let toUid = this.liveObj["LiveId"];
      if (!_.isFollow) {
        url = userUrl + "/friendship/follow/" + user_id + "/" + toUid;
      }
      ajax.Get({
        url: url,
        data: {
          time: Math.random()
        },
        headers: {
          bundle_id: "pc",
          'bundle-id': 'pc',
          lang: "zh-hans",
          token: cookie.getCookie("lespark_token"),
          user_id: cookie.getCookie("lespark_user_id"),
          // token: "8e56647f892c0a42d0e215cdb1f29e2d",
          // user_id: "5ba06ceed3b46465cc2130f8",
          "content-type": "application/x-www-form-urlencoded"
        }
      })
        .then(res => {
          let action = res.data.action;
          _.$bus.emit("clickFollow", action);
          if (action == "follow") {
            this.isFollow = !this.isFollow;
            var value = "关注了主播";
            var content = _.DealMessages(6, value);
            onSendMsg(content);
          }
        })
        .catch(error => {
        });
    },

    //是否登录
    is_login () {
      let _ = this;
      let token = cookie.getCookie("lespark_token");
      let user_id = cookie.getCookie("lespark_user_id");
      if (token == null || token == "") {
        _.$bus.emit("noLoginInfo", true);
      }
      if (user_id == null || user_id == "") {
        _.$bus.emit("noLoginInfo", true);
      }
    },

    playerReadied (player) {
    },
    //热门
    toHot () {
      this.$nextTick(function () {
        var hot = document.getElementById("livehot").offsetTop;
        var scollTop = hot + 140;
        window.scrollTo(0, scollTop);
      });
    },
    //去关注
    toFollow () {
      this.is_login();
      let user_id = cookie.getCookie("lespark_user_id");
      if (user_id == "") {
        this.is_login();
        return;
      }
      this.$nextTick(function () {
        var attention = document.getElementById("attention").offsetTop;
        var scollTop = attention + 140;
        window.scrollTo(0, scollTop);
      });
    },
    changegiftItem (_item) {
      this.changegiftOb = _item;
      this.changegift = _item.type;
    },
    sendLiveGift () {
      let _ = this;
      // console.log('=====this.changegift=======', this.changegift);
      // console.log('=====this.giftSendNumber=======', this.giftSendNumber);
      // console.log('=====this.changegiftOb=======', this.changegiftOb);
      // let _da = [
      //   {
      //     "sess": {
      //       "_impl": {
      //         "skey": "GROUP5ee87f408117177053ce91c7",
      //         "type": "GROUP",
      //         "id": "5ee87f408117177053ce91c7",
      //         "name": "5ee87f408117177053ce91c7",
      //         "icon": "",
      //         "unread": 0,
      //         "isAutoRead": false,
      //         "time": 0,
      //         "curMaxMsgSeq": 0,
      //         "msgs": [],
      //         "isFinished": 1
      //       }
      //     },
      //     "subType": 0,
      //     "fromAccount": "5e5a6899c714335cb4660384",
      //     "fromAccountNick": "5e5a6899c714335cb4660384",
      //     "isSend": false,
      //     "seq": 2705,
      //     "random": 374529016,
      //     "time": 1592302315,
      //     "elems": [
      //       {
      //         "type": "TIMCustomElem",
      //         "content": {
      //           "data": "{\"user_id\":\"5e5a6899c714335cb4660384\",\"nickname\":\"九千七.🐾\",\"avatar\":\"http:\\/\\/img2.lespark.cn\\/aliclientDLywmRXYpnONmmwqtI\",\"lgid\":\"9940632\",\"comment_type\":2,\"comment_sub_type\":12,\"rtc_message_type\":12,\"user_rtc_list\":[],\"is_disable_video\":false,\"live_many_people_type\":6,\"kIsMarryLive\":false,\"kMarryGiftId\":\"220\",\"kMarryGiftIcon\":\"http:\\/\\/img-live.lespark.cn\\/gift\\/220_1521774599619.png\",\"kMarryGiftNumber\":0,\"kMarryGiftPrice\":1,\"kMarryGiftName\":\"彩虹之心\",\"liveMusicName\":\"你的答案（女声完整版）（Cover：阿冗）\",\"is_slience\":false,\"liveManyVideoFreeInviteKey\":false,\"comment\":\"\"}",
      //           "desc": "",
      //           "ext": ""
      //         }
      //       }
      //     ],
      //     "uniqueId": "11618261064696"
      //   }
      // ];
      // _.receiveMsgs(_da);
      // return;
      if (_.changegift && _.giftSendNumber) {
        console.log('=====this.showListOne=======', _.showListOne);

        //没登录，弹出登录框
        _.is_login();
        let user_id = cookie.getCookie("lespark_user_id");
        if (user_id == "") {
          _.is_login();
          return;
        }

        let url = userUrl + "/live_comment";
        let _pr = {
          "comment_type": "2",  //送礼类型，2直播间送礼
          "live_obj_id": _.lid,  //送礼的直播间id
          "to_user_id": _.liveObj["LiveId"],  //收礼的用户id
          // "pk_id": "5ee2f893a19ea620d95b5e2b",  //pk房间的id
          "gift_type": _.changegiftOb['type'],  //礼物id
          "gift_num": _.giftSendNumber,  //送礼数量
          "diamond_num": _.changegiftOb['giftDiamonds'],  //礼物单价
          "time": Math.random()
        };
        ajax.Post({
          url: url,
          data: _pr,
          headers: {
            bundle_id: "pc",
            'bundle-id': 'pc',
            lang: "zh-hans",
            token: cookie.getCookie("lespark_token"),
            user_id: cookie.getCookie("lespark_user_id"),
            "content-type": "application/x-www-form-urlencoded"
          }
        })
          .then(ref => {
            if (ref.error == 0) {
              _.diamond = ref.data.diamond_now;
            } else {
              this.$message({
                type: "info",
                message: ref.msg
              });
            }
          })
          .catch(ref => {
            this.$message({
              type: "error",
              message: ref.msg
            });
          });
      }
    },
    // 充值
    pay () {
      window.open('//api.lespark.cn/paynow_order?language=' + encodeURIComponent(encodeURIComponent(this.language)))
    },
    gotoUserInfo () {
      // console.log(this.liveObj["LiveId"]);
      // location.href = '../userinfo.html?id=' + this.liveObj["LiveId"];
      window.open('../userinfo.html?id=' + this.liveObj["LiveId"], '_blank');
    },
  },
  watch: {
    attentionMsg (a, b) {
      if (a == "headerto") {
        bus.$emit("lastAttentionShow", "yes");
      } else {
        bus.$emit("lastAttentionShow", "no");
      }
    }
  },
  created () {

    this.getQueryArgument();

    let token =
      cookie.getCookie("lespark_token") != "" ? cookie.getCookie("lespark_token") : "";
    if (token == "") {
      this.attentionShow = false;
    } else {
      this.attentionShow = true;
    }


  },
  mounted () {
    var that = this;
    window.addEventListener('scroll', this.ifscroll);
    bus.$on("userLiveShow", function (msg) {
      that.attentionMsg = msg;
      that.getLiveViewTwo(that.lgId);
    });

    bus.$on('quit', function (res) {
      that.quitGroup();
    })
    that.language = cookie.getCookie('language') != '' ? cookie.getCookie('language') : '简体中文';
    // alert(that.language);
    bus.$on('bannerImg', function (res) {
      // alert(res);
      that.language = res;
    })

    setTimeout(() => {
      this.showTip = false;
    }, 2500);

    this.ObserveStateOne();
    this.ObserveStateTwo();
  },
  beforeDestroy () {
    this.$refs.videoPlayer.dispose();
    clearInterval(this.timer1);
    clearInterval(this.timer2);
  }
};
</script>

<style scoped>
input::-webkit-input-placeholder {
  color: #a8a8a8;
}

input:focus::-webkit-input-placeholder {
  color: #a8a8a8;
}

.video-js.vjs-fluid,
.video-js.vjs-16-9,
.video-js.vjs-4-3 {
  width: 100%;
  max-width: 100%;
}

#dplayer {
  width: 517px;
  height: 920px;
  margin: 0 auto;
}

.userLive {
  width: 100%;
  position: relative;
  background-color: rgba(245, 245, 245, 1);
}

.video-js,
#video-js {
  width: 517px;
  height: 920px;
}

.hasLeft {
  margin-left: 38px;
}

.giftColor {
  color: #ff99cc;
}

.shareColor {
  color: #44ffdd;
}

.totop {
  width: 100px;
  height: 100px;
  position: fixed;
  right: 0;
  bottom: 0;
  z-index: 999;
}

.totopimg {
  width: 100%;
  height: auto;
}

.disSend {
  color: grey;
}
.userinfoandhot {
  width: 186px;
  height: 900px;
  background-color: #fff;
  color: #333333;
  overflow: hidden;
  text-align: center;
  padding-top: 20px;
  font-family: PingFangSC-Regular, PingFang SC;
  margin-right: 15px;
}
.userinfoandhot .live_user_id,
.userinfoandhot .live_user_1 {
  font-size: 12px;
  line-height: 20px;
  font-weight: 400;
  padding-top: 5px;
  color: rgba(51, 51, 51, 1);
}
.userinfoandhot .live_user_2 {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  background: #a201ff;
  display: -webkit-inline-box;
  display: -ms-inline-flexbox;
  display: inline-flex;
  display: -webkit-inline-flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
}
.userinfoandhot .live_hot_title {
  padding: 12px 0;
  margin-bottom: 12px;
  margin-top: 10px;
  font-size: 18px;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  box-shadow: 0px -1px 0px 0px rgba(235, 235, 235, 1),
    0px 1px 0px 0px rgba(235, 235, 235, 1);
  border-radius: 12px 12px 0px 0px;
}
.userinfoandhot .live_hot_content {
  /* height: 650px;
  overflow: hidden; */
  /* overflow-y: scroll; */
}
.attentionContent {
  padding: 1px 0;
  margin: 0 auto;
  width: 1187px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 4px 0px rgba(216, 216, 216, 0.3),
    0px -2px 4px 0px rgba(216, 216, 216, 0.3);
  border-radius: 6px;
}
.tc_yy {
  box-shadow: 0px 2px 4px 0px rgba(216, 216, 216, 0.3),
    0px 2px 4px 0px rgba(216, 216, 216, 0.3),
    0px -2px 4px 0px rgba(216, 216, 216, 0.3);
  border-radius: 6px 6px 0px 0px;
}
.tc_yy2 {
  box-shadow: 0px 2px 4px 0px rgba(216, 216, 216, 0.3),
    0px -2px 4px 0px rgba(216, 216, 216, 0.3);
  border-radius: 6px;
}
.ll_cursor {
  cursor: pointer;
}
</style>