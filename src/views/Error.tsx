"use strict";

import { RenderableProps, VNode, h } from "preact";

import Button from "../components/Button";
import Container from "../components/Container";

import { JSXAttributes } from "../types/Attributes";
import { Permit } from "../types/Helpers";
import { MigrateProperties } from "../types/Preact";

/**
 * The `ErrorView` interface.
 */
export function ErrorView(props?: RenderableProps<ErrorView.Properties>, context?: any): VNode<ErrorView.Properties> {

    function onClick(event: MouseEvent): void {

        switch ((event.target as HTMLElement).id) {
            case "error-return":
                if (("onReturn" in props) && (typeof props.onReturn === "function")) {
                    props.onReturn();
                }
        }
    }

    const { children, subtitle, ...attributes } = props;
    return (
        <Container title="Oops!" subtitle={ subtitle || "Something went wrong..." } { ...attributes }>
            { children }

            <Button id="error-return" type={ Button.Type.Button } align={ Button.Alignment.Center } size={ Button.Size.Large } onClick={ onClick }>TRY AGAIN</Button>
        </Container>
    );
}

export namespace ErrorView {

    export type Properties = MigrateProperties<BaseProperties, Permit<JSXAttributes, IncludedAttributes>>;

    interface BaseProperties {
        subtitle?: string;
        onReturn?: () => void;
    }
    type IncludedAttributes = "id";
}

export default ErrorView;
