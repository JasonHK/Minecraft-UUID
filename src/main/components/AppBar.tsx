"use strict";

import { RenderableProps, VNode, h } from "preact";

import { JSXAttributes } from "../types/Attributes";
import { Permit } from "../types/Helpers";
import { MigrateProperties } from "../types/Preact";

/**
 * The `AppBar` component.
 */
export function AppBar(props?: RenderableProps<AppBar.Properties>, context?: any): VNode<AppBar.Properties>
{
    const { icon, ...attributes } = props;
    return (
        <header class="appbar" { ...attributes }>
            <div class="icon">
                <i class={ icon }></i>
            </div>
        </header>
    );
}

export namespace AppBar
{
    export type Properties = MigrateProperties<BaseProperties, Permit<JSXAttributes, IncludedAttributes>>;

    interface BaseProperties
    {
        icon: string;
    }

    type IncludedAttributes = "id";
}

export default AppBar;
