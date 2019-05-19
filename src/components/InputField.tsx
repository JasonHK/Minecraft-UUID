"use strict";

import ClassNames from "classnames";
import { RenderableProps, VNode, h } from "preact";

import { JSXAttributes } from "../types/Attributes";
import { Permit } from "../types/Helpers";
import { MigrateProperties } from "../types/Preact";

/**
 * The `InputField` component.
 */
export function InputField(props?: RenderableProps<InputField.Properties>, context?: any): VNode<InputField.Properties> {
        
    const { children, invalid, message, visible, ...attributes } = props;
    return (
        <div class={ ClassNames("field", { "invalid": invalid }) }>
            { children }
            <p class={ ClassNames("message", { "invalid": invalid, "visible": visible }) }>{ message }</p>
        </div>
    );
}

export namespace InputField {

    export type Properties = MigrateProperties<BaseProperties, Permit<JSXAttributes, IncludedAttributes>>;

    interface BaseProperties {
        invalid?: boolean;
        message?: string;
        visible?: boolean;
    }
    type IncludedAttributes = "id";
}

export default InputField;
