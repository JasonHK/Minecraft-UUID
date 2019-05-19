"use strict";

import ClassNames from "classnames";
import { RenderableProps, VNode, h } from "preact";

import { JSXInputAttributes } from "../types/Attributes";
import { Omit } from "../types/Helpers";
import { MigrateProperties } from "../types/Preact";

/**
 * The `TextBox` component.
 */
export function TextBox(props?: RenderableProps<TextBox.Properties>, context?: any): VNode<TextBox.Properties> {
        
    const { align, inline, size, type, ...attributes } = props;
    return (
        <input type={ type } class={ ClassNames(align, size) } { ...attributes } />
    );
}

export namespace TextBox {

    export enum Alignment {
        Left   = "left",
        Center = "center",
        Right  = "right",
    }

    export enum Size {
        Large = "large",
        Small = "small"
    }

    export enum Type {
        Date          = "date",
        DateTimeLocal = "datetime-local",
        Email         = "email",
        Hidden        = "hidden",
        Month         = "month",
        Number        = "number",
        Password      = "password",
        Search        = "search",
        Tel           = "tel",
        Text          = "text",
        Time          = "time",
        URL           = "url",
        Week          = "week",
    }

    export type Properties = MigrateProperties<BaseProperties, Omit<JSXInputAttributes, ExcludedAttributes>>;

    interface BaseProperties {
        align?:  Alignment;
        inline?: boolean;
        size:    Size;
        type:    Type;
    }
    type ExcludedAttributes = "class";
}

export default TextBox;
