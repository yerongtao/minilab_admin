<style scoped>
    .preview {
        display: block;
        width: 100%;
        height: auto;
    }
</style>
<template>
    <div>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
            <FormItem label="奖品名称" prop="name">
                <Input type="text" v-model="formValidate.name" placeholder="请输入奖品名称"></Input>
            </FormItem>
            <FormItem label="奖品价格" prop="price">
                <Input v-model="formValidate.price" placeholder="请输入奖品价格(正数)"></Input>
            </FormItem>
            <FormItem label="中奖概率" prop="rate">
                <Input v-model="formValidate.rate" placeholder="请输入中奖概率(0~1)"></Input>
            </FormItem>
            <FormItem label="奖品总数" prop="remain">
                <Input v-model="formValidate.remain" placeholder="请输入奖品总数(正整数)"></Input>
            </FormItem>
            <FormItem label="奖品描述" prop="description">
                <Input v-model="formValidate.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input>
            </FormItem>
            <FormItem label="奖品图片" prop="thumbnail">
                <Row type="flex" justify="start">
                    <Col span="10">
                    <upload @dataUrl="getUrl" />
                    </Col>
                    <Col span="12">
                    <img class="preview" :src="formValidate.thumbnail" alt="">
                    </Col>
                </Row>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="handleSubmit('formValidate')">Submit</Button>
                <Button @click="handleReset('formValidate')" style="margin-left: 8px">Reset</Button>
            </FormItem>
        </Form>
    </div>
</template>
<script>
    import upload from '../../components/upload'
    export default {
        name: 'award-update',
        components: {
            Upload: upload
        },
        data() {
            return {
                formValidate: {
                    token: this.GLOBAL.tokenKey(),
                    name: "",
                    price: "",
                    rate: "",
                    remain: "",
                    description: "",
                    thumbnail: "",
                    pid: ""
                },
                ruleValidate: {
                    name: [{
                            required: true,
                            message: "The name cannot be empty",
                            trigger: "blur"
                        },
                        {
                            type: "string",
                            min: 2,
                            message: "Introduce no less than 2 words",
                            trigger: "blur"
                        }
                    ],
                    price: [{
                        required: true,
                        message: "The price cannot be empty",
                        trigger: "blur"
                    }],
                    rate: [{
                        required: true,
                        message: "The rate cannot be empty",
                        trigger: "blur"
                    }, ],
                    remain: [{
                        required: true,
                        message: "The remain cannot be empty",
                        trigger: "blur"
                    }],
                    description: [{
                            required: true,
                            message: "Please enter a personal introduction",
                            trigger: "blur"
                        },
                        {
                            type: "string",
                            min: 5,
                            message: "Introduce no less than 5 words",
                            trigger: "blur"
                        }
                    ],
                    thumbnail: {
                        required: true,
                        message: "The remain cannot be empty",
                        trigger: "blur"
                    }
                },
                uploadList: []
            };
        },
        created() {},
        mounted() {

        },
        methods: {
            clickme(res) {
                this.formValidate.pid = res.pid;
                this.formValidate.description = res.description;
                this.formValidate.name = res.name;
                this.formValidate.price = res.price.toString();
                this.formValidate.rate = res.rate.toString();
                this.formValidate.remain = res.remain.toString();
                this.formValidate.thumbnail = res.thumbnail;
                // console.log(res)
            },
            getUrl(url) {
                this.formValidate.thumbnail = url
            },
            // 提交
            handleSubmit(name) {
                var that = this;
                this.$refs[name].validate(valid => {
                    if (valid) {
                        // console.log(that.formValidate)
                        that.axios
                            .get(that.GLOBAL.Prizes.update, {
                                params: that.formValidate
                            })
                            .then(function (res) {
                                if (res.data.rc == 0) {
                                    that.$Message.success("Success!");
                                    that.$emit('closebnt', 'close')
                                }
                                if (res.data.rc == 9003) {
                                    that.$Message.warning("Token过期！");
                                    that.$router.push('/');
                                    that.$Modal.remove();
                                }
                                if (res.data.rc == 9008) {
                                    that.$Message.warning("参数设置不正确！");
                                }
                                // console.log(res);
                            })
                            .catch(function (error) {});

                    } else {
                        this.$Message.error("Fail!");
                    }
                });

            },
            handleReset(name) {
                this.$refs[name].resetFields();
            }
        }
    };
</script>