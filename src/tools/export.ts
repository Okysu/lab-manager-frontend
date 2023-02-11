// exportToExcel.ts
import fs from 'file-saver'
import * as XLSX from 'xlsx'
export default (json: any, fields: any, filename = '导出数据.xlsx') => {
    json.forEach((item: any) => {
        for (let i in item) {
            if (fields.hasOwnProperty(i)) {
                item[fields[i]] = item[i]
            }
            delete item[i];
        }
    })

    let sheetName = filename
    let wb = XLSX.utils.book_new()
    let ws = XLSX.utils.json_to_sheet(json, { header: Object.values(fields) })
    wb.SheetNames.push(sheetName)
    wb.Sheets[sheetName] = ws
    const defaultCellStyle = { font: { name: "微软雅黑", sz: 13, color: "FF00FF88" }, fill: { fgColor: { rgb: "FFFFAA00" } } };//设置表格的样式
    let wopts = { bookType: 'xlsx', bookSST: false, type: 'binary', cellStyles: true, defaultCellStyle: defaultCellStyle, showGridLines: false }  //写入的样式
    let wbout = XLSX.write(wb, wopts as any)
    let blob = new Blob([s2ab(wbout) as any], { type: 'application/octet-stream' })
    fs.saveAs(blob, filename + '.xlsx')
}
const s2ab = (s: any) => {
    if (typeof ArrayBuffer !== 'undefined') {
        let buf = new ArrayBuffer(s.length)
        let view = new Uint8Array(buf)
        for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
        return buf
    } else {
        let buf = new Array(s.length);
        for (let i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF
        return buf
    }
}
