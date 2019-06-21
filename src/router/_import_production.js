// 封装view文件下的文件引用路径
module.exports = file => () => import('@/views/' + file + '.vue')
