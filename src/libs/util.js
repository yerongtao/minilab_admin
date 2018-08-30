let util = {

};
util.title = function (title) {
    title = title ? title + ' - 后台数据' : 'iView project';
    window.document.title = title;
};

export default util;