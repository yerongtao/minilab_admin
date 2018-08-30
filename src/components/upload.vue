<template>
    <div>
        <Upload :before-upload="beforeUpload" :on-progress="onProgress" :on-success="onSuccess" :data="{token:GLOBAL.tokenKey()}"
            :show-upload-list="false" :action="GLOBAL.UploadImg" :format="['jpg','jpeg','png']">
            <Button icon="ios-cloud-upload-outline">选择图片</Button>
        </Upload>
        <Progress v-show="percent" :percent="percent" :stroke-width="2"></Progress>
    </div>
</template>
<script>
    export default {
        name: 'upload',
        data() {
            return {
                src: '',
                percent: 0
            }
        },
        created() {

        },
        methods: {
            beforeUpload() {
                // this.show=true
                // console.log(arguments, '上传前')
            },
            onProgress(event) {
                this.percent = event.percent
                // console.log(event.percent, '上传中')
            },
            onSuccess(res) {
                if (res.rc == 0) {
                    setTimeout(() => {
                        this.percent = 0;
                    }, 200);
                    this.$emit('dataUrl', res.url)
                }
                if (res.rc == 9001) {
                    this.$Message.warning("照片格式不正确！");
                }
                if (res.rc == 9003) {
                    this.$router.push('/');
                    this.$Message.warning("登录过期，请重新登录！");
                    console.log('登录过期，请重新登录!')
                    return false;
                }
                // console.log(arguments, '上传完成')
            },
        }
    }
</script>