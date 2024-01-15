import * as React from 'react';
import Typography, { TypographyProps } from '@mui/material/Typography';


/**
 * This component is used to display the copy right information in the footer
 * 
 * @param props The properties of the component
 * 
 * @returns The JSX element for the component
 */
export function Copyright(props: TypographyProps) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}
