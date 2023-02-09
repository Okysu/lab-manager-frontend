// 用户的类型
type user = {
    id: number,
    uid: number,
    password: string | null,
    name: string,
    mail: string,
    expire: null | string,
    disabled: number,
}

// 后端的接口回调类型
type response = {
    code: number,
    msg: string,
    data: any
}