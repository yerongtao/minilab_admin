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
    <Button @click="addShow" style="margin:10px" size="small" type="primary" icon="md-add">添加数据</Button>
    <Page class="paging" size='small' :total="dataCount" :page-size="page.size" :page-size-opts="page.sizeOpts" show-total show-sizer
      show-elevator @on-change="changePage" @on-page-size-change="changePageSize"></Page>
    <Modal v-model="modal1" title="请输入数据" :footer-hide="true">
      <AddForm @closebnt="close" />
    </Modal>
    <Modal v-model="modal2" title="请更改数据" :footer-hide="true">
      <UpdateForm @closebnt="close" ref="update" />
    </Modal>
  </div>
</template>
<script>
  import addForm from './add'
  import updateForm from './update'
  export default {
    components: {
      UpdateForm: updateForm,
      AddForm: addForm
    },
    name: 'DataTable',
    data() {
      return {
        modal1: false,
        modal2: false,
        dataCount: 10,
        page: {
          num: 1,
          size: 10,
          sizeOpts: [10, 20, 30, 40, 50]
        },
        // 表格数据设置
        tableColumns: [{
            title: '奖品名字',
            key: 'name',
            sortable: true,
            tooltip: true,
            width: 150,
            fixed: 'left',
          },
          {
            title: '奖品图案',
            key: 'thumbnail',
            width: 138,
            render: (h, params) => {
              // console.log(params.row.thumbnail)
              return h('div', {
                style: {
                  background: `url(${params.row.thumbnail}) no-repeat center`,
                  backgroundSize: 'cover',
                  width: '100px',
                  height: '100px',
                  margin: '2px 0'
                }
              });
            }

          },
          {
            title: '奖品价格',
            key: 'price',
            sortable: true,
            width: 120
          },
          {
            title: '奖品创建时间',
            key: 'create_time',
            sortable: true,
            width: 150
          },
          {
            title: '奖品说明',
            key: 'description',
            tooltip: true,
            minWidth: 120
          },
          {
            title: '中奖概率',
            key: 'rate',
            sortable: true,
            width: 120,
          },
          {
            title: '剩余个数',
            key: 'remain',
            sortable: true,
            width: 120,
          },
          {
            title: 'Action',
            key: 'action',
            width: 250,
            align: 'center',
            render: (h, params) => {
              // console.log(params)
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                    icon: 'md-create'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.updateShow(params.row)
                    }
                  }
                }, 'Edit'),
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
                        title: '奖品信息',
                        content: `奖品名字：${this.tableData[params.index].name}<br>
                        奖品价格：${this.tableData[params.index].price}<br>
                        奖品创建时间：${this.tableData[params.index].create_time}<br>
                        奖品说明：${this.tableData[params.index].description}<br>
                        中奖概率：${this.tableData[params.index].rate}<br>
                        剩余个数：${this.tableData[params.index].remain}`,
                        okText: 'sure',
                      })
                    }
                  }
                }, 'View'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small',
                    icon: 'md-close'
                  },
                  on: {
                    click: () => {
                      // var that=this
                      // console.log(that.tableData,params)
                      this.$Modal.error({
                        title: '警告',
                        content: `确定删除？`,
                        okText: '确认',
                        closable: true,
                        onOk: () => {
                          this.remove(params.index);
                        }
                      })

                    }
                  }
                }, 'Delete')
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
      close(msg) {
        this.getData();
        console.log(msg + '弹窗')
        this.modal1 = false;
        this.modal2 = false;
        // this.$Modal.remove()
      },
      getData() {
        if (!this.GLOBAL.tokenKey()) {
          this.$router.push('/');
          this.$Message.warning("登录过期，请重新登录！");
          console.log('登录过期，请重新登录！')
          return false;
        }
        var that = this;
        this.axios({
            method: 'get',
            // url: that.GLOBAL.News.view,
            url: that.GLOBAL.Prizes.view,
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
            that.tableData = res.data.prizes;
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
      addShow(res) {
        this.modal1 = true;
      },
      updateShow(res) {
        this.modal2 = true;
        this.listmsg = res;
        this.$refs.update.clickme(this.listmsg);
        // console.log(this.$refs.child.clickme())
      },
      remove(index) {
        var that = this;
        let dataId = that.tableData[index].pid
        console.log(dataId)
        that.tableData.splice(index, 1);
        that.axios.get(that.GLOBAL.Prizes.remove, {
            params: {
              pid: dataId,
              token: that.GLOBAL.tokenKey()
            }
          })
          .then(function (res) {
            if (res.data.rc == 0) {
              that.$Message.error('已删除!');
              that.dataCount--;
            }
          })
          .catch(function (error) {})
      }

    },

  }
</script>