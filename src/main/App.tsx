"use strict";

import { History, createHashHistory } from "history";
import { Component, ComponentChild, RenderableProps, VNode, h, render } from "preact";
import { RoutableProps, Router, RouterOnChangeArgs } from "preact-router";

import AppBar from "./components/AppBar";

import HomeRoute from "./routes/Home";
import QueryRoute from "./routes/Query";

/**
 * The main entry of the application.
 */
export class App extends Component<App.Properties, App.States>
{
    private readonly _history: History;
    private _route: App.RouteStatus;

    get header() { return this.state.header; }
    set header(header: AppBar.Properties) { this.setState({ header: header }); }

    public constructor(props?: App.Properties, context?: any)
    {
        super(props, context);

        this.state = {
            header: {
                icon: "",
            }
        };

        this._history = createHashHistory({
            hashType: "hashbang"
        });

        this.onChangeHeader = this.onChangeHeader.bind(this);
        this.onRequestBack  = this.onRequestBack.bind(this);
        this.onRouteChange  = this.onRouteChange.bind(this);
    }

    private onChangeHeader(icon: string): void
    {
        if (icon !== this.header.icon) {
            this.header = Object.assign({}, this.header, { icon: icon } as AppBar.Properties);
        }
    }

    private onRequestBack(forced?: boolean): boolean
    {
        forced = forced || false;

        if (forced || (typeof this._route.previous !== "undefined")) {
            this._history.goBack();
            return true;
        } else {
            return false;
        }
    }

    private onRouteChange(args: RouterOnChangeArgs): void
    {
        const { current, previous, url } = args;
        this._route = {
            _event: args,
            current: {
                path: (current as VNode<RoutableProps>).attributes.path,
                url:  url
            },
            previous: previous
        };
    }

    public render(props?: RenderableProps<App.Properties>, state?: Readonly<App.States>, context?: any): ComponentChild
    {
        return (
            <main>
                <AppBar { ...state.header } />

                <Router history={ this._history } onChange={ this.onRouteChange }>
                    <HomeRoute path="/" default={ true } changeHeader={ this.onChangeHeader } />
                    <QueryRoute path="/query/:username" changeHeader={ this.onChangeHeader } requestBack={ this.onRequestBack } />
                </Router>
            </main>
        );
    }
}

export namespace App
{
    export interface Properties {}

    export interface States
    {
        header: AppBar.Properties
    }

    export interface ChangeHeader
    {
        (icon: string): void;
    }

    export interface RequestBack
    {
        (forced?: boolean): boolean;
    }

    export interface RouteStatus
    {
        _event: RouterOnChangeArgs;
        current: {
            path: string;
            url:  string;
        };
        previous: string;
    }
};

render(<App />, document.body, document.querySelector("main"));

if (Reflect.has(navigator, "serviceWorker"))
{
    // TODO: Add workbox-window
}

export default App;
