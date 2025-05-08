import ExtensionPage from "flarum/admin/components/ExtensionPage";
import app from 'flarum/admin/app';
import Button from "flarum/common/components/Button";
import { showIf } from "../../common/utils/NodeUtil";
import LoadingIndicator from "flarum/common/components/LoadingIndicator";
import VirtualItem from "../../common/models/VirtualItem";
import Checkbox from "flarum/common/components/Checkbox";
import Select from "flarum/common/components/Select";
import icon from 'flarum/common/helpers/icon';
import withAttr from 'flarum/common/utils/withAttr';
import createModal from "./createModal";
function _trans(key: string, ...a: any[]) {
    return app.translator.trans(`xypp-store-virtual-item.admin.table.${key}`, ...a);
}
export default class adminPage extends ExtensionPage {
    items: VirtualItem[] = [];
    name: string = "";
    key: string = "";
    more: boolean = false;
    item_loading: boolean = false;
    offset: number = 0;
    filterMap: Record<string, string> = {}
    currentFilter: string = "all";
    isRemoving: Record<string, boolean> = {};
    batchRemoving: boolean = false;
    selected: string[] = [];
    selectedMap: Record<string, boolean> = {};
    oncreate(vnode: any): void {
        super.oncreate(vnode);
        this.loadMore();
        app.request({
            method: "GET",
            url: app.forum.attribute("apiUrl") + "/virtual-items-name"
        }).then(((data: { name: string, count: number }[]) => {
            // this.filterMap = { all: _trans("all") as string };
            data.forEach((item) => {
                this.filterMap[item.name] = `${item.name}(${item.count})`;
            })
        }) as any)
    }
    content(vnode: any) {
        return <div className="ExtensionPage-settings">
            <div className="container xypp-store-virtual-item-adminPage-container">
                <div className="xypp-store-virtual-item-adminPage-actions">

                    <div className="actions-start">
                        <span className="Select">
                            <select
                              className="Select-input FormControl"
                              onchange={
                                withAttr('value',
                                    ((e: string) => {
                                        this.currentFilter = e;
                                        this.name = this.currentFilter == 'all' ? '' : this.currentFilter;
                                        this.offset = 0;
                                        this.items = [];
                                        this.more = true;
                                        this.loadMore();
                                    }).bind(this)
                                )
                              }
                              value={this.currentFilter}
                            >
                              <option value="all">{ _trans("all")}</option>
                              {Object.keys(this.filterMap).map((key) => (
                                <option value={key}>{this.filterMap[key]}</option>
                              ))}
                            </select>
                            {icon('fas fa-sort', { className: 'Select-caret' })}
                        </span>

                        {showIf(this.selected.length > 0,
                            <Button className="Button Button--danger" onclick={this.removeBatch.bind(this)} disabled={this.batchRemoving} loading={this.batchRemoving} >
                                {_trans("delete_batch", { count: this.selected.length })}
                            </Button>
                        )}
                    </div>

                    <Button className="Button Button--primary" onclick={this.create.bind(this)} >
                        {_trans("create")}
                    </Button>
                </div>
                <table className="Table Table--full">
                    <thead>
                        <tr>
                            <th>
                                <input type="checkbox" oninput={(e: InputEvent) => {
                                    const checked = (e.currentTarget as HTMLInputElement).checked as boolean;
                                    this.selectedMap = {};
                                    this.selected = [];
                                    this.items.forEach((item) => {
                                        this.selectedMap[item.id()!] = checked;
                                        if (checked) this.selected.push(item.id()!);
                                    })
                                    m.redraw();
                                }} />
                            </th>
                            <th>{_trans("id")}</th>
                            <th>{_trans("name")}</th>
                            <th>{_trans("key")}</th>
                            <th>{_trans("assign")}</th>
                            <th>{_trans("operation")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.items.map((item) => {
                            const id = item.id() as string;
                            const removing = this.isRemoving[item.id()!] || (this.selectedMap[id] && this.batchRemoving) || false
                            return (
                                <tr>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={this.selectedMap[id]}
                                            oninput={((e: InputEvent) => {
                                                this.selectedMap[id] = (e.currentTarget as HTMLInputElement).checked as boolean;
                                                if (!this.selectedMap[id]) this.selected = this.selected.filter(id => id != item.id());
                                                else this.selected.push(id);
                                            }).bind(this)}
                                            disabled={this.batchRemoving}
                                        />
                                    </td>
                                    <td>{item.id()}</td>
                                    <td>{item.name()}</td>
                                    <td>{item.key()}</td>
                                    <td>{item.assign_user_id()}</td>
                                    <td>
                                        <Button className="Button Button--danger" onclick={this.removeOne.bind(this)} data-id={item.id()} disabled={removing} loading={removing}>
                                            <i class="fas fa-trash"></i>
                                        </Button>
                                    </td>
                                </tr>
                            )
                        })}
                        <tr>
                            <td></td><td></td>
                            <td>
                                {showIf(this.item_loading, <LoadingIndicator />,
                                    showIf(this.more,
                                        <Button className="Button Button--primary" onclick={this.loadMore.bind(this)} >
                                            {_trans("load_more")}
                                        </Button>)
                                )}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    }

    create() {
        app.modal.show(createModal, {
          itemsCreated: () => {
            this.offset = 0;
            this.items = [];
            this.more = true;
            this.loadMore();
          }
        });
    }
    async loadMore() {
        this.item_loading = true;
        m.redraw();
        const newItems = await app.store.find<VirtualItem[]>('virtual-items', { offset: this.offset, name: this.name, key: this.key } as any);
        this.items.push(...newItems);
        this.item_loading = false;
        if (newItems.length < 30) {
            this.more = false;
        }
        this.offset += newItems.length;
        m.redraw();
    }
    removeOne(e: MouseEvent) {
        const id = (e.currentTarget as HTMLButtonElement).getAttribute("data-id");
        if (!id) return;
        const model = app.store.getById<VirtualItem>("virtual-items", id);
        if (!model) return;
        if (confirm(_trans("remove_confirm") + "")) {
            this.isRemoving[id] = true;
            m.redraw();
            model.delete().then(() => {
                this.items = this.items.filter((item) => item.id() != id);
                this.isRemoving[id] = false;
                m.redraw();
            });
        }
    }
    removeBatch() {
        if (confirm(_trans("remove_confirm") + "")) {
            this.batchRemoving = true;
            m.redraw();
            app.request({
                method: "DELETE",
                url: app.forum.attribute("apiUrl") + "/virtual-items",
                body: {
                    ids: this.selected
                }
            }).then(() => {
                this.items = this.items.filter((item) => !this.selectedMap[item.id()!]);
                this.selectedMap = {};
                this.selected = [];
                this.batchRemoving = false;
                m.redraw();
            });
        }
    }
}
