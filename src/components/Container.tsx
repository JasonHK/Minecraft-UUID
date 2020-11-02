import React, { FC, ReactChild } from "react";

import styles from "./Container.module.scss";

export interface IContainerProps
{
    title?: ReactChild;
    subtitle?: ReactChild;
    icon?: ReactChild;
}

const Container: FC<IContainerProps> = ({ title, subtitle, icon, children }) =>
{
    return (
        <div className={ styles.root }>
            <div className={ styles.container }>
                <header className={ styles.header }>
                    <div className={ styles.iconContainer }>
                        { icon }
                    </div>
                    { title && (<h1 className={ styles.title }>{ title }</h1>) }
                    { subtitle && (<p className={ styles.subtitle }>{ subtitle }</p>) }
                </header>
                <div className={ styles.content }>
                    { children }
                </div>
            </div>
        </div>
    );
};

export default Container;
