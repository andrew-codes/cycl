import { AST } from "./AST";

export class ClickCommand extends AST{
    constructor(public arg?: AST) { super(); }
    get children(): AST[] { return this.arg ? [this.arg] : [] }
    toJS(): string {
        if (this.arg !== undefined) {
            console.log("ARG at CLICK", this.arg)
            return `click(${this.arg.toJS()})`;
        } else {
            return 'click()'
        }
    }
    inspect(): string { return 'click()' }
}
