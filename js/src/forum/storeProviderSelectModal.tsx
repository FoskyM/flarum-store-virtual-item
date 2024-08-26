import Modal, { IInternalModalAttrs } from "flarum/common/components/Modal";
import app from "flarum/forum/app";
import Button from "flarum/common/components/Button";
import Checkbox from "flarum/common/components/Checkbox";

function _trans(key: string, ...a: any[]) {
    return app.translator.trans(`xypp-store-virtual-item.forum.select.${key}`, ...a);
}
export interface VirtualItemDisplayOptions {
    name: string,
    icon: string,
    description: string,
    rest: boolean
}
export default class StoreProviderSelectModal extends Modal<{
    name: string,
    fulfill(result: VirtualItemDisplayOptions): void
    reject(): void
} & IInternalModalAttrs> {
    done: boolean = false;
    data: VirtualItemDisplayOptions = {
        name: "",
        icon: "",
        description: "",
        rest: false
    }
    oninit(vnode: any): void {
        super.oninit(vnode);
        this.data.name = this.attrs.name;
    }
    className(): string {
        return "Modal Modal--small"
    }
    title() {
        return _trans("title");
    }
    content() {
        return (
            <div className="Modal-body">
                <div className="Form">
                    <div className="Form-group">
                        {_trans("name", { name: this.data.name })}
                    </div>
                    <div className="Form-group">
                        <label >{_trans("icon")}</label>
                        <input className="FormControl"
                            type="text"
                            oninput={((e: any) => this.data.icon = e.currentTarget.value).bind(this)}
                            value={this.data.icon}
                        />
                    </div>
                    <div className="Form-group">
                        <label >{_trans("desc")}</label>
                        <input className="FormControl"
                            type="text"
                            oninput={((e: any) => this.data.description = e.currentTarget.value).bind(this)}
                            value={this.data.description}
                        />
                    </div>
                    <div className="Form-group">
                        <Checkbox state={this.data.rest} onchange={((e: boolean) => this.data.rest = e).bind(this)}>
                            {_trans("rest")}
                        </Checkbox>
                    </div>
                    <div className="Form-group">
                        <Button class="Button Button--primary" type="submit" loading={this.loading}>
                            {_trans("submit")}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
    async onsubmit(e: any) {
        e.preventDefault();
        this.done = true;
        this.attrs.fulfill(this.data);
        app.modal.close();
    }
    onbeforeremove(vnode: any) {
        super.onbeforeremove(vnode);
        if (!this.done) {
            this.attrs.reject();
        }
    }
}