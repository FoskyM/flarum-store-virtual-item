import Modal from "flarum/common/components/Modal";
import app from "flarum/admin/app";
import Button from "flarum/common/components/Button";
import Alert from "flarum/common/components/Alert";
function _trans(key: string, ...a: any[]) {
    return app.translator.trans(`xypp-store-virtual-item.admin.create.${key}`, ...a);
}
export default class createModal extends Modal {
    name: string = "";
    data: {
        key: string,
        value: string
    }[] = [];
    loading = false;
    className(): string {
        return "Modal Modal--large"
    }
    title() {
        return "Create Virtual Item"
    }
    content() {
        return <div className="Modal-body">
            <div className="Form">
                <div className="Form-group">
                    <label for="xypp-virtual-item-ipt-name">{_trans('name')}</label>
                    <input id="xypp-virtual-item-ipt-name" required className="FormControl" type="text" step="any" value={this.name} onchange={((e: InputEvent) => {
                        this.name = (e.target as HTMLInputElement).value;
                    }).bind(this)} />
                </div>
                <Button className="Button Button--primary" onclick={this.click.bind(this)} disabled={this.loading} loading={this.loading}>{_trans("submit")}</Button>
                <br /><br />
                <textarea id="xypp-virtual-item-ipt-data-convert" className="FormControl" rows={3}></textarea>
                <Button className="Button" onclick={this.convert.bind(this)}>{_trans("convert")}</Button>
                <table className="Table Table--full">
                    <thead>
                        <tr>
                            <th>{_trans('key')}</th>
                            <th>{_trans('content')}</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.data.map((item, index) => {
                            return <tr key={index}>
                                <td><input className="FormControl" type="text" value={item.key} onchange={((e: InputEvent) => {
                                    this.data[index].key = (e.target as HTMLInputElement).value;
                                }).bind(this)} /></td>
                                <td><input className="FormControl" type="text" value={item.value} onchange={((e: InputEvent) => {
                                    this.data[index].value = (e.target as HTMLInputElement).value;
                                }).bind(this)} /></td>
                                <td>
                                    <Button onclick={(() => {
                                        this.data.splice(index, 1);
                                        m.redraw();
                                    }).bind(this)}>
                                        <i className="fas fa-trash"></i>
                                    </Button>
                                </td>
                            </tr>
                        })}
                        <tr><td><Button className="Button Button--primary" onclick={this.addRow.bind(this)}>{_trans("add")}</Button></td></tr>
                    </tbody>
                </table>
            </div>
        </div >
    }
    click() {
        for (let i = 0; i < this.data.length; i++) {
            if (!this.data[i].key) {
                app.alerts.show(Alert, { type: "error" }, _trans("key_required"));
            }
        }
        this.loading = true;
        m.redraw();
        app.request({
            method: "POST",
            url: app.forum.attribute("apiUrl") + "/virtual-items",
            body: {
                name: this.name,
                data: this.data
            }
        }).then(() => {
            app.modal.close();
        }).catch(() => {
            this.loading = false;
            m.redraw();
        });
    }
    addRow() {
        this.data.push({
            key: "",
            value: ""
        });
    }
    convert() {
        const val = this.$("#xypp-virtual-item-ipt-data-convert").val() + ""
        this.$("#xypp-virtual-item-ipt-data-convert").val("");

        val.trim().split("\n").forEach(line => {
            const text = line.trim();
            if (!text) return;
            const pos = (text.indexOf("\t") + 1 || text.indexOf(",") + 1 || text.indexOf(" ") + 1) - 1;
            if (pos != -1) {
                this.data.push({
                    key: text.substring(0, pos),
                    value: text.substring(pos + 1)
                });
            } else {
                this.data.push({
                    key: text,
                    value: ""
                });
            }
        });
    }
}