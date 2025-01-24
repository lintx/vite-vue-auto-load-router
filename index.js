
export function loadRouter(globs, config = {}) {
    if (typeof globs !== "object") throw "globs must object"
    config = Object.assign({
        routerPrefix: "/",
        clearPathPrefix: true,
        setName: true,
        autoIndex: true,
    }, config)
    if (config.clearPathPrefix === true) {
        const paths = Object.keys(globs)
        if (paths.length <= 1) {
            const path = paths[0]
            const lastSlashIndex = path.lastIndexOf('/');
            config.clearPathPrefix = path.slice(0, lastSlashIndex + 1);
        }else {
            config.clearPathPrefix = paths.reduce((prefix, str) => {
                let i = 0;
                // 查找当前前缀和当前字符串的公共部分
                while (i < prefix.length && i < str.length && prefix[i] === str[i]) {
                    i++;
                }
                return prefix.slice(0, i);  // 更新前缀
            });
        }
    }
    if (typeof config.clearPathPrefix !== 'string') throw "clearPathPrefix must string or true"
    return Object.entries(globs).map(([path, glob]) => {
        let pathname = path.startsWith(config.clearPathPrefix) ? path.slice(config.clearPathPrefix.length) : path
        pathname = pathname.toLowerCase().replace('/_', '/:').replace('.vue', '')
        // if (typeof glob.render !== "function") throw "glob must .vue glob"

        const globConfig = glob.route ?? {}
        let route = {
            path: config.routerPrefix + pathname,
            component: glob,
        }
        if (config.setName) {
            route.name = pathname.replace('/:', '/').split('/').filter(Boolean).join('-')
            if (typeof config.setName === "string"){
                route.name = config.setName + route.name
            }else if (typeof config.setName === "function"){
                route.name = config.setName(pathname, glob)
            }
        }
        if (config.autoIndex && pathname === 'index') route.alias = '/'
        route = Object.assign(route, globConfig)
        if (globConfig.hasOwnProperty("component") && globConfig.component === void 0) {
            delete route.component
        }
        return route
    })
}
