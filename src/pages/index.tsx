import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/pro-solid-svg-icons";
import Head from "next/head";
import React, { FC, Fragment } from "react";

import Container from "@/components/Container";

const IndexPage: FC = () =>
{
    return (
        <Fragment>
            <Head>
                <title>What's my Minecraft UUID?</title>
            </Head>
            <Container
                title="What's my UUID?"
                subtitle="Check the UUID of your Minecraft username with a click!"
                icon={ <FontAwesomeIcon icon={ faUser } /> }
            ></Container>       
        </Fragment>
    );
};

export default IndexPage;
