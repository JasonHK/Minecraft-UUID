import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/pro-solid-svg-icons";
import React, { FC } from "react";

import Container from "@/components/Container";

const IndexPage: FC = () =>
{
    return (
        <Container
            title="What's my UUID?"
            subtitle="Check the UUID of your Minecraft username with a click!"
            icon={ <FontAwesomeIcon icon={ faUser } /> }
        ></Container>
    );
};

export default IndexPage;
