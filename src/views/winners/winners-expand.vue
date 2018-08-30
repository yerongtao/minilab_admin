<style scoped>
    .expand-row {
        margin-bottom: 16px;
    }
</style>
<template>
    <div>
        <Row class="expand-row">
            <Col span="12">
            <span class="expand-key">邮寄姓名: </span>
            <span class="expand-value">{{ row.mail_name || '未填写' }}</span>
            </Col>
            <Col span="12">
            <span class="expand-key">邮寄电话: </span>
            <span class="expand-value">{{ row.mail_mobilenumber || '未填写' }}</span>
            </Col>
        </Row>
        <Row>
            <Col span="12">
            <span class="expand-key">邮寄地址: </span>
            <span class="expand-value">{{ row.mail_address || '未填写' }}</span>
            </Col>
            <Col span="12">
            <span class="expand-key">邮寄信息: </span>
            <span class="expand-value">{{ row.mail_info || '未填写' }}</span>
            </Col>
        </Row>
    </div>
</template>
<script>
    export default {
        props: {
            row: Object
        },
        mounted() {
            // console.log(this.row)
        },
    };
</script>