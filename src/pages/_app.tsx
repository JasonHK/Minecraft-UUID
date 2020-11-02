import App from "next/app";
import React from "react";

import "suitcss-base/index.css";
import "@/theme/globals.scss";

class _App extends App
{
    public render(): JSX.Element
    {
        const { Component, pageProps } = this.props;

        return (
            <Component { ...pageProps } />
        );
    }
}

export default _App;
