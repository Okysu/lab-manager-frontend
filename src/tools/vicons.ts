import { h } from "vue"
import { NIcon } from "naive-ui"
export async function asyncRenderIcon(icon: string) {
    // @ts-ignore
    const { [icon]: iconComp } = await import("@vicons/ionicons5")
    return () => h(NIcon, null, { default: () => h(iconComp) })
}