import React from "react";
import Slide, { SlideProps } from "@mui/material/Slide";

export const SlideTransition = React.forwardRef(function Transition(
    props: SlideProps,
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});
