<style scoped>
  .paging {
    float: right;
    margin-top: 10px;
  }
</style>

<template>
  <div>
    <Row>
      <Col span="4">
      <Select clearable @on-change="changeState" v-model="modelChange" placeholder="请选择中奖状态">
        <Option value="0">已经中奖</Option>
        <Option value="1">已经填资</Option>
        <Option value="2">已经邮寄</Option>
      </Select>
      </Col>
      <Col span="5">
      <Input v-model="uidnumber" @on-search="search" search enter-button placeholder="请输入用户ID" />
      </Col>
    </Row>
    <Table :data="tableData" :columns="tableColumns" @on-row-click="handData" border highlight-row>
    </Table>
    <Page class="paging" size='small' :total="dataCount" :page-size="page.size" :page-size-opts="page.sizeOpts" show-total show-sizer
      show-elevator @on-change="changePage" @on-page-size-change="changePageSize"></Page>
    <Modal v-model="modal" title="请填写邮寄状态信息" :footer-hide="true">
      <UpdateForm @closebnt="close" ref="update" />
    </Modal>
  </div>
</template>
<script>
  import expandRow from './winners-expand'
  import updateForm from './update'
  export default {
    name: 'winrecords',
    components: {
      ExpandRow: expandRow,
      UpdateForm: updateForm,
    },
    data() {
      return {
        uidnumber: '',
        modelChange: '',
        modal: false,
        listmsg: [],
        dataCount: 10,
        page: {
          num: 1,
          size: 10,
          sizeOpts: [10, 20, 30, 40, 50]
        },
        // 表格数据设置
        tableColumns: [{
            title: '＃',
            type: 'expand',
            width: 50,
            fixed: 'left',
            render: (h, params) => {
              return h(expandRow, {
                props: {
                  row: params.row
                }
              })
            }
          }, {
            title: '奖品ID',
            key: 'wid',
            sortable: true,
            minWidth: 100,
            tooltip: true
          },
          {
            title: '奖品名字',
            key: 'name',
            sortable: true,
            tooltip: true,
            minWidth: 150,
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
            minWidth: 120
          },
          {
            title: '中奖状态',
            key: 'state',
            minWidth: 150,
            tooltip: true,
            sortable: true,
            filters: [{
                label: '已经中奖',
                value: 0
              },
              {
                label: '已经填资',
                value: 1
              },
              {
                label: '已经邮寄',
                value: 2
              }
            ],
            filterMultiple: false,
            filterMethod(value, row) {
              if (value == 0) {
                return row.state == 0;
              } else if (value == 1) {
                return row.state == 1;
              } else if (value == 2) {
                return row.state == 2;
              }
            },
            render: (h, params) => {
              // console.log(params)
              const row = params.row;
              const color = row.state == 0 ? 'success' : row.state == 1 ? 'primary' : 'info';
              const text = row.state == 0 ? '已经中奖' : row.state == 1 ? '已经填资' : '已经邮寄';
              return h('Tag', {
                props: {
                  type: 'dot',
                  color: color
                }
              }, text);
            }
          },
          {
            title: '中奖时间',
            key: 'createtime',
            sortable: true,
            tooltip: true,
            minWidth: 150,
          },
          {
            title: 'Action',
            key: 'action',
            width: 180,
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
                        title: '中奖信息',
                        content: `奖品ID：${this.tableData[params.index].wid}<br>
                        奖品名字：${this.tableData[params.index].name}<br>
                        奖品价格：${this.tableData[params.index].price}<br>
                        中奖状态：${this.tableData[params.index].state==0?'中奖':
                        this.tableData[params.index].state==1?'已经填资':'已经邮寄'}<br>
                        中奖时间：${this.tableData[params.index].createtime}<br>
                        邮寄姓名：${this.tableData[params.index].mail_name||"未填写"}<br>
                        邮寄电话：${this.tableData[params.index].mail_mobilenumber||"未填写"}<br>
                        邮寄地址：${this.tableData[params.index].mail_address||"未填写"}<br>
                        邮寄信息：${this.tableData[params.index].mail_info||"未填写"}`,
                        okText: 'sure',
                      })
                    }
                  }
                }, 'View'),
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
              ])
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
      changeState() {
        if (this.modelChange) {
          this.page.num = 1
        }
        this.getData();
      },
      updateShow(res) {
        this.listmsg = res;
        if (this.listmsg.state == 0) {
          this.$Message.warning({
            content: '未填资！',
          });
        } else {
          this.modal = true;
          this.$refs.update.clickme(this.listmsg);
        }
        // console.log(this.$refs.child.clickme())
      },
      close(msg) {
        this.getData();
        console.log(msg + '弹窗')
        this.modal = false;
        // this.$Modal.remove()
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
            url: that.GLOBAL.winrecords,
            params: {
              token: that.GLOBAL.tokenKey(),
              page: that.page.num,
              pagesize: that.page.size,
              state: that.modelChange,
              uid: that.uidnumber
            }
          })
          .then(function (res) {
            if (res.data.rc != 0) {
              that.$router.push('/');
              return false
            }
            that.dataCount = res.data.total;
            that.tableData = res.data.records;
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