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
            <FormItem label="邮寄信息" prop="mail_info">
                <Input v-model="formValidate.mail_info" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input>
            </FormItem>
            <!-- <FormItem label="邮寄状态">
                <Select v-model="formValidate.state" placeholder="请选择邮寄状态（默认已邮寄）">
                    <Option value="0">中奖</Option>
                    <Option value="1">已经填资</Option>
                    <Option value="2">已经邮寄</Option>
                </Select>
            </FormItem> -->
            <FormItem>
                <Button type="primary" @click="handleSubmit('formValidate')">Submit</Button>
                <Button @click="handleReset('formValidate')" style="margin-left: 8px">Reset</Button>
            </FormItem>
        </Form>
    </div>
</template>
<script>
    export default {
        name: 'winners-update',
        data() {
            return {
                formValidate: {
                    token: this.GLOBAL.tokenKey(),
                    mail_info: "",
                    state: "",
                    wid: ""
                },
                ruleValidate: {
                    mail_info: [{
                            required: true,
                            message: "请填写邮寄信息",
                            trigger: "blur"
                        },
                        {
                            type: "string",
                            min: 5,
                            message: "Introduce no less than 5 words",
                            trigger: "blur"
                        }
                    ],
                },
            };
        },
        created() {},
        mounted() {

        },
        methods: {
            clickme(res) {
                this.formValidate.wid = res.wid;
                this.formValidate.mail_info = res.mail_info;
            },
            // 提交
            handleSubmit(name) {
                var that = this;
                this.$refs[name].validate(valid => {
                    if (valid) {
                        // console.log(that.formValidate)
                        that.axios
                            .get(that.GLOBAL.set_winrecord, {
                                params: that.formValidate
                            })
                            .then(function (res) {
                                if (res.data.rc == 0) {
                                    that.$Message.success("Success!");
                                    that.$emit('closebnt', 'close')
                                    console.log(res);
                                }
                                if (res.data.rc == 9003) {
                                    that.$Message.warning("Token过期！");
                                    that.$router.push('/');
                                    that.$Modal.remove();
                                }

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