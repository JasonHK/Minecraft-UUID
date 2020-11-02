"use strict";

import { RenderableProps, VNode, h } from "preact";
import { RoutableProps, route } from "preact-router";

import App from "../App";

import QueryView from "../views/Query";

import { MigrateProperties } from "../types/Preact";

/**
 * The `HomeRoute` routine.
 */
export function HomeRoute(props?: RenderableProps<HomeRoute.Properties>, context?: any): VNode<HomeRoute.Properties>
{
    function onQuery(query: QueryView.QueryData)
    {
        route(`/query/${ query.username }`);
    }

    const { changeHeader, ...attributes } = props;

    if (changeHeader && (typeof changeHeader === "function"))
    {
        changeHeader("icon-user");
    }

    return (
        <QueryView onQuery={ onQuery } />
    );
}

export namespace HomeRoute
{
    export type Properties = MigrateProperties<BaseProperties, RoutableProps>;

    interface BaseProperties
    {
        changeHeader?: App.ChangeHeader;
    }

    type IncludedAttributes = "id";
}

export default HomeRoute;
