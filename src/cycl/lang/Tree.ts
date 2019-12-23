import { Node } from 'ohm-js';
import { ContainsTextCommand } from "./ast/ContainsTextCommand";
import { VisitPageCommand } from "./ast/VisitPageCommand";
import { GetCommand } from "./ast/GetCommand";
import { WithinSelector } from "./ast/WithinSelector";
import { ClassSelector } from "./ast/ClassSelector";
import { IdSelector } from "./ast/IdSelector";
import { ElementSelector } from "./ast/ElementSelector";
import { Chain } from "./ast/Chain";
import { Expectation } from "./ast/Expectation";
import { StringLiteral } from "./ast/StringLiteral";
import { NumberLiteral } from "./ast/NumberLiteral";
import { Program } from "./Program";
import { ClickCommand } from './ast/ClickCommand';
import { IntrospectURL } from './ast/IntrospectURL';
import { TypeIntoCommand } from './ast/TypeIntoCommand';
import { AST } from './ast/AST';

class Dictionary extends AST {
    get children(): AST[] {
        return this.entries;
    }
    toJS(): string {
        return `{${this.entries.map(entry => entry.toJS()).join(",")}}`
    }
    inspect(): string {
        return "dict:" + this.entries.map(entry => entry.inspect()).join(",");
    }
    constructor(public entries: AST[]) { super() }
}

class Tuple extends AST {
    constructor(public key: string, public value: AST) { super(); }
    inspect() { return this.key + ":" + this.value.inspect(); }
    get children() { return [this.value]; }
    toJS() { return [this.key, this.value.toJS()].join(":"); }
}

class BooleanLit extends AST {
    constructor(public value: boolean) { super(); }
    get children() { return [] }
    inspect() { return String(this.value) }
    toJS() { return this.value ? "true" : "false" }
}

const Tree = {
    Program: (statements: Node, _delim: Node) => {
        return new Program(statements.tree)
    },

    ContainsText: (_contains: Node, _lparen: Node, text: Node, _rparen: Node) =>
        new ContainsTextCommand(text.tree),

    VisitPage: (_visit: Node, _lparen: Node, route: Node, _rparen: Node) =>
        new VisitPageCommand(route.tree),

    ClickElement: (_click: Node, _lp: Node, dict: Node, _rp: Node) => new ClickCommand(dict.tree),


    TypeInto: (_type: Node, _lparens: Node, text: Node, _rparens: Node) =>
        new TypeIntoCommand(text.tree),

    GetElement: (_find: Node, _lparen: Node, selector: Node, _rparen: Node) => {
        return new GetCommand(selector.tree);
    },

    Selector_within: (left: Node, _gt: Node, right: Node) => {
        return new WithinSelector(left.tree, right.tree);
    },

    ElementSelector: (elem: Node) =>
        new ElementSelector(elem.sourceString),

    ClassSelector: (_octothorpe: Node, elem: Node) =>
        new ClassSelector(elem.sourceString),

    IdSelector: (_octothorpe: Node, elem: Node) =>
        new IdSelector(elem.sourceString),

    BrowserOp_chain: (left: Node, _dot: Node, right: Node) =>
        new Chain([left.tree, right.tree]),

    Expectation: (_should: Node, expected: Node) => expected.tree,

    Expected: (_lp: Node, cond: Node, _comma: Node, val: Node, _rp: Node) => {
        return new Expectation(cond.tree, val.tree)
    },

    IntrospectURL: (_url: Node, _parens: Node) => {
        return new IntrospectURL();
    },

    StringLiteral_single: (_lq: Node, contents: Node, _rq: Node) => new StringLiteral(contents.sourceString),
    StringLiteral_double: (_lq: Node, contents: Node, _rq: Node) => new StringLiteral(contents.sourceString),
    NumberLiteral: (digits: Node) => new NumberLiteral(Number(digits.sourceString)),

    BooleanLiteral_truth: (_true: Node) => new BooleanLit(true),
    BooleanLiteral_falsity: (_false: Node) => new BooleanLit(false),

    Dictionary: (_rb: Node, entries: Node, _lp: Node) =>
        new Dictionary(entries.tree),

    Tuple: (key: Node, _colon: Node, value: Node) =>
        new Tuple(key.sourceString, value.tree),

    NonemptyListOf: (eFirst: Node, _sep: any, eRest: Node) => {
        let result = [eFirst.tree, ...eRest.tree];
        return result;
    },
    EmptyListOf: () => { return []; },
};

export default Tree;
