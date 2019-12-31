"use strict";

import ClassNames from "classnames";
import { RenderableProps, VNode, h } from "preact";

import { JSXAttributes } from "../types/Attributes";
import { Permit } from "../types/Helpers";
import { MigrateProperties } from "../types/Preact";

/**
 * The `SpinKit` component.
 */
export function SpinKit(props?: RenderableProps<SpinKit.Properties>, context?: any): VNode<SpinKit.Properties> {
        
    const { type, ...attributes } = props;
    
    return (
        <div class={ `sk-three-bounce` }>
            <div class={ `sk-child sk-bounce1` }></div>
            <div class={ `sk-child sk-bounce2` }></div>
            <div class={ `sk-child sk-bounce3` }></div>
        </div>
    )
}

export namespace SpinKit {

    export enum Type {
        RotatingPlane  = "rotating-plane",
        DoubleBounce   = "double-bounce",
        Wave           = "wave",
        WanderingCubes = "wandering-cubes",
        Pulse          = "pulse",
        ChasingDots    = "chasing-dots",
        ThreeBounce    = "three-bounce",
        Circle         = "circle",
        CubeGrid       = "cube-grid",
        FadingCircle   = "fading-circle",
        FoldingCube    = "folding-cube",
    }

    export type Properties = MigrateProperties<BaseProperties, Permit<JSXAttributes, IncludedAttributes>>;

    interface BaseProperties {
        type: Type;
    }
    type IncludedAttributes = "id";
}

export default SpinKit;
