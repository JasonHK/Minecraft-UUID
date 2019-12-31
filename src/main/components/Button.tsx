"use strict";

import ClassNames from "classnames";
import { RenderableProps, VNode, h } from "preact";

import { JSXButtonAttributes } from "../types/Attributes";
import { MigrateProperties } from "../types/Preact";

/**
 * The `Button` component.
 */
export function Button(props?: RenderableProps<Button.Properties>, context?: any): VNode<Button.Properties>
{
    
    const { align, children, inline, size, status, type, ...attributes } = props;
    return (
        <button type={ type } class={ ClassNames(align, size, status) } { ...attributes }>
            { children }
        </button>
    );
}

export namespace Button
{
    export enum Alignment
    {
        Left   = "left",
        Center = "center",
        Right  = "right",
    }

    export enum Size
    {
        Large = "large",
        Small = "small"
    }

    export enum Status
    {
        Success = "success",
        Error   = "error"
    }

    export enum Type
    {
        Button = "button",
        Menu   = "menu",
        Reset  = "reset",
        Submit = "submit",
    }

    export type Properties = MigrateProperties<BaseProperties, Omit<JSXButtonAttributes, ExcludedAttributes>>;

    interface BaseProperties
    {
        align?:  Alignment;
        inline?: boolean;
        size:    Size;
        status?: Status;
        type?:   Type;
    }

    type ExcludedAttributes = "class";
}

export default Button;
