"use strict";

import Moment from "moment-mini";
import { Component, ComponentChild, RenderableProps, h, ComponentChildren } from "preact";
import { RoutableProps, route } from "preact-router";

import App from "../App";

import ErrorView from "../views/Error";
import LoadingView from "../views/Loading";
import ResultView from "../views/Result";

import Database from "../cores/Database";
import MojangAPI from "../cores/Mojang";

import { MigrateProperties } from "../types/Preact";

/**
 * The `QueryRoute` routine.
 */
export class QueryRoute extends Component<QueryRoute.Properties, QueryRoute.States> {
    
    private readonly database: Database<QueryRoute.UserInfo>;
    private readonly mojang:   MojangAPI;

    constructor(props?: QueryRoute.Properties, context?: any) {
        
        super(props, context);

        this.state = {
            status: QueryRoute.Status.Loading
        };

        this.database = new Database("mc-uuid", "minecraft_users");
        this.mojang = new MojangAPI();

        this.handleError = this.handleError.bind(this);
        this.onReturn    = this.onReturn.bind(this);
    }

    get error() { return this.state.error; }
    set error(error: MojangAPI.APIError) { this.setState({ error: error }); }

    get profile() { return this.state.profile; }
    set profile(profile: MojangAPI.UserInfoReturn) { this.setState({ profile: profile }); }

    get status() { return this.state.status; }
    set status(status: QueryRoute.Status) { this.setState({ status: status }); }

    private isExpired(timestamp: number) {

        return Moment().isAfter(Moment.unix(timestamp));
    }

    private isNotchUUID(uuid: string): boolean {

        return (uuid.toLowerCase() === "069a79f444e94726a5befca90e38aaf5");
    }

    private changeHeader(icon: string): void {

        if ("changeHeader" in this.props && (typeof this.props.changeHeader === "function")) {
            this.props.changeHeader(icon);
        }
    }

    private getExpiration(): number {

        return Moment().add(1, "hours").unix();
    }

    private handleError(error: MojangAPI.APIError): QueryRoute.ErrorDisplay {

        switch (error.type) {
            case MojangAPI.APIError.ErrorType.NetworkError:
                return {
                    reason: "Network error.",
                    message: [
                        "It seems that we are not able to connect to the Internet right now, please check your Internet connection settings."
                    ]
                };
            case MojangAPI.APIError.ErrorType.UsernameNotExist:
                return {
                    reason: "Username not exist.",
                    message: [
                        "Are you trying to find ", 
                        <a target="_blank" href="https://battlefordreamisland.fandom.com/wiki/Nonexisty">Nonexisty</a>, 
                        ", the one who never appear? Too bad that you will never be able to find him."
                    ]
                };
            default:
                return undefined;
        }
    }

    private resolveQuery(profile: MojangAPI.UserInfoReturn): void {

        this.profile = profile;
        this.status = QueryRoute.Status.Resolved;
    }

    private onReturn(): void {

        if (("requestBack" in this.props) && (typeof this.props.requestBack === "function")) {
            if (!this.props.requestBack()) { route("/", true); }
        } else { route("/", false); }
    }

    public componentDidMount(): void {

        this.database.get(this.props.username.toLowerCase()).then((record) => {
            if ((record === null) || this.isExpired(record.expire)) {
                this.mojang.getUserInfo(this.props.username).then((profile) => {
                    this.database.set(profile.username.toLowerCase(), {
                        expire:  this.getExpiration(),
                        profile: profile
                    });
        
                    this.resolveQuery(profile);
                }).catch((error: MojangAPI.APIError) => {
                    console.log(error);
                    if (record === null) {
                        this.error = error;
                        this.status = QueryRoute.Status.Error;
                    } else { this.resolveQuery(record.profile); }
                });
            } else { this.resolveQuery(record.profile); }
        });
    }

    public render(props?: RenderableProps<QueryRoute.Properties>, state?: Readonly<QueryRoute.States>, context?: any): ComponentChild {

        const { username, ...attributes } = props;
        
        switch (state.status) {
            case QueryRoute.Status.Loading:
                this.changeHeader("icon-clock");
                return <LoadingView />;
            case QueryRoute.Status.Resolved:
                const isNotch: boolean = this.isNotchUUID(state.profile.uuid);
                this.changeHeader(isNotch ? "notch-apple" : "icon-ok");
                return <ResultView uuid={ state.profile.uuid } title={ isNotch && "Hello Notch!" } onReturn={ this.onReturn } />
            case QueryRoute.Status.Error:
                const error: QueryRoute.ErrorDisplay = this.handleError(state.error);
                this.changeHeader("icon-cancel");
                return (
                    <ErrorView subtitle={ error.reason } onReturn={ this.onReturn }>
                        <p id="error-message">
                            { error.message }
                        </p>
                    </ErrorView>
                );
        }
    }
}

export namespace QueryRoute {

    export enum Status {
        Loading,
        Resolved,
        Error
    }

    export type Properties = MigrateProperties<BaseProperties, RoutableProps>;

    export interface States {
        error?:   MojangAPI.APIError;
        profile?: MojangAPI.UserInfoReturn;
        status:   Status;
    }

    export interface UserInfo {
        [username: string]: {
            expire:  number;
            profile: MojangAPI.UserInfoReturn;
        };
    }

    export interface ErrorDisplay {
        reason?:  string;
        message?: ComponentChildren;
    }

    interface BaseProperties {
        username?:     string;
        changeHeader?: App.ChangeHeader;
        requestBack?:  App.RequestBack;
        onViewChange?: () => void;
    }
    type IncludedAttributes = "id";
}

export default QueryRoute;
