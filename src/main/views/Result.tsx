"use strict";

import Clipboard, { Event as ClipboardEvent } from "clipboard";
import { Component, ComponentChild, RenderableProps, VNode, h } from "preact";

import Button from "../components/Button";
import Container from "../components/Container";
import TextBox from "../components/TextBox";

import { JSXAttributes } from "../types/Attributes";
import { Permit } from "../types/Helpers";
import { MigrateProperties } from "../types/Preact";

/**
 * The `ResultView` interface.
 */
export class ResultView extends Component<ResultView.Properties, ResultView.States> {

    private readonly clipboard: Clipboard;

    constructor(props?: ResultView.Properties, context?: any) {

        super(props, context);

        this.state = {
            buttons: {
                copy: {}
            }
        };

        this.clipboard = new Clipboard("#result-copy");

        this.onClick = this.onClick.bind(this);
    }

    get buttons() { return this.state.buttons; }
    set buttons(buttons: ResultView.States["buttons"]) { this.setState({ buttons: buttons }); }

    private updateButton<B extends keyof ResultView.States["buttons"]>(button: B, value: Partial<ResultView.States["buttons"][B]>) {

        const buttons: ResultView.States["buttons"] = Object.assign({}, this.buttons, { [button]: value });
        this.buttons = buttons;
    }

    private onClick(event: MouseEvent): void {

        switch ((event.target as HTMLElement).id) {
            case "result-return":
                if (("onReturn" in this.props) && (typeof this.props.onReturn === "function")) {
                    this.props.onReturn();
                }
        }
    }

    private onClipboardEvent(event: ClipboardEvent, type: "success" | "error"): void {

        if (type == "success") {
            this.updateButton("copy", {
                status: Button.Status.Success,
                text:   "COPIED!"
            });
        } else {
            this.updateButton("copy", {
                status: Button.Status.Error,
                text:   "FAILED!"
            });
        }

        event.clearSelection();
        setTimeout(() => {
            this.updateButton("copy", {
                status: undefined,
                text:   undefined
            });
        }, 5000);
    }

    public componentDidMount(): void {

        this.clipboard.on("success", (event) => {
            this.onClipboardEvent(event, "success");
        });

        this.clipboard.on("error", (event) => {
            this.onClipboardEvent(event, "error");
        });
    }

    public componentWillUnmount(): void {

        this.clipboard.destroy();
    }
    
    public render(props?: RenderableProps<ResultView.Properties>, state?: Readonly<ResultView.States>, context?: any): ComponentChild {

        const { title, uuid, ...attributes } = props;
        return (
            <Container title={ title || "Gotcha!" } subtitle="Click the text below to copy the UUID." { ...attributes }>
                <TextBox id="result-uuid" type={ TextBox.Type.Text } size={ TextBox.Size.Small } value={ uuid } readOnly />
                <Button id="result-copy" type={ Button.Type.Button } size={ Button.Size.Small } status={ state.buttons.copy.status } data-clipboard-target="#result-uuid">{ state.buttons.copy.text || "COPY" }</Button>

                <Button id="result-return" type={ Button.Type.Button } align={ Button.Alignment.Center } size={ Button.Size.Small } onClick={ this.onClick }>CHECK ANOTHER USERNAME</Button>
            </Container>
        );
    }
}

export namespace ResultView {

    export type Properties = MigrateProperties<BaseProperties, Permit<JSXAttributes, IncludedAttributes>>;

    export interface States {
        buttons: {
            [K in Buttons]: {
                status?: Button.Status;
                text?:   string;
            };
        };
    }

    type Buttons = "copy";

    interface BaseProperties {
        title?:    string;
        uuid:      string;
        onReturn?: () => void;
    }
    type IncludedAttributes = "id";
}

export default ResultView;
