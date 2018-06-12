// 所有wm-component 组件必须以统一格式 {*,*,*} export
function deCentralization(requireContext, exinclude = /^\.\/index.js$/) {
  const sourceMap = {}
  // 剔除指定文件
  const paths = requireContext.keys().filter((p,i)=>{
  	return !exinclude.test(p)
  });;
 
  for (let p of paths) {
    let splits = p.split('/')
    let fn = requireContext(p)
    let key = splits[splits.length - 1].split('.')[0]
    Object.assign(sourceMap,fn)
  }
  return sourceMap
}
const models = deCentralization(require.context('./components/', true, /^\.\/[\s\S]+\/*\.js$/))

const wm = Object.assign({},models)
const install = function (Vue, opts = {}) {
    Object.keys(wm).forEach((key) => {
        Vue.component(key, wm[key]);
    });
};
// auto install
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

export default Object.assign(wm, {install});   // eslint-disable-line no-undef
