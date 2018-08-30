<style scoped lang="less">
    .index {
        width: 100%;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        text-align: center;
        background: url('../images/bg.jpg') no-repeat center;
        background-size: cover;
        h1 {
            margin: 3ch;
            text-align: center;
            img {
                display: inline-block;
                width: 60%;
            }
        }
        h2 {
            color: #666;
            margin-bottom: 200px;
            p {
                margin: 0 0 50px;
            }
        }
        .ivu-row-flex {
            height: 100%;
        }
    }
</style>
<template>
    <div class="index">
        <Row type="flex" justify="center" align="middle">
            <Col span="8">
            <h1>
                <!-- <img src="../images/logo.png"> -->
            </h1>
            <Form ref="formInline" :model="formInline" :rules="ruleInline">
                <FormItem prop="username">
                    <Input size="large" type="text" v-model="formInline.username" placeholder="Administrator account">
                    <Icon type="ios-person-outline" slot="prepend"></Icon>
                    </Input>
                </FormItem>
                <FormItem prop="password">
                    <Input size="large" type="password" v-model="formInline.password" placeholder="Password">
                    <Icon type="ios-lock-outline" slot="prepend"></Icon>
                    </Input>
                </FormItem>
                <FormItem>
                    <Button size="large" type="primary" @click="handleSubmit('formInline')">Signin</Button>
                </FormItem>
            </Form>
            </Col>
        </Row>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                formInline: {
                    username: '',
                    password: ''
                },
                ruleInline: {
                    username: [{
                        required: true,
                        message: 'Please fill in the user name',
                        trigger: 'blur'
                    }],
                    password: [{
                            required: true,
                            message: 'Please fill in the password.',
                            trigger: 'blur'
                        },
                        {
                            type: 'string',
                            min: 6,
                            message: 'The password length cannot be less than 6 bits',
                            trigger: 'blur'
                        }
                    ]
                },
                // tokenKey:that.GLOBAL.tokenKey
            }
        },
        created() {
            const that = this;
            if (!this.GLOBAL.tokenKey()) {
                console.log('登录过期，请重新登录!')
                return false;
            }
            this.axios({
                    method: 'get',
                    url: that.GLOBAL.Refresh,
                    params: {
                        token: that.GLOBAL.tokenKey()
                    },
                })
                .then(function (res) {
                    if (res.data.rc == 0) {
                        console.log('凭证正确！')
                        that.$router.push('/home')
                    }
                })
                .catch(function (error) {
                    console.log(error);
                })
        },
        mounted() {},
        watch: {
            $route(to, from) {
                console.log(to, from)
                console.log('凭证bu正确！')

            }
        },
        methods: {
            handleSubmit(name) {
                const that = this;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.axios({
                                method: 'get',
                                // url: that.GLOBAL.News.view,
                                url: that.GLOBAL.Login,
                                params: that.formInline
                            })
                            .then(function (res) {
                                if (res.data.rc == 0) {
                                    window.localStorage.setItem('AdminToken', res.data.token);
                                    that.$router.push('/home')
                                    that.$Message.success('Success!');
                                    // console.log(res.data)
                                } else if (res.data.rc == 9002) {
                                    that.$Message.error('户名或密码不正确!');
                                }
                            })
                            .catch(function (error) {
                                console.log(error);
                            });

                    } else {
                        this.$Message.error('Fail!');
                    }
                })
            }
        }
    }
</script>