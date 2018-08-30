<style scoped>
  .paging {
    float: right;
    margin-top: 10px;
  }
</style>

<template>
  <div>
    <Row>
      <Col span="5">
      <Input v-model="mobilenumber" search enter-button placeholder="请输入用户填资号码" @on-search="search" />
      </Col>
    </Row>
    <Table :data="tableData" :columns="tableColumns" @on-row-click="handData" border highlight-row>
    </Table>
    <Page class="paging" size='small' :total="dataCount" :page-size="page.size" :page-size-opts="page.sizeOpts" show-total show-sizer
      show-elevator @on-change="changePage" @on-page-size-change="changePageSize"></Page>
  </div>
</template>
<script>
  export default {
    name: 'statistics',
    data() {
      return {
        mobilenumber: undefined,
        dataCount: 10,
        page: {
          num: 1,
          size: 10,
          sizeOpts: [10, 20, 30, 40, 50]
        },
        // 表格数据设置
        tableColumns: [{
            title: '用户id',
            key: 'uid',
            sortable: true,
            tooltip: true,
            minWidth: 200
          },
          {
            title: '用户所属平台id',
            key: 'origin_id',
            sortable: true,
            minWidth: 140,
            tooltip: true
          },
          {
            title: '用户所属平台',
            key: 'origin',
            sortable: true,
            minWidth: 130
          },
          {
            title: '用户总中奖数',
            key: 'prize_num',
            sortable: true,
            minWidth: 130
          },
          {
            title: '用户创建时间',
            key: 'create_time',
            sortable: true,
            tooltip: true,
            minWidth: 130
          },
          {
            title: '用户更新时间',
            key: 'update_time',
            sortable: true,
            tooltip: true,
            minWidth: 130
          },
          {
            title: '用户填资姓名',
            key: 'name',
            tooltip: true,
            minWidth: 120
          },
          {
            title: '用户填资号码',
            key: 'mobilenumber',
            tooltip: true,
            minWidth: 120
          },
          {
            title: '用户填资地址',
            key: 'address',
            tooltip: true,
            minWidth: 120
          },
          {
            title: 'Action',
            key: 'action',
            width: 100,
            align: 'center',
            render: (h, params) => {
              // console.log(params)
              return h('div', [
                h('Button', {
                  props: {
                    type: 'success',
                    size: 'small',
                    icon: 'md-search'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.$Modal.info({
                        title: 'User Info',
                        content: `用户ID：${this.tableData[params.index].uid}<br>
                        用户所属平台id：${this.tableData[params.index].origin_id}<br>
                        用户所属平台：${this.tableData[params.index].origin}<br>
                        用户总中奖数：${this.tableData[params.index].prize_num}<br>
                        用户创建时间：${this.tableData[params.index].create_time}<br>
                        用户更新时间：${this.tableData[params.index].update_time}<br>
                        用户填资姓名：${this.tableData[params.index].name||'未填写'}<br>
                        用户填资号码：${this.tableData[params.index].mobilenumber||'未填写'}<br>
                        用户填资地址：${this.tableData[params.index].address||'未填写'}`,
                        okText: 'sure',
                      })
                    }
                  }
                }, 'View'),
              ]);
            }
          }

        ],
        tableData: []
      }
    },
    created() {
      this.getData()
    },
    mounted() {},
    watch: {
      page: { //深度监听，可监听到对象、数组的变化
        handler(val, oldVal) {
          this.getData();
        },
        deep: true
      },
    },
    methods: {
      search() {
        this.getData()
      },
      getData() {
        if (!this.GLOBAL.tokenKey()) {
          this.$router.push('/');
          this.$Message.warning("登录过期，请重新登录！");
          console.log('登录过期，请重新登录!')
          return false;
        }
        var that = this;
        this.axios({
            method: 'get',
            // url: that.GLOBAL.News.view,
            url: that.GLOBAL.users,
            params: {
              token: that.GLOBAL.tokenKey(),
              page: that.page.num,
              pagesize: that.page.size,
              mobilenumber: that.mobilenumber
            }
          })
          .then(function (res) {
            if (res.data.rc != 0) {
              that.$router.push('/');
              return false
            }
            that.dataCount = res.data.total;
            that.tableData = res.data.users;
            // console.log(res.data);
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      changePage(index) {
        this.page.num = index;
      },
      changePageSize(size) {
        this.page.size = size
        // console.log(size);
      },
      handData() {
        // console.log(arguments)
      },
    },

  }
</script>