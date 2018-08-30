var tokenKey = function () {
    return window.localStorage.getItem("AdminToken");
}

// console.log(tokenKey);
const link = 'http://minilab.arbaseworld.com/minilab/';
const Login = `${link}a/login`;
const Refresh = `${link}a/token_refresh`;
//上传图片接口地址
const UploadImg = `${link}m/add_image`;
// 奖品设置
const Prizes = {
    view: `${link}a/prizes`,
    add: `${link}a/add_prize`,
    update: `${link}a/set_prize`,
    remove: `${link}a/remove_prize`,
}
// 统计数据
const statistics = `${link}a/statistics`
// 中奖数据
const winrecords = `${link}a/winrecords`
// 邮寄信息
const set_winrecord = `${link}a/set_winrecord`
// 管理员查看用户数据
const users = `${link}a/users`

const IP = {
    Login, // 用户地址
    Refresh, // token验证
    tokenKey, // 用户token身份
    UploadImg, // 上传图片接口地址
    Prizes, // 奖品设置
    statistics, // 统计数据
    winrecords, // 中奖数据
    set_winrecord, // 邮寄信息
    users, // 管理员查看用户数据
}
export default IP