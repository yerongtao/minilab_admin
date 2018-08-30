<style scoped>
  .paging {
    float: right;
    margin-top: 10px;
  }
</style>

<template>
  <div>
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
        dataCount: 10,
        page: {
          num: 1,
          size: 10,
          sizeOpts: [10, 20, 30, 40, 50]
        },
        // 表格数据设置
        tableColumns: [{
            title: '日期',
            key: 'day',
            sortable: true,
            minWidth: 120
          },
          {
            title: '总抽奖次数',
            key: 'raffle_num',
            sortable: true,
            minWidth: 120
          },
          {
            title: '总中奖次数',
            key: 'win_num',
            sortable: true,
            minWidth: 120
          },
          {
            title: '支付宝登录次数',
            key: 'alipay_access',
            sortable: true,
            minWidth: 140
          },
          {
            title: '微信登录次数',
            key: 'wechat_access',
            sortable: true,
            minWidth: 130
          },
          {
            title: 'Action',
            key: 'action',
            width: 120,
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
                        title: '统计数据',
                        content: `日期：${this.tableData[params.index].day}<br>
                        总抽奖次数：${this.tableData[params.index].raffle_num}<br>
                        总中奖次数：${this.tableData[params.index].win_num}<br>
                        支付宝登录次数：${this.tableData[params.index].alipay_access}<br>
                        微信登录次数：${this.tableData[params.index].wechat_access}`,
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
            url: that.GLOBAL.statistics,
            params: {
              token: that.GLOBAL.tokenKey(),
              page: that.page.num,
              pagesize: that.page.size,
            }
          })
          .then(function (res) {
            if (res.data.rc != 0) {
              that.$router.push('/');
              return false
            }
            that.dataCount = res.data.total;
            that.tableData = res.data.statistics;
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