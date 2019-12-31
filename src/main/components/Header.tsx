"use strict";

import { RenderableProps, VNode, h } from "preact";

import { JSXAttributes } from "../types/Attributes";
import { Permit } from "../types/Helpers";
import { MigrateProperties } from "../types/Preact";

/**
 * The `Header` component.
 */
export function Header(props?: RenderableProps<Header.Properties>, context?: any): VNode<Header.Properties>
{
    const { subtitle, title, ...attributes } = props;
    return (
        <header { ...attributes }>
            <h1>{ title }</h1>
            <p>{ subtitle }</p>
        </header>
    );
}

export namespace Header
{
    export type Properties = MigrateProperties<BaseProperties, Permit<JSXAttributes, IncludedAttributes>>;

    interface BaseProperties
    {
        title: string;
        subtitle: string;
    }

    type IncludedAttributes = "id";
}

export default Header;
