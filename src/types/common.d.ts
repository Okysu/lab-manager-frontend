// 用户的类型
type user = {
    id: number,
    uid: number,
    password: string | null,
    name: string,
    mail: string,
    expire: null | string,
    disabled: number,
    rid?: number,
}

// 后端的接口回调类型
type response = {
    code: number,
    msg: string,
    data: any
}

// 远程路由表
type remote = {
    label: string
    key?: string
    icon?: string
    children?: remote[]
}

// 角色类型
type role = {
    id: number,
    name: string,
    description: string,
}

// 菜单类型
type menu = {
    id: number,
    rid: number, // 角色主键
    menu: string,
}