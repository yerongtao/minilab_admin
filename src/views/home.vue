<style scoped>
    .layout {
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
    }

    .layout-header-bar {
        background: #fff;
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
    }

    .layout-logo-left {
        width: 90%;
        height: 30px;
        background: #5b6270;
        border-radius: 3px;
        margin: 15px auto;
    }

    .menu-icon {
        transition: all 0.3s;
    }

    .rotate-icon {
        transform: rotate(-90deg);
    }

    .menu-item span {
        display: inline-block;
        overflow: hidden;
        width: 69px;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: bottom;
        transition: width 0.2s ease 0.2s;
    }

    .menu-item i {
        transform: translateX(0px);
        transition: font-size 0.2s ease, transform 0.2s ease;
        vertical-align: middle;
        font-size: 16px;
    }

    .collapsed-menu span {
        width: 0px;
        transition: width 0.2s ease;
    }

    .collapsed-menu i {
        transform: translateX(5px);
        transition: font-size 0.2s ease 0.2s, transform 0.2s ease 0.2s;
        vertical-align: middle;
        font-size: 22px;
    }
</style>
<template>
    <div class="body">
        <Layout :style="{minHeight: '100vh'}">
            <Sider ref="side1" hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed">
                <Menu active-name="1-0" theme="dark" width="auto" :class="menuitemClasses" @on-select="toggleData">
                    <MenuItem name="1-0">
                    <Icon type="ios-settings"></Icon>
                    <span>奖品设置</span>
                    </MenuItem>
                    <MenuItem name="1-1">
                    <Icon type="ios-book" />
                    <span>统计数据</span>
                    </MenuItem>
                    <MenuItem name="1-2">
                    <Icon type="md-beer" />
                    <span>中奖数据</span>
                    </MenuItem>
                    <MenuItem name="1-3">
                    <Icon type="md-contacts" />
                    <span>用户数据</span>
                    </MenuItem>
                </Menu>
            </Sider>

            <Layout>
                <Header :style="{padding: 0}" class="layout-header-bar">
                    <Icon @click.native="collapsedSider" :class="rotateIcon" :style="{margin: '0 20px'}" type="md-menu" size="24"></Icon>
                    后台管理系统
                </Header>
                <Content :style="{margin: '10px', background: '#fff', minHeight: '260px'}">
                    <DataTable v-if="view.dataTable" />
                    <Statistics v-if="view.statistics" />
                    <Winrecords v-if="view.winrecords" />
                    <Users v-if="view.users" />
                </Content>
            </Layout>
        </Layout>
    </div>
</template>
<script>
    import dataTable from './award-set/view'
    import statistics from './statistics'
    import winrecords from './winners/winrecords'
    import users from './users'
    export default {
        name: 'home',
        components: {
            DataTable: dataTable,
            Statistics: statistics,
            Winrecords: winrecords,
            Users: users,
        },
        data() {
            return {
                view: {
                    dataTable: true,
                    statistics: false,
                    winrecords: false,
                    users: false,
                },
                isCollapsed: false
            };
        },
        beforeDestroy() {},
        computed: {
            rotateIcon() {
                return ["menu-icon", this.isCollapsed ? "rotate-icon" : ""];
            },
            menuitemClasses() {
                return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
            }
        },
        methods: {
            toggleData(e) {
                // console.log(e)
                var that = this;
                that.view.dataTable = false;
                that.view.statistics = false;
                that.view.winrecords = false;
                that.view.users = false;
                if (e == '1-0') {
                    that.view.dataTable = true
                }
                if (e == '1-1') {
                    that.view.statistics = true
                }
                if (e == '1-2') {
                    that.view.winrecords = true
                }
                if (e == '1-3') {
                    that.view.users = true
                }
                // console.log(that.view)
            },
            collapsedSider() {
                // console.log('ss')
                this.$refs.side1.toggleCollapse();
            }
        }
    }
</script>