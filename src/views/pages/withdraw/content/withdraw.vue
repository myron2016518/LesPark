<template>
    <div class='main'>
        <div class="content">
            <div class="tap">
                爱豆提现
            </div>
            <div class="box">
                <div class="top table">
                    <p>提现方式:</p>
                    <div @click="changeTab('wechat')" :class="['wechat',{'active_wechat':changeTabName === 'wechat'}]">
                        微信</div>
                    <div @click="changeTab('payoneer')"
                        :class="['payoneer',{'active_payoneer':changeTabName === 'payoneer'}]">payoneer</div>
                </div>
                <div class="payoneer_box" v-show="changeTabName === 'payoneer'">
                    <div v-show='isLogin'>
                        <div class="top">
                            <p>提现账户:</p>
                            <img :src='avatar' alt="">
                            <div class='account'>
                                <p>{{nickname}}</p>
                                <p>lespark ID:{{lgid}}</p>
                                <p>payoneer:{{payoneer_account}}</p>
                            </div>
                            <div class="change_btn" @click='changeAccount()'>切换账号</div>
                        </div>
                        <div class="top">
                            <p>提现金额:</p>
                            <div class='count'>
                                <input oninput="this.value=this.value.replace(/[^\d\|/+]/g,'')" v-model='exchange'
                                    type="text" placeholder="请输入爱豆数量">
                            </div>
                            <div @click='getExchange' :class="['enter_btn',{'active':canExchange}]">确定</div>
                            <div class="tip">您的可用爱豆余额是：{{lmoney_balance}} 全部提现后可获得：{{withdraw_amount}}</div>
                        </div>
                        <div class='prompt'>
                            <p>提示：</p>
                            <div class='prompt_txt'>
                                1.每次最少提现1000爱豆，最多提现2000爱豆。<br>
                                2.提现成功后，您的爱豆将被转换成美元，您的可以前往payoneer查看。后续您可以在payoneer中操作提现知银行卡；<span
                                    @click='goToPayoneer'>立即前往payoneer</span><br>
                                3.进关于payoneer手续费，请参考 <span @click='description'> 汇率说明</span>
                            </div>
                        </div>
                    </div>
                    <div class='notLogin' v-show='!isLogin'>
                        <span>请先登录LesPark账号:</span>
                        <div @click='Login'>注册/登陆</div>
                    </div>
                </div>
                <div class='wechat_box' v-show="changeTabName === 'wechat'">
                    <div class="wechat_prompt">
                        <div>提示：</div>
                        <div>
                            1.前往app绑定微信账号<br>
                            2.扫描下方二维码，关注微信公众号 LesPark <br>
                            3.进入公众号，点击下方 充值/体现按钮完成体现
                        </div>
                    </div>
                    <div class="qr_code">
                        <div class="qr_box">
                            <p>请使用微信扫一扫</p>
                            <img src="https://static.lespark.cn/h5/img/pc/wechat.png" alt="">
                        </div>
                    </div>
                </div>
            </div>
            <div class="login_box" v-show='showLoginBox'>
                <div class="login_verification">
                    <p>请先验证手机号</p>
                    <p>已发送验证码到尾号{{phone_number}}</p>
                    <div class='verification-code'>
                        <input type="text" placeholder="请输入验证码" v-model='verificationCode'
                            onkeyup="this.value=this.value.replace(/[^0-9-]+/,'')" class="verification">
                        <div @click='sendAgain()' class='get-verification'>{{verificationTxt}}</div>
                    </div>
                    <div class='btn_verification' @click='btnVerification'>验证</div>
                </div>
                <div class="close_login_verification" @click='closeLoginVerification'>

                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import Vue from "vue";
    import ajax from "Common/ajax";
    import Utils from "Common/util";
    import cookie from "Common/cookie";
    import bus from "Common/events-bus";
    import constans from 'Constans';
    import { Loading, Button, MessageBox, Message } from "element-ui";

    Vue.use(Button);
    Vue.prototype.$message = MessageBox;
    Vue.prototype.$loading = MessageBox;
    Vue.prototype.$prompt = MessageBox.prompt;
    const userUrl = constans.AllUrl.url.dev;
    export default {
        name: 'withdraw',
        components: {},
        data() {
            return {
                changeTabName: 'wechat',
                isLogin: false,
                avatar: '',
                nickname: '',
                lgid: '',
                user_id: '',
                token: '',
                is_payee: '0',
                lmoney_balance: '',
                payoneer_account: "",
                phone: '',
                phone_number: '5051',
                all_phone: '',
                status: '',
                user_valid: '',
                withdraw_amount: "",
                showLoginBox: false,
                verificationCode: '',//验证码
                reference_id: '',
                verificationTxt: 60,
                timecount: null,
                exchange: '',//提现金额
                canExchange: false,//是否能提现
                isGetMoney: false,
            }
        },
        created() {
            if (Utils.liveStartisLogin()) {
                this.isLogin = true;
                this.token = cookie.getCookie('lespark_token');
                this.user_id = cookie.getCookie('lespark_user_id');
                this.all_phone = cookie.getCookie('phone');

            } else {
                this.isLogin = false;
                // this.$bus.emit("noLoginInfo", true);
            }
        },
        methods: {
            //tab切换
            changeTab(name) {
                const _this = this
                _this.changeTabName = name
                if (name == 'payoneer') {
                    //检查账户状态
                    if (Utils.liveStartisLogin()) {
                        _this.getAccountMsg()
                    }

                }
            },
            //切换账号
            changeAccount() {
                const _this = this
                this.$bus.emit("quit", true);
            },
            //登陆
            Login() {
                this.$bus.emit("noLoginInfo", true);
            },
            //调接口 提现
            getMoney() {
                const that = this
                ajax.Post({
                    url: userUrl + '/payoneer_oper',
                    data: {
                        user_id: that.user_id,
                        token: that.token,
                        exchange: that.exchange,
                        bundle_id: 'pc'
                    },
                }).then(res => {
                    //提现成功 刷新用户信息
                    this.$message({
                        message: res.msg,
                        center: true
                    });
                    that.getAccountMsg()
                })
                    .catch(res => {
                        if (res.error == -2) {
                            //账户失效 重新登陆
                            // 弹出手机号验证码页面
                            that.showLoginBox = true
                            //获取验证码
                            that.getVerificationCode()
                            return
                        }
                        else if (res.error == -3) {
                            this.$message({
                                message: '单日限额10000爱豆',
                                center: true
                            });
                            return
                        }
                        else if (res.error == -4) {
                            this.$message({
                                message: '工会下的主播不能提现',
                                center: true
                            });
                            return
                        } else {
                            this.$message({
                                message: res.msg,
                                center: true
                            });
                        }
                    })
            },
            //提现校验
            getExchange() {
                const that = this
                //先判断是否在1000-2000区间
                if (!that.canExchange) {
                    return
                }
                //判断是否大于余额
                if (that.lmoney_balance <= that.exchange) {
                    this.$message({
                        message: '所提现金额大于您的余额，请重新输入',
                        center: true
                    });
                    return
                }
                //提现,先验证手机号
                // 弹出手机号验证码页面
                that.showLoginBox = true
                //获取验证码
                that.getVerificationCode()
                that.isGetMoney = true
            },
            //去payoneer绑定账号
            goPayoneerURL(index) {
                const that = this
                let loadingInstance = Loading.service({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                ajax.Get({
                    url: userUrl + '/payoneer_oper?user_id=' + that.user_id + '&token=' + that.token +
                        '&oper_type=' + index + '&bundle_id=pc',
                })
                    .then(res => {
                        if (res.error == 0) {
                            const resdata = JSON.parse(JSON.stringify(res.data))
                            window.location.href = resdata.login_url
                        } else if (res.error == -2) {
                            // 弹出手机号验证码页面
                            loadingInstance.close();
                            that.showLoginBox = true
                            //获取验证码
                            that.getVerificationCode()
                        } else {
                            loadingInstance.close();
                            this.$message({
                                message: res.msg,
                                center: true
                            });
                        }
                    })
            },
            // 关闭弹窗
            closeLoginVerification() {
                this.showLoginBox = false
            },
            //再次发送
            sendAgain() {
                const that = this
                if (isNaN(that.verificationTxt)) {
                    //再次发送验证码
                    that.getVerificationCode()
                }
            },
            //获取用户验证码
            getVerificationCode() {
                const that = this
                that.clearInputMsg()
                ajax.Get({
                    url: userUrl + '/v2/verify_code?phone_number=' + that.all_phone +
                        '&code_type=0'
                })
                    .then(res => {
                        this.$message({
                            message: res.msg,
                            center: true
                        });
                        //存一下reference_id
                        that.reference_id = res.data.reference_id
                        that.setTime()
                    })
                    .catch(res => {
                        this.$message({
                            message: res.msg,
                            center: true
                        });
                    })
            },
            //验证用户输入验证码
            btnVerification() {
                const that = this
                if (that.verificationCode == '') {
                    this.$message('请输入验证码', '验证码不能为空', {
                        confirmButtonText: '确定',
                    });
                } else if (that.reference_id) {
                    //验证码 验证
                    ajax.Post({
                        url: userUrl + '/v2/verify_code',
                        data: {
                            user_id: that.user_id,
                            phone_number: that.all_phone,
                            verify_code: that.verificationCode,
                            reference_id: that.reference_id
                        }
                    })
                        .then(res => {
                            clearTimeout(that.timecount)
                            that.showLoginBox = false
                            if (that.isGetMoney) {
                                that.getMoney()
                                return
                            }
                            //刷新用户信息
                            that.getAccountMsg()
                        })
                        .catch(res => {
                            this.$message({
                                message: res.msg,
                                center: true
                            });
                        })

                }
            },
            //清除输入框信息
            clearInputMsg() {
                const that = this
                that.verificationCode = ''
                that.verificationTxt = 60
                clearTimeout(that.timecount)
            },
            //倒计时    
            setTime() {
                const that = this
                if (that.verificationTxt === 1) {
                    that.verificationTxt = '再次发送'
                } else {
                    that.verificationTxt--;
                    that.timecount = setTimeout(function () {
                        that.setTime();
                    }, 1000)
                }

            },
            //去payoneer官网
            goToPayoneer() {
                window.location.href = 'https://www.payoneer.com/'
            },
            description() {
                window.location.href =
                    'http://blog.payoneer.com/everything-you-need-to-know-about-conversion-rates'
            },
            //检查手机号、payoneer账号
            checkAccount() {
                const that = this
                //先判断是否绑定手机号
                if (that.phone.length === 0) {
                    //没有绑定的手机号，提示绑定手机号
                    this.$message('请到app绑定手机号', '该账户暂未绑定手机号', {
                        confirmButtonText: '确定',
                    });
                    return
                }
                //获取手机尾号
                that.phone_number = that.phone.slice(-4)
                //判断payoneer绑定状态
                if (!that.is_payee) {
                    //   如果没有payoneer账号，调接口获取地址,展示去绑定
                    this.$message({
                        title: '未绑定Payoneer账号',
                        message: '点击下方按钮绑定您已注册的payonner账号，或新注册',
                        confirmButtonText: '去绑定',
                        cancelButtonText: '注册',
                        distinguishCancelAndClose: true,
                        showCancelButton: true,
                        center: true,
                        callback: action => {
                            if (action == 'confirm') {
                                that.goPayoneerURL('login')
                            } else if (action == 'cancel') {
                                that.goPayoneerURL('registration')
                            }
                        }
                    })
                    return
                }
                //判断istatus的状态
                if (that.status == 'INACTIVE') {
                    //已绑定但是未激活，提示用户
                    this.$message({
                        message: 'Payoneer 审核中，请留意邮件',
                        center: true
                    });
                }
            },
            //获取payoneer状态
            getAccountMsg() {
                const that = this
                //post payoneer_withdraw接口获取参数
                ajax.Post({
                    url: userUrl + '/payoneer_withdraw',
                    data: {
                        user_id: that.user_id,
                        token: that.token,
                        bundle_id: 'pc'
                    }
                })
                    .then(res => {
                        if (res.error == 0) {
                            const resdata = res.data
                            that.payoneer_account = resdata.payoneer_account
                            that.user_valid = resdata.user_valid
                            that.is_payee = resdata.is_payee
                            that.phone = resdata.phone
                            that.status = resdata.status
                            that.withdraw_amount = resdata.withdraw_amount
                            that.lmoney_balance = resdata.lmoney_balance
                            that.lgid = resdata.lgid
                            that.nickname = resdata.nickname
                            that.avatar = resdata.avatar
                            that.checkAccount()
                        }
                    })
                    .catch(ref => {
                        this.$message({
                            message: ref.msg,
                            center: true
                        });
                    })
            },
        },
        mounted() {
            bus.$on("userLogOut", res => {
                this.isLogin = res;
                if (res) {
                    bus.$emit('userLogin', 'userLogin')
                }
            });
            bus.$on("userLogin", res => {
                this.user_id = cookie.getCookie("lespark_user_id");
                this.token = cookie.getCookie("lespark_token");
                this.isLogin = true;
                this.getAccountMsg()
            })
        },
        updated() {

        },
        watch: {
            exchange: function (res) {
                const that = this
                if (res >= 1000 && res <= 2000) {
                    that.canExchange = true
                } else {
                    that.canExchange = false
                }
            },
        },
    }
</script>
<style scoped>
    .main {
        height: 800px;
        width: 100%;
        padding-top: 30px;
        background-color: #F5F5F5;
        font-family: PingFangSC-Regular;
    }

    .content {
        width: 1100px;
        margin: 0 auto;
        height: 100%;
        /* background-color: #fff; */
    }

    .table {
        margin-left: 20px;
    }

    .tap {
        width: 115px;
        height: 50px;
        line-height: 50px;
        font-size: 18px;
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 500;
        text-align: left;
        text-align: center;
        color: #4a4a4a;
        display: block;
        background-color: #fff;
    }

    .box {
        height: 670px;
        background-color: #fff;
    }

    .top {
        position: relative;
        height: 45px;
        padding: 25px 0 25px 0px;
        display: flex;
        align-items: center;
        font-size: 14px;
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 500;
        text-align: left;
        color: #4a4a4a;
    }

    .wechat,
    .payoneer {
        height: 45px;
        width: 100px;
        border: 1px solid #a8a8a8;
        border-radius: 25pt;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 400;
        margin: 0 20px 0 10px;
        cursor: pointer
    }

    .active_payoneer {
        background-color: #4070c4;
        color: #fff;
        border: 1px solid #4070C4;
    }

    .active_wechat {
        background: #0bca36;
        color: #fff;
        border: 1px solid #0bca36;
    }

    .top>img {
        width: 45px;
        height: 45px;
        border-radius: 50%;
        margin: 0 10px 0 10px;
    }

    .account {
        /* height: 45px; */
        /* width: 160px; */
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        font-size: 12px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        color: #a8a8a8;

    }

    .account>p:first-child {
        font-size: 14px;
        color: #4a4a4a;
    }

    .change_btn {
        height: 28px;
        width: 70px;
        border: 1px solid #fa3e54;
        border-radius: 18px;
        margin-left: 25px;
        line-height: 28px;
        text-align: center;
        font-size: 12px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        color: #fa3e54;
    }

    .count {
        height: 45px;
        width: 310px;
        margin: 0 20px 0 10px;
    }

    .count input {
        width: 100%;
        height: 100%;
        border: 1px solid #a8a8a8;
        border-radius: 25pt;
        font-size: 14px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        outline: none;
        text-indent: 17px;
        caret-color: red;
    }

    .count input::placeholder {
        color: #a8a8a8;
    }

    .enter_btn {
        height: 45px;
        width: 70px;
        background-color: #ccc;
        border-radius: 23px;
        line-height: 45px;
        text-align: center;
        font-size: 18px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        color: #fff;
    }

    .active {
        background-color: #fa3e54;
    }

    .tip {
        position: absolute;
        height: 24px;
        line-height: 24px;
        background: #fa3e54;
        border-radius: 12px;
        font-size: 12px;
        color: #fff;
        padding: 0 10px;
        top: -10px;
        left: 130px;
        font-weight: 400;
    }

    .tip::after {
        position: absolute;
        content: '';
        display: inline-block;
        top: 24px;
        left: 10px;
        margin-left: 10px;
        width: 0;
        height: 0;
        border: 4px solid transparent;
        border-top-color: #fa3e54;
    }

    .prompt {
        padding-top: 25px;
        width: 100%;
        display: flex;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        color: #333333;
        font-size: 14px;
    }

    .prompt>p {
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 500;
        color: #4a4a4a;

    }

    .payoneer_box {
        padding-left: 20px;
    }

    .wechat_box {
        width: 100%;
    }

    .wechat_prompt {
        display: flex;
        font-size: 14px;
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 500;
        color: #4a4a4a;
        padding: 25px 0 0 20px;
    }

    .wechat_prompt>div:last-child {
        color: #333;
        font-weight: 400;
    }

    .qr_code {
        height: 490px;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .qr_box {
        height: 205px;
        width: 170px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        font-size: 14px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        color: #666666;
        text-align: center;
    }

    .qr_box>img {
        width: 170px;
        height: 170px;
    }

    .notLogin {
        display: flex;
        align-items: center;
    }

    .notLogin>div {
        height: 28px;
        width: 70px;
        line-height: 28px;
        border: 1px solid #fa3e54;
        border-radius: 18px;
        font-size: 12px;
        font-family: PingFangSC, PingFangSC-Regular;
        color: #fa3e54;
        margin-left: 10px;
        text-align: center;
    }

    /* 手机号验证框 */
    .login_box {
        height: 100vh;
        width: 100vw;
        overflow: hidden;
        background: rgba(0, 0, 0, 0.4);
        position: fixed;
        z-index: 100;
        top: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .login_verification {
        text-align: center;
        position: absolute;

        width: 530px;
        background: #f7f3f3;
        border-radius: 10px;
        z-index: 200
    }

    .close_login_verification {
        position: absolute;
        width: 100%;
        height: 100%;
    }

    .login_verification>p:first-child {
        height: 68px;
        line-height: 68px;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #333;
    }

    .login_verification>p:nth-child(2) {
        overflow: hidden;
        text-align: left;
        height: 30px;
        line-height: 30px;
        font-family: PingFang-SC-Medium;
        font-size: 15px;
        color: #333;
        text-align: center;
    }

    .verification-code {
        display: flex;
        justify-content: center;
    }

    .verification {
        width: 100px;
        height: 49px;
        color: #333;
        font-size: 15px;
        border: none;
        border-bottom: 1px solid #ebebeb;
        background-color: #f7f3f3;
        outline: none;
    }

    .get-verification {
        height: 49px;
        line-height: 49px;
        font-size: 15px;
    }

    .btn_verification {
        height: 50px;
        line-height: 50px;
        font-size: 15px;
        width: 250px;
        border-radius: 30px;
        background-color: #fa4459;
        color: #fff;
        margin: 20px auto
    }

    .prompt_txt span {
        color: #60d4fd;
        cursor: pointer;
    }
</style>