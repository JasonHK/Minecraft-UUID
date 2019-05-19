"use strict";

import { Component, ComponentChild, FunctionalComponent, RenderableProps, h } from "preact";
import { Form, TFormDataField, Validators } from "preact-forms-helper";

import Button from "../components/Button";
import Container from "../components/Container";
import InputField from "../components/InputField";
import TextBox from "../components/TextBox";

import { JSXAttributes } from "../types/Attributes";
import { Permit } from "../types/Helpers";
import { MigrateProperties } from "../types/Preact";

/**
 * The `QueryView` interface.
 */
export class QueryView extends Component<QueryView.Properties, QueryView.States> {

    constructor(props?: QueryView.Properties, context?: any) {

        super(props, context);
        
        this.state = {
            form: new Form<QueryView.FormData>({
                "username": {
                    value: "",
                    validators: [
                        Validators.required(),
                        Validators.minLength(3),
                        Validators.maxLength(16),
                        Validators.pattern(/^([A-Za-z0-9_]){3,16}$/)
                    ]
                }
            }),
            fields: {
                username: {
                    invalid: false,
                    message: "\u200B",
                    visible: false
                }
            }
        };

        this.onInput  = this.onInput.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    get fields() { return this.state.fields; }
    set fields(fields: QueryView.States["fields"]) { this.setState({ fields: fields }); }

    get form() { return this.state.form; }

    private updateField<F extends keyof QueryView.States["fields"]>(field: F, value: Partial<QueryView.States["fields"][F]>) {

        const fields: QueryView.States["fields"] = Object.assign({}, this.fields, { [field]: value });
        this.fields = fields;
    }

    private getErrorMessage<F extends keyof QueryView.States["fields"]>(field: F, errors: Validators.Errors[]): string {

        if (errors.length === 0) { return "\u200B"; }

        switch (field) {
            case "username":
                if (errors.includes("required")) {
                    return "Please insert a username.";
                } else if (errors.includes("maxLength") || errors.includes("minLength")) {
                    return "The length must between 3 to 16 character long.";
                } else if (errors.includes("pattern")) {
                    return "The username has one or more invalid characters.";
                } else { return "\u200B"; }
            default:
                return "\u200B";
        }
    }

    private validate<F extends keyof QueryView.States["fields"]>(field: F, value: Form.FieldType<QueryView.FormData, F>, forceUpdate?: Function) {

        this.form.saveField(field, value);
        this.form.validateField(field, value, forceUpdate);
        this.updateField(field, {
            invalid: this.form.hasErrors(field),
            visible: this.form.isTouched(field),
            message: this.getErrorMessage(field, this.form.getErrors(field))
        } as QueryView.States["fields"][F]);
    }

    private onInput(event: Event) {

        switch ((event.target as HTMLElement).id) {
            case "query-username":
                this.validate("username", (event.target as HTMLInputElement).value);
                break;
        }
    }

    private onSubmit(event: Event) {

        if (this.form.isValid()) {
            if (("onQuery" in this.props) && (typeof this.props.onQuery === "function")) {
                this.props.onQuery({
                    username: this.form.getValue("username")
                });
            }
        }
    }

    public render(props?: RenderableProps<QueryView.Properties>, state?: Readonly<QueryView.States>, context?: any): ComponentChild {
        
        const { username, ...attributes } = props;
        return (
            <Container title="What's my UUID?" subtitle="Check the UUID of your Minecraft username with a click!" { ...attributes }>
                <form action="javascript:void(0);" onSubmit={ this.onSubmit }>
                    <InputField { ...state.fields.username }>
                        <TextBox id="query-username" name="username" type={ TextBox.Type.Text } placeholder="USERNAME" size={ TextBox.Size.Large } onInput={ this.onInput } />
                    </InputField>
                    
                    <Button id="query-submit" align={ Button.Alignment.Center } size={ Button.Size.Large } type={ Button.Type.Submit } disabled={ !state.form.isValid() }>CHECK UUID</Button>
                </form>
            </Container>
        );
    }
}

export namespace QueryView {

    export type Properties = MigrateProperties<BaseProperties, Permit<JSXAttributes, IncludedAttributes>>;

    export interface States {
        form: Form<FormData>;
        fields: {
            [K in keyof FormData]: {
                invalid: boolean;
                message: string;
                visible: boolean;
            };
        };
    }

    export type References = {
        username: FunctionalComponent<TextBox.Properties>;
    };

    export type FormData = {
        "username": TFormDataField<string>;
    };

    export interface QueryData {
        username: string;
    }

    interface BaseProperties {
        username?: string;
        onQuery?:  (query: QueryData) => void;
    }
    type IncludedAttributes = "id";
}

export default QueryView;
