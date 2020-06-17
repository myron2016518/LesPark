<!-- 登录组件 -->
<template>
	<div>
		<div class="layer" @click="disappear(close)" v-bind:style="{height:screenHeight,width:screenWidth}"></div>
		<div class="login">
			<!-- 手机号码 -->
			<div class="login_this">
				<div class="mode">
					<p @click="denglu" v-bind:class="dengluShow==true?'choose':''">{{$t('login.nav1')}}</p>
					<p @click='reg' v-bind:class="regShow==true?'choose':''">{{$t('login.nav2')}}</p>
				</div>

				<!-- 登录 -->
				<div @keyup.enter="enter" v-show="dengluShow" class="this_log">
					<select v-model="nationalCode">
						<option selected>{{$t('login.input3')}}（+86）</option>
						<option>{{$t('login.input4')}}（+1）</option>
						<option>{{$t('login.input5')}}（+886）</option>
						<option>{{$t('login.input6')}}（+852）</option>
						<option>{{$t('login.input7')}}（+853）</option>
						<option>{{$t('login.input8')}}（+66）</option>
						<option>{{$t('login.input9')}}（+60）</option>
						<option>{{$t('login.input10')}}（+65）</option>
						<option>{{$t('login.input11')}}（+81）</option>
						<option>{{$t('login.input12')}}（+82）</option>
						<option>{{$t('login.input13')}}（+61）</option>
						<option>{{$t('login.input14')}}（+44）</option>
						<option>{{$t('login.input15')}}（+63）</option>
						<option>{{$t('login.input16')}}（+84）</option>
					</select>
					<input v-model="log_phone" class="this_log_phone" type="text" v-bind:placeholder="input1">
					<input v-model="log_password" class="this_log_password" type="password" v-bind:placeholder="input2">
					<div @click="login" class="this_log_button">
						<img src="../images/login_button.png">
						<a>{{$t('login.nav8')}}</a>
					</div>
				</div>

				<!-- 注册 -->
				<div v-show="regShow" class="this_reg">
					<div class="this_reg_download">
						<img v-show="regUrlShow" class="download_img" :src="regUrl">
						<img v-show="!regUrlShow" class="download_img" src="../images/download.png">
					</div>
					<div class="this_reg_download_tips">
						<p>{{$t('login.nav5')}}</p>
						<p>{{$t('login.nav6')}}</p>
					</div>
				</div>
			</div>

			<!-- 分割线 -->
			<div class="line">
				<span></span>
				<a>{{$t('login.nav7')}}</a>
				<span></span>
			</div>

			<!-- 其他登录 -->
			<div class="login_other">
				<div class="close" @click="disappear(close)"><img src="../images/close.png"></div>
				<p class="other" v-show='dengluShow'>{{$t('login.nav3_1')}}</p>
				<p class="other" v-show="regShow">{{$t('login.nav3_2')}}</p>
				<div class="other_mode">
					<ul>
						<li class="other_mode_ul_li" @click="otherLog(wx)" href=""><img src="../images/wx.png"></li>
						<li href="" @click="otherLog(qq)"><img src="../images/QQ_default.png"></li>
						<li class="other_mode_ul_li" @click="otherLog(xinlang)" href=""><img
								src="../images/xinlang.png"></li>
					</ul>
					<ul>
						<li class="other_mode_ul_li" @click="otherLog(facebook)" href=""><img
								src="../images/facebook.png"></li>
						<li class="other_mode_ul_li" @click="otherLog(ins)" href=""><img src="../images/ins.png"></li>
						<li class="other_mode_ul_li" @click="otherLog(line)" href=""><img src="../images/line.png"></li>
					</ul>
				</div>
				<div class="other_tips">
					<p>{{$t('login.nav4')}}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import md5 from 'js-md5';
	import Vue from 'vue'
	import bus from 'Common/events-bus';
	import * as cookie from 'Common/cookie';
	import ajax from 'Common/ajax';
	import constans from 'Constans';
	import "babel-polyfill";
	import promise from "es6-promise";
	import VueI18n from 'vue-i18n'

	import 'Views/css/reset.css'
	import 'Views/css/login.css'

	const userUrl = constans.AllUrl.url.dev
	//应用id
	const wx_appid = constans.AllUrl.appid.wx //微信appid
	const qq_client_id = constans.AllUrl.appid.qq //QQ client_id
	const xinlang_client_id = constans.AllUrl.appid.xinlang //新浪client_id
	const facebook_client_id = constans.AllUrl.appid.facebook //facebook client_id
	const ins_client_id = constans.AllUrl.appid.ins //ins client_id
	const line_client_id = constans.AllUrl.appid.line //line client_id
	//回调地址
	const wx_redirect_uri = constans.AllUrl.redirect_uri.wx_url //微信回调地址
	const qq_redirect_uri = constans.AllUrl.redirect_uri.qq_url //QQ回调地址
	const xinlang_redirect_uri = constans.AllUrl.redirect_uri.xinlang_url //新浪回调地址
	const facebook_redirect_uri = constans.AllUrl.redirect_uri.facebook_url //facebook回调地址
	const ins_redirect_uri = constans.AllUrl.redirect_uri.ins_url //ins回调地址
	const line_redirect_uri = constans.AllUrl.redirect_uri.line_url //line回调地址

	Vue.use(VueI18n)

	const i18n = new VueI18n({
		locale: 'zh', // 语言标识 
		messages: {
			'zh': require('static/js/zh'),
			'zh_f': require('static/js/zh-f'),
			'en': require('static/js/en')
		}
	})

	export default {
		name: 'login',
		props: ['msglogin'],
		data() {
			return {
				dengluShow: true, //显示登录框
				regShow: false,	//显示注册框
				close: 'close',	//判断子组件传给父组件的值
				screenHeight: '', //屏幕高度
				nationalCode: '中国（+86）',	//国家代码
				log_phone: '', //手机号码
				log_password: '', //密码
				language: cookie.default.getCookie('language') != '' ? cookie.default.getCookie('language') : '',

				// 判断其他登录入口
				wx: 'wx',
				qq: 'qq',
				xinlang: 'xinlang',
				facebook: 'facebook',
				ins: 'ins',
				line: 'line',
				avatar: '',

				token: '',
				user_id: '',
				nickname: '',
				lgid: '',

				input1: this.$t('login.input1'),
				input2: this.$t('login.input2'),

				msg: '',
				englishLogin: false,

				screenHeight: '',
				screenWidth: '',

				regUrl: '',
				regUrlShow: false,
			}
		},
		created() {
			var that = this
			that.screenWidth = window.screen.availWidth + 'px'
			that.screenHeight = window.screen.availHeight + 'px'
			if (that.language == 'English') {
				that.englishLogin = true
			} else {
				that.englishLogin = false
			}

			var start = that.nationalCode.indexOf('（')
			var end = that.nationalCode.length
			var answer = that.$t('login.input3') + that.nationalCode.slice(start, end)
			// console.log(answer)
			that.nationalCode = answer
			// console.log(window.location.href)
		},
		mounted() {
			var that = this
			bus.$on('CL', function (msg) {
				if (msg == 'CL_en') {
					that.englishLogin = true
				} else {
					that.englishLogin = false
				}
				that.msg = msg
				that.input1 = that.$t('login.input1')
				that.input2 = that.$t('login.input2')
				that.input3 = that.$t('login.input3')
				that.input4 = that.$t('login.input4')

				var start = that.nationalCode.indexOf('（')
				var end = that.nationalCode.length
				var answer = that.$t('login.input3') + that.nationalCode.slice(start, end)
				that.nationalCode = answer
			})

			bus.$on('regUrl', function (msg) {
				if (msg != '' || msg != undefined) {
					// alert(msg)
					that.regUrl = msg
					that.regUrlShow = true
				}
			})
		},
		methods: {
			// 切换登录
			denglu() {
				var that = this
				that.dengluShow = true
				that.regShow = false
			},
			// 切换注册
			reg() {
				var that = this
				that.dengluShow = false
				that.regShow = true
			},
			// 弹框消失
			disappear(e) {
				var that = this
				// console.log(e)
				// that.$emit("showChanged",false)
				if (e == 'close') {
					that.$emit("showChanged", false)
				} else if (e == undefined) {
					that.$emit("showChanged", 'islogin');

				}
			},
			// 登录按钮(手机号码登录)
			login() {
				var that = this

				let start = that.nationalCode.indexOf('（') + 2
				let end = that.nationalCode.indexOf('）')
				let code = that.nationalCode.slice(start, end)

				// 判断手机号码
				// if(that.log_phone.length<11)
				// {
				// alert('输入号码错误')
				// return
				// }
				// 判断是否有输入密码
				if (that.log_password.length < 1) {
					alert('输入密码错误')
					return
				}

				let phone = code + that.log_phone
				let password = md5(that.log_password)

				// 登录请求
				ajax.Post({
					url: userUrl + '/phone_login',
					data: {
						phone: phone,
						password: password,
						verion: 1,
					},
					headers: {
						bundle_id: 'pc',
						'bundle-id': 'pc',
						lang: 'zh-hans',
						user_id: cookie.default.getCookie("lespark_user_id") || "",
						token: cookie.default.getCookie("lespark_token") || ''
					},
				}).then(ref => {
					// console.log('is here!===>',ref)
					if (ref.error == 0) {
						cookie.default.setCookie('lespark_token', ref.data.token)
						cookie.default.setCookie('lespark_user_id', ref.data.user_id)
						cookie.default.setCookie('avatar', ref.data.avatar)
						cookie.default.setCookie('lgid', ref.data.lgid)
						cookie.default.setCookie('nickname', ref.data.nickname)
						cookie.default.setCookie('phone', phone)
						that.avatar = ref.data.avatar
						that.token = ref.data.token
						that.user_id = ref.data.user_id
						that.lgid = ref.data.lgid
						that.nickname = ref.data.nickname
						that.disappear()
						bus.$emit("userLogOut", true)
					}
				}).catch(ref => {
					console.log(ref)
					if (ref.hasOwnProperty('msg')) {
						alert(ref.msg)
						return
					} else if (ref.hasOwnProperty('error')) {
						alert('登陆失败，错误码：' + ref.error + '，请联系客服解决')
						return
					} else {
						alert('登陆失败' + ref.response.status + ref.response.statusText)
					}
					// console.log('not here!===>',ref)
				})
			},
			//监听enter键
			enter() {
				var that = this
				this.login()
			},
			// 其他登录
			otherLog(e) {
				let wayName = e
				let state = window.location.href

				// 微信登录
				if (wayName == 'wx') {
					// alert('微信登录')
					self.location.href = 'https://open.weixin.qq.com/connect/qrconnect?appid=' + wx_appid + '&redirect_uri=' + wx_redirect_uri + '&response_type=code&scope=snsapi_login&state=' + state + '#wechat_redirect'
				}

				// QQ登录
				if (wayName == 'qq') {
					alert('抱歉，本站暂未开放QQ登录！')
					return
					// self.location.href = 'https://graph.qq.com/oauth2.0/authorize?client_id='+qq_client_id+'&redirect_uri='+qq_redirect_uri+'&response_type=code&state='+state
					// self.location.href = 'https://graph.qq.com/oauth2.0/authorize?client_id='+qq_client_id+'&redirect_uri='+qq_redirect_uri+'&response_type=code'
				}

				// 新浪登录
				if (wayName == 'xinlang') {
					self.location.href = 'https://api.weibo.com/oauth2/authorize?client_id=' + xinlang_client_id + '&response_type=code&redirect_uri=' + xinlang_redirect_uri
				}

				// facebook登录
				if (wayName == 'facebook') {
					// alert('facebook登录')
					const SCOPE = "&scope=email"
					self.location.href = 'https://www.facebook.com/dialog/oauth?client_id=' + facebook_client_id + '&redirect_uri=' + facebook_redirect_uri + '&response_type=code' + SCOPE + '&state=' + state
				}

				// ins登录
				if (wayName == 'ins') {
					// alert('ins登录')
					self.location.href = 'https://api.instagram.com/oauth/authorize/?client_id=' + ins_client_id + '&redirect_uri=' + ins_redirect_uri + '&response_type=code&state=' + state
				}

				// twitter登录
				if (wayName == 'line') {
					// alert('line登录')
					self.location.href = 'https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=' + line_client_id + '&redirect_uri=' + line_redirect_uri + '&state=state&scope=openid%20profile%20email&nonce=' + state
				}
			}
		}
	}
</script>