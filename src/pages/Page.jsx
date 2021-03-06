import PropTypes from 'prop-types';
import React from 'react';

import { TitleBar, } from '../components/TitleBar';

export const Page = props => (
    <>
        <TitleBar title={props.title} />
        {props.children}
    </>
);

Page.propTypes = {
    title    : PropTypes.string,
    children : PropTypes.node,
};
