<template>
    <div class="header-container">
        <lay @click.native="disappear" v-show="layShow" v-bind:msglay="msglay"></lay>
        <!-- 登录弹框 -->
        <login class="content_login" v-show="loginShow" v-bind:msglogin="msglogin"
            v-on:showChanged="showChange($event)"></login>
        <!-- 导航栏 -->
        <div class="header">
            <div>
                <!-- 左边logo -->
                <a href="../index.html">
                    <div class="fl logo"></div>
                </a>

                <!-- 右边栏目 -->
                <div class="fr">
                    <ul>
                        <!-- 热门直播 -->
                        <li class="active" @click="quhomehot">
                            <a style="cursor: pointer;">{{$t('header.nav1')}}</a>
                            <i class="line"></i>
                        </li>
                        <!-- 充值 -->
                        <a target="_blank" @click="pay">
                            <li>
                                <a>{{$t('header.nav2')}}</a>
                                <i class="line"></i>
                            </li>
                        </a>
                        <!-- 主播中心 -->
                        <li class="pc-liver-center">
                            <a style="cursor: default;">{{$t('header.nav3')}}</a>
                            <!-- <i class="line" v-show="!islogin"></i> -->
                            <div class="pc-liver" style="cursor: default;">{{$t('header.nav3_5')}}</div>

                            <div class="liver-box">
                                <div class="caret"></div>
                                <!-- 主播管理后台 -->
                                <div class="lan lan1 ">
                                    <a :class="chaneMode==true?'changeSize':''"
                                        @click="toSystem">{{$t('header.nav3_1')}}</a>
                                </div>
                                <!-- 开始pc直播 -->
                                <div class="lan lan2 lan6">
                                    <a :class="chaneMode==true?'changeSize':''"
                                        href="/live_start.html">{{$t('header.nav3_2')}}</a>
                                </div>
                                <!-- 爱豆提现 -->
                                <div class="lan lan1 lan5">
                                    <a :class=" chaneMode==true?'changeSize':''" href="/withdraw.html">
                                        {{$t('header.nav3_6')}}</a>
                                </div>
                                <!-- 成为签约主播 -->
                                <div class="lan lan3">
                                    <a :class="chaneMode==true?'changeSize':''" href="#">{{$t('header.nav3_3')}}</a>
                                </div>
                                <!-- pc直播指南 -->
                                <div class="lan lan3">
                                    <a :class="chaneMode==true?'changeSize changeSize1':''"
                                        href="#">{{$t('header.nav3_4')}}</a>
                                </div>
                            </div>
                        </li>
                        <!-- 联系客服 -->
                        <a target="_blank"
                            href="https://www.sobot.com/chat/pc/index.html?sysNum=4717b63070614a289c61072945a75770">
                            <li>
                                <a>{{$t('header.nav4')}}</a>
                                <i class="line"></i>
                            </li>
                        </a>
                        <!-- 关于我们 -->
                        <a target="_blank" @click="aboutUS">
                            <li>
                                <a>{{$t('header.nav5')}}</a>
                                <i class="line"></i>
                            </li>
                        </a>
                        <!-- 切换语言 -->
                        <li style="width: 68px;height:17px;" class="language-choose">
                            <a style="width: 68px;height: 22px;cursor: default;">{{useLanguage[0]}}</a>
                            <div class="language">
                                <div class="caret"></div>
                                <div class="lan lan1">
                                    <a @click="changeLanguageOne" ref="lgOne" href="#">{{useLanguage[1]}}</a>
                                </div>
                                <div class="lan language2">
                                    <a class @click="changeLanguageTwo" ref="lgTwo" href="#">{{useLanguage[2]}}</a>
                                </div>
                            </div>
                        </li>
                        <li v-show="!islogin" @click="appear">
                            <a href="#">{{$t('header.nav6')}}</a>
                            <i class="line"></i>
                        </li>
                        <li class="user" style="width: 65px;height: 65px;margin-top: 36px;border-radius: 50%;"
                            v-show="islogin">
                            <img style="width: 100%;height: 100%;border-radius: 50%;" :src="avatar" />
                            <div class="user_info">
                                <div class="user_info_lay"></div>
                                <div class="user_info_little">
                                    <div class="user_info_little_avatar">
                                        <img style="width: 100%;height: 100%;border-radius: 50%;" :src="avatar" />
                                    </div>
                                    <div class="user_info_little_avatar_info">
                                        <p>{{nickname}}</p>
                                        <p>LesPark ID: {{lgid}}</p>
                                    </div>
                                </div>
                                <div @click="pay" class="user_info_recharge">
                                    <a>{{$t('header.me1')}}</a>
                                </div>
                                <div @click="quit" class="user_info_recharge user_info_quit">
                                    <a>{{$t('header.me2')}}</a>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import * as cookie from 'Common/cookie';
    import Vue from 'vue'
    import util from 'Common/util';
    import login from 'Views/components/login'
    import "babel-polyfill";
    import promise from "es6-promise";
    import lay from 'Views/components/lay'
    import ajax from 'Common/ajax';
    import constans from 'Constans';
    import bus from 'Common/events-bus';
    import VueI18n from 'vue-i18n'

    import 'Views/css/header.css'

    Vue.use(VueI18n)

    const i18n = new VueI18n({
        locale: 'zh', // 语言标识 
        messages: {
            'zh': require('static/js/zh'),
            'zh-f': require('static/js/zh-f'),
            'en': require('static/js/en')
        }
    })
    const userUrl = constans.AllUrl.url.dev

    export default {
        name: 'myHeader',
        data() {
            return {
                useLanguage: ['', '', ''],
                simplifyLanguage: ['简体中文', '繁體中文', 'English'],
                traditionalLanguage: ['简体中文', '繁體中文', 'English'],
                englishLanguage: ['简体中文', '繁體中文', 'English'],
                loginShow: false, //登录框是否显示
                layShow: false, //蒙层是否显示
                msglay: false, //从子组件<lay>收到的值
                msglogin: false, //从子组件<login>收到的值
                islogin: false, //判断是否登录
                user_id: cookie.default.getCookie("lespark_user_id"),
                token: cookie.default.getCookie("lespark_token") || "",
                avatar: '',
                lgid: cookie.default.getCookie('lgid') != '' ? cookie.default.getCookie('lgid') : '',
                nickname: '',
                chaneMode: false,
                author_live: null,
                language: ''
            }
        },
        components: {
            login: login,
            lay: lay,
        },
        created() {
            var that = this
            if (cookie.default.getCookie('language') != '') {
                that.language = cookie.default.getCookie('language')
            } else {
                that.language = (navigator.language || navigator.browserLanguanguage).toLowerCase();
                if (that.language == 'zh-cn') {
                    cookie.default.setCookie('language', '简体中文')
                    that.language = cookie.default.getCookie('language')
                } else if (that.language == 'zh-tw' || that.language == 'zh-hk' || that.language == 'zh-mo') {
                    cookie.default.setCookie('language', '繁體中文')
                    that.language = cookie.default.getCookie('language')
                } else {
                    cookie.default.setCookie('language', 'English')
                    that.language = cookie.default.getCookie('language')
                }
            }
            if (that.language == '简体中文') {
                that.$i18n.locale = 'zh'
                that.chaneMode = false
                that.useLanguage = that.simplifyLanguage
                bus.$emit('CL', 'CL_zh');
            }
            else if (that.language == '繁體中文') {
                that.$i18n.locale = 'zh-f'
                that.chaneMode = false
                that.useLanguage = that.traditionalLanguage
                for (let i = 0; i < that.useLanguage.length; i++) {
                    if (that.useLanguage[i] == '繁體中文') {
                        let one = that.useLanguage[0]
                        let two = that.useLanguage[i]
                        that.useLanguage[0] = two
                        that.useLanguage[i] = one
                    }
                }
                bus.$emit('CL', 'CL_zh_f');
            }
            else {
                that.$i18n.locale = 'en'
                that.chaneMode = true
                that.useLanguage = that.englishLanguage
                for (let i = 0; i < that.useLanguage.length; i++) {
                    if (that.useLanguage[i] == 'English') {
                        let one = that.useLanguage[0]
                        let two = that.useLanguage[i]
                        that.useLanguage[0] = two
                        that.useLanguage[i] = one
                    }
                }
                bus.$emit('CL', 'CL_en');
            }
            var urlError = util.getQueryString('error') != '' ? util.getQueryString('error') : ''
            var user_id = cookie.default.getCookie("lespark_user_id")
            var token = cookie.default.getCookie("lespark_token") || ''
            var source = util.getQueryString('source') != '' ? util.getQueryString('source') : ''

            cookie.default.setCookie('source', source)
            if (urlError != '') {
                alert('urlError')
            }
            ajax.Get({
                url: userUrl + '/pc_index',
                headers: {
                    bundle_id: 'pc',
                    'bundle-id': 'pc',
                    lang: 'zh-hans',
                    user_id: user_id,
                    token: token,
                },
                params: {
                    source: source
                },
            }).then(ref => {
                console.log(ref)
                if (ref.msg == 'ok' && ref.error == 0) {
                    // 
                    if (ref.data.lgid != undefined && ref.data.lgid != '' && ref.data.avatar != undefined && ref.data.avatar != '' && ref.data.nickname != undefined && ref.data.nickname != '') {
                        that.avatar = ref.data.avatar
                        that.lgid = ref.data.lgid
                        that.nickname = ref.data.nickname
                        that.user_id = user_id
                        that.token = token

                        cookie.default.setCookie('avatar', ref.data.avatar)
                        cookie.default.setCookie('lgid', ref.data.lgid)
                        cookie.default.setCookie('nickname', ref.data.nickname)
                        cookie.default.setCookie('lespark_token', token)
                        cookie.default.setCookie('lespark_user_id', user_id)

                        that.islogin = true
                        bus.$emit('userLogin', 'userLogin')
                    } else {
                        cookie.default.setCookie('lespark_token', '')
                        cookie.default.setCookie('lespark_user_id', '')
                        cookie.default.setCookie('lgid', '')
                        cookie.default.setCookie('avatar', '')
                        cookie.default.setCookie('nickname', '')

                        that.islogin = false
                    }

                    var qr_img_url = ref.data.qr_img_url
                    var ios_url = ref.data.ios_url
                    var android_url = ref.data.android_url
                    var google_url = ref.data.google_url
                    var url = {}

                    url = {
                        'android_url': android_url,
                        'google_url': google_url,
                        'ios_url': ios_url,
                        'qr_img_url': qr_img_url
                    }

                    if (ref.data.android_url != '' || ref.data.android_url != undefined) {
                        bus.$emit('url', url)
                        bus.$emit('regUrl', qr_img_url)
                    }
                }

            }).catch(ref => {
                cookie.default.setCookie('lespark_token', '')
                cookie.default.setCookie('lespark_user_id', '')
                cookie.default.setCookie('lgid', '')
                cookie.default.setCookie('avatar', '')
                cookie.default.setCookie('nickname', '')
                that.islogin = false
            })
        },
        mounted() {
            let _ = this;
            _.$bus.on('noLoginInfo', function (res) {
                console.log(res);
                _.appear();
            })
            _.$bus.on('quit', function (res) {
                console.log(res);
                _.quit();
            })
        },
        methods: {

            toSystem() {
                window.location.href = 'http://anchor.lespark.cn';
            },

            //去首页的热门直播出
            quhomehot() {
                // console.log('tohome');
                if (this.islogin == true) {
                    location.href = '../index.html#attention';
                } else {
                    location.href = '../index.html#hot';
                }
            },
            // 切换语言
            changeLanguageOne(e) {
                var that = this
                var url = window.document.URL
                var urlNumber = url.indexOf('live.html')

                if (that.$refs.lgOne.innerHTML == '简体中文') {
                    that.language = '简体中文'
                    if (urlNumber != -1) {
                        that.author_live = cookie.default.getCookie('author_live')
                        window.document.title = '“' + that.author_live + "”的直播间 - LesPark 直播";
                    }
                    bus.$emit('bannerImg', '简体中文')
                    cookie.default.setCookie('language', that.useLanguage[0])
                    that.$i18n.locale = 'zh'
                    that.chaneMode = false
                    that.useLanguage = that.traditionalLanguage
                    for (let i = 0; i < that.useLanguage.length; i++) {
                        if (that.useLanguage[i] == '简体中文') {
                            let one = that.useLanguage[0]
                            let two = that.useLanguage[i]

                            that.useLanguage[0] = two
                            that.useLanguage[i] = one
                            cookie.default.setCookie('language', that.useLanguage[0])
                        }
                    }
                    bus.$emit('CL', 'CL_zh');
                }

                if (that.$refs.lgOne.innerHTML == '繁體中文') {
                    that.language = '繁體中文'
                    if (urlNumber != -1) {
                        that.author_live = cookie.default.getCookie('author_live')
                        window.document.title = '“' + that.author_live + "”的直播间 - LesPark 直播";
                    }
                    bus.$emit('bannerImg', '繁體中文')
                    that.$i18n.locale = 'zh-f'
                    that.chaneMode = false
                    that.useLanguage = that.traditionalLanguage
                    for (let i = 0; i < that.useLanguage.length; i++) {
                        if (that.useLanguage[i] == '繁體中文') {
                            let one = that.useLanguage[0]
                            let two = that.useLanguage[i]

                            that.useLanguage[0] = two
                            that.useLanguage[i] = one
                            cookie.default.setCookie('language', that.useLanguage[0])
                        }
                    }
                    bus.$emit('CL', 'CL_zh_f');
                }

                if (that.$refs.lgOne.innerHTML == 'English') {
                    that.language = 'English'
                    if (urlNumber != -1) {
                        that.author_live = cookie.default.getCookie('author_live')
                        window.document.title = '“' + that.author_live + "”的直播间 - LesPark Live";
                    }
                    bus.$emit('bannerImg', 'English')
                    that.$i18n.locale = 'en'
                    that.chaneMode = true
                    that.useLanguage = that.englishLanguage
                    for (let i = 0; i < that.useLanguage.length; i++) {
                        if (that.useLanguage[i] == 'English') {
                            let one = that.useLanguage[0]
                            let two = that.useLanguage[i]

                            that.useLanguage[0] = two
                            that.useLanguage[i] = one
                            cookie.default.setCookie('language', that.useLanguage[0])
                        }
                    }
                    bus.$emit('CL', 'CL_en');
                }
            },
            changeLanguageTwo() {
                var that = this
                var url = window.document.URL
                var urlNumber = url.indexOf('live.html')
                if (that.$refs.lgTwo.innerHTML == 'English') {
                    that.language = 'English'
                    if (urlNumber != -1) {
                        that.author_live = cookie.default.getCookie('author_live')
                        window.document.title = '“' + that.author_live + "”的直播间 - LesPark Live";
                    }
                    bus.$emit('bannerImg', 'English')
                    that.$i18n.locale = 'en'
                    that.chaneMode = true
                    that.useLanguage = that.englishLanguage
                    for (let i = 0; i < that.useLanguage.length; i++) {
                        if (that.useLanguage[i] == 'English') {
                            let one = that.useLanguage[0]
                            let two = that.useLanguage[i]

                            that.useLanguage[0] = two
                            that.useLanguage[i] = one
                            cookie.default.setCookie('language', that.useLanguage[0])
                        }
                    }
                    bus.$emit('CL', 'CL_en');
                }

                if (that.$refs.lgTwo.innerHTML == '简体中文') {
                    that.language = '简体中文'
                    if (urlNumber != -1) {
                        that.author_live = cookie.default.getCookie('author_live')
                        window.document.title = '“' + that.author_live + "”的直播间 - LesPark 直播";
                    }
                    bus.$emit('bannerImg', '简体中文')
                    that.$i18n.locale = 'zh'
                    that.chaneMode = false
                    that.useLanguage = that.simplifyLanguage
                    for (let i = 0; i < that.useLanguage.length; i++) {
                        if (that.useLanguage[i] == '简体中文') {
                            let one = that.useLanguage[0]
                            let two = that.useLanguage[i]

                            that.useLanguage[0] = two
                            that.useLanguage[i] = one
                            cookie.default.setCookie('language', that.useLanguage[0])
                        }
                    }
                    bus.$emit('CL', 'CL_zh');
                }
            },
            // 登陆组件出现
            appear(e) {
                var that = this
                window.scrollTo(0, 0)
                window.document.body.className = 'hideScorll'
                that.loginShow = true
                that.layShow = true
            },
            // 登陆组件消失
            disappear() {
                var that = this
                that.loginShow = false
                that.layShow = false
                window.document.body.className = ''
            },
            // 登陆组件出现
            showChange(msg) {
                var that = this
                that.msglogin = msg;
                if (msg == false) {
                    that.loginShow = msg
                    that.layShow = msg
                    window.document.body.className = ''
                }
                if (msg == 'islogin') {
                    bus.$emit('attentionShow', 'headerto');
                    bus.$emit('userLiveShow', 'headerto');
                }
            },
            // 退出登录
            quit() {
                var that = this

                ajax.Post({
                    url: userUrl + '/setting/logout',
                    headers: {
                        user_id: cookie.default.getCookie("lespark_user_id"),
                        token: cookie.default.getCookie("lespark_token") || "",
                        'bundle_id': "pc"
                    },
                }).then(ref => {
                    if (ref.error == 0) {
                        cookie.default.setCookie('lespark_token', '')
                        cookie.default.setCookie('lespark_user_id', '')
                        cookie.default.setCookie('lgid', '')
                        cookie.default.setCookie('avatar', '')
                        cookie.default.setCookie('nickname', '')
                        that.islogin = false

                        // 关注列表显示
                        bus.$emit('attentionShow', 'noheaderto')
                        bus.$emit('userLiveShow', 'noheaderto');

                        //退出直播间
                        bus.$emit('quit', 'quit');

                        //退出登录
                        bus.$emit('userLogOut', false)


                    } else {
                    }

                }).catch(ref => {
                })
            },
            // 充值
            pay() {
                window.open('//api.lespark.cn/paynow_order?language=' + encodeURIComponent(encodeURIComponent(this.language)))
            },
            aboutUS() {
                window.open('//www.lespark.cn/about_us_cn.html?language=' + encodeURIComponent(encodeURIComponent(this.language)))
            }
        },
        watch: {
            msglogin(newVal, oldVal) {
                if (newVal == 'islogin') {
                    this.islogin = true
                    this.loginShow = false
                    this.layShow = false
                    window.document.body.className = ''
                }
                this.msglogin = false

                this.user_id = cookie.default.getCookie("lespark_user_id")
                this.token = cookie.default.getCookie("lespark_token") || ""
                this.lgid = cookie.default.getCookie('lgid') != '' ? cookie.default.getCookie('lgid') : ''
                var nickname = cookie.default.getCookie('nickname') != '' ? cookie.default.getCookie('nickname') : ''
                var avatar = cookie.default.getCookie('avatar') != '' ? cookie.default.getCookie('avatar') : ''
                if (nickname.indexOf("\"") == 0) {
                    this.nickname = nickname.slice(1, nickname.length - 1)
                } else {
                    this.nickname = nickname
                }

                if (avatar.indexOf("\"") == 0) {
                    this.avatar = avatar.slice(1, avatar.length - 1)
                } else {
                    this.avatar = avatar
                }
            }
        }
    }
</script>