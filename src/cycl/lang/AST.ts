export abstract class AST {
    abstract get children(): AST[];
    abstract toJS(): string;
    abstract inspect(): string;
}

export abstract class Selector extends AST {
    constructor(protected value: string) {
        super();
    }

    get children(): AST[] { return [] }
}

export class ElementSelector extends Selector { 
    inspect(): string {
        return `element(${this.value})`
    }

    toJS(): string {
        return this.value;
    }
}

export class IdSelector extends Selector { 
    inspect(): string {
        return `css-id(${this.value})`
    }

    toJS(): string {
        return `#${this.value}`
    }
}

export class ClassSelector extends Selector { 
    inspect(): string {
        return `css-class(${this.value})`
    }

    toJS(): string {
        return `.${this.value}`
    }
}

export class WithinSelector extends AST {
    constructor(private container: Selector, private content: Selector) {
        super();
    }
    get children(): AST[] { return [this.container, this.content]}
    toJS(): string { return `${this.container.toJS()}>${this.content.toJS()}`}
    inspect() { return `${this.content.inspect()} within ${this.container.inspect()}`}
}

export class GetCommand extends AST {
    constructor(private item: AST) {
        super();
    }
    get children() { return [this.item]; }
    inspect() { return `get ${this.item.inspect}` }
    toJS() {
        return `cy.get('${this.item.toJS()}')`;
    }
}

export class Program extends AST {
    constructor(private commands: AST[]) {
        super();
    }
    get children() { return this.commands; }
    inspect() { return this.commands.map(c => c.inspect()).join("\n") + "---" }
    toJS(): string {
        return this.commands.map(command => command.toJS()).join("\n");
    }
}