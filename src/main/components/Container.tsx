"use strict";

import { RenderableProps, VNode, h } from "preact";

import Header from "./Header";

import { JSXAttributes } from "../types/Attributes";
import { Permit } from "../types/Helpers";
import { MigrateProperties } from "../types/Preact";

/**
 * The `Container` component.
 */
export function Container(props?: RenderableProps<Container.Properties>, context?: any): VNode<Container.Properties> {
        
    const { children, subtitle, title, ...attributes } = props;
    return (
        <section class="container" { ...attributes }>
            <Header title={ title } subtitle={ subtitle } />

            <div class="content">
                { children }
            </div>
        </section>
    );
}

export namespace Container {

    export type Properties = MigrateProperties<BaseProperties, Permit<JSXAttributes, IncludedAttributes>>;

    interface BaseProperties {
        subtitle: string;
        title:    string;
    }
    type IncludedAttributes = "id";
}

export default Container;
