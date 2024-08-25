import app from "flarum/forum/app"
import { addFrontendProviders } from "@xypp-store/forum"
import StoreItem from "@xypp-store/common/models/StoreItem"
import PurchaseHistory from "@xypp-store/common/models/PurchaseHistory"
export function initStore() {
    addFrontendProviders(
        "virtual-item",
        app.translator.trans("xypp-store-virtual-item.forum.store.name") as string,
        async function (records: Record<string, string>) {
            const data: { data: { name: string, count: number }[] } = await app.request({
                method: "GET",
                url: app.forum.attribute("apiUrl") + "/virtual-items-name"
            })
            data.data.forEach((item) => {
                records[item.name] = `${item.name}(${item.count})`
            })
        },
        (item: StoreItem, history?: PurchaseHistory) => {
            return <div>
                <br />
                <p><b>{history?.itemData().key}</b></p>
                <p>{history?.itemData().content}</p>
            </div>
        }
    )
}