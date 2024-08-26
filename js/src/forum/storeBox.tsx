import app from "flarum/forum/app"
import { addFrontendProviders } from "@xypp-store/forum"
import StoreItem from "@xypp-store/common/models/StoreItem"
import PurchaseHistory from "@xypp-store/common/models/PurchaseHistory"
import StoreProviderSelectModal, { VirtualItemDisplayOptions } from "./storeProviderSelectModal"
export function initStore() {
    addFrontendProviders(
        "virtual-item",
        app.translator.trans("xypp-store-virtual-item.forum.store.name") as string,
        async function (records: Record<string, string>, specialCallbacks: Record<string, () => Promise<string>>) {
            const data: { name: string, count: number }[] = await app.request({
                method: "GET",
                url: app.forum.attribute("apiUrl") + "/virtual-items-name"
            })
            data.forEach((item) => {
                records[item.name] = `${item.name}(${item.count})`
                specialCallbacks[item.name] = () => {
                    return new Promise((resolve, reject) => app.modal.show(StoreProviderSelectModal, {
                        name: item.name,
                        fulfill(result: VirtualItemDisplayOptions) {
                            resolve(JSON.stringify(result))
                        },
                        reject
                    }, true));
                }
            })
        },
        (item: StoreItem, history?: PurchaseHistory) => {
            if (history)
                return <div>
                    <br />
                    <p><b>{history?.itemData().key}</b></p>
                    <p>{history?.itemData().content}</p>
                </div>
            try {
                const option: VirtualItemDisplayOptions = JSON.parse(item.provider_data());
                return <div><br /><br />
                    <p><i className={option.icon || "fas fa-boxes"}></i></p>
                    <p>{option.description}</p>
                </div>
            } catch (e) { console.log(e); return "ERROR" }
        }
    )
}