import layout from "./layout";
import demo from "./demo";
import helper from "./helper";
import login from "./login";
import notFound from "./common/not-found";
const isDev = process.env.NODE_ENV === 'development';
const redirect = {
    path: '/',
    name: 'redirectHome',
    redirect: '/home'
}

let routes = [
    redirect,
    layout,
    helper,
    login,
    notFound
]

if (isDev) {
    routes.unshift(demo)
}

export default routes

export {
    layout,
    demo,
    helper,
    login,
    notFound
}