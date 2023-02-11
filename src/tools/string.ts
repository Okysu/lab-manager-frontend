export const safeHtml = (html: string, strict?: boolean): string => {
    // 删除script标签及其内容
    const value = html.replace(/<script[^>]*?>[\s\S]*?<\/script>/g, '')
    // 如果是严格模式，则删除所有标签
    if (strict) {
        return value.replace(/<[^>]+>/g, '')
    }
    return html
}

// 日期描述
export const dateDescription = (date: number): string => {
    const now = new Date().getTime()
    const diff = now - date
    /**
     * 如果差异在一天之内，则根据差异的大小返回x小时之前，x分钟之前，x秒之前，否则输出具体日期，
     */
    if (diff < 86400000) {
        if (diff < 3600000) {
            if (diff < 60000) {
                return `${Math.floor(diff / 1000)}秒前`
            }
            return `${Math.floor(diff / 60000)}分钟前`
        }
        return `${Math.floor(diff / 3600000)}小时前`
    }
    // 如果是昨天
    if (new Date(now).getDate() - new Date(date).getDate() === 1) {
        return '昨天'
    }
    // 返回具体日期，时分秒
    const time = new Date(date)
    return `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`
}

// 随机颜色值
export const randomColor = (): string => {
    return `#${Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6, '0')}`
}

// 颜色值反色
export const reverseColor = (color: string): string => {
    // 如果是rgb颜色值
    if (color.startsWith('rgb')) {
        const rgb = color.replace(/[^0-9,]/g, '').split(',')
        return `rgb(${255 - Number(rgb[0])},${255 - Number(rgb[1])},${255 - Number(rgb[2])})`
    }
    // 如果是十六进制颜色值
    if (color.startsWith('#')) {
        const hex = color.replace(/[^0-9a-f]/g, '')
        return `#${(0xffffff - parseInt(hex, 16)).toString(16).padStart(6, '0')}`
    }
    return color
}

// 计算二进制大小
export const binarySize = (size: number): string => {
    if (size < 1024) {
        return `${size}B`
    }
    if (size < 1048576) {
        return `${(size / 1024).toFixed(2)}KB`
    }
    if (size < 1073741824) {
        return `${(size / 1048576).toFixed(2)}MB`
    }
    return `${(size / 1073741824).toFixed(2)}GB`
}

// 描述时间粒度
export const timeDescription = (time: number): string => {
    if (time < 60000) {
        return `${time}秒`
    }
    if (time < 3600000) {
        return `${Math.floor(time / 60000)}分`
    }
    if (time < 86400000) {
        return `${Math.floor(time / 3600000)}时${Math.floor(time % 3600000 / 60000)}分`
    }
    return `${Math.floor(time / 86400000)}天${Math.floor(time % 86400000 / 3600000)}时${Math.floor(time % 3600000 / 60000)}分`
}