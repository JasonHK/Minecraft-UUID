"use strict";

import { RenderableProps, VNode, h } from "preact";
import { route } from "preact-router";

import Container from "../components/Container";
import SpinKit from "../components/SpinKit";

import { JSXAttributes } from "../types/Attributes";
import { Permit } from "../types/Helpers";
import { MigrateProperties } from "../types/Preact";

/**
 * The `LoadingView` interface.
 */
export function LoadingView(props?: RenderableProps<LoadingView.Properties>, context?: any): VNode<LoadingView.Properties> {
        
    const { subtitle, ...attributes } = props;
    return (
        <Container title="Loading..." subtitle={ subtitle || "Sometimes are worth waiting." }>
            <SpinKit id="spinner" type={ SpinKit.Type.ThreeBounce } />
        </Container>
    );
}

export namespace LoadingView {

    export type Properties = MigrateProperties<BaseProperties, Permit<JSXAttributes, IncludedAttributes>>;

    interface BaseProperties {
        subtitle?: string;
    }
    type IncludedAttributes = "id";
}

export default LoadingView;
