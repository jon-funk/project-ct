import React from "react";
import Slide from "@mui/material/Slide";

export const SlideTransition = React.forwardRef(function Transition(
    props: any,
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});
