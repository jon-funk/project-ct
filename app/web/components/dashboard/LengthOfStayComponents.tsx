import React from "react";
import { Paper, Typography } from "@mui/material";
import { BoxPlot } from "@visx/stats";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { BoxPlotData } from "../../interfaces/PosteventDashboard";


export interface LengthOfStayStyle {
    title: string;
    titleColor: string;
    titleBackground: string;
    boxFill: string;
    boxStroke: string;
}

export const LengthOfStayWhiskerBoxPlot: React.FC<{ boxPlotData: BoxPlotData[], style: LengthOfStayStyle }> = ({ boxPlotData: dataByDay, style }) => {


    // Calculate min and max for the yScale across all days
    const allData = dataByDay.flatMap(day => day.data);
    const min = Math.min(...allData);
    const max = Math.max(...allData);

    const buffer = Math.abs(max - min) * 0.1;

    // Scales
    const yScale = scaleLinear({
        domain: [Math.max(0, min) - buffer, max + buffer],
        range: [300, 0],
    });
    const xScale = scaleBand({
        domain: dataByDay.map(day => day.day),
        range: [0, 300],
        padding: 0.2,
    });

    // Dimensions
    const margin = { top: 20, right: 20, bottom: 80, left: 70 };
    const width = 300 + margin.left + margin.right;
    const height = 320 + margin.top + margin.bottom;

    // Calculate box width with a reduction factor
    const boxWidth = xScale.bandwidth() * 0.5;

    // Axis labels
    const xAxisLabel = "Days";
    const yAxisLabel = "Length of Stay";
    const axisFontSize = 18;

    const medianLineWidth = 3;

    return (
        <Paper sx={{ width: width, height: height }} elevation={3}>
            <Typography variant="h5" sx={{ textAlign: "center", fontWeight: "bold", color: style.titleColor, backgroundColor: style.titleBackground }}>{style.title}</Typography>
            <svg width={width} height={height}>
                <Group top={margin.top} left={margin.left}>
                    {dataByDay.map((dayData, i) => {
                        const { day, data } = dayData;
                        if (xScale(day) === undefined || !data) {
                            return null;
                        }
                        const min = Math.min(...data);
                        const max = Math.max(...data);
                        const quartiles = calculateQuartiles(data);
                        const leftPosition = xScale(day)! + (xScale.bandwidth() - boxWidth) / 2;

                        if (data.length > 1) {
                            const medianValue = yScale(quartiles.median);
                            return (
                                <Group key={i} left={leftPosition}>
                                    <BoxPlot
                                        min={min}
                                        max={max}
                                        firstQuartile={quartiles.firstQuartile}
                                        thirdQuartile={quartiles.thirdQuartile}
                                        median={quartiles.median}
                                        boxWidth={boxWidth}
                                        fill={style.boxFill}
                                        stroke={style.boxStroke}
                                        strokeWidth={2}
                                        valueScale={yScale}
                                    />
                                    {/* Custom median line */}
                                    <line
                                        x1={0}
                                        x2={boxWidth}
                                        y1={medianValue}
                                        y2={medianValue}
                                        stroke={style.titleColor}
                                        strokeWidth={medianLineWidth}
                                    />
                                </Group>
                            );
                        }
                    })}
                    <AxisLeft
                        scale={yScale}
                        label={yAxisLabel}
                        labelProps={{
                            fill: "#000",
                            textAnchor: "middle",
                            fontSize: axisFontSize,
                            fontFamily: "Arial",
                        }}
                        labelOffset={30}
                    />
                    <AxisBottom
                        top={yScale(min)}
                        scale={xScale}
                        label={xAxisLabel}
                        labelProps={{
                            fill: "#000",
                            textAnchor: "middle",
                            fontSize: axisFontSize,
                            fontFamily: "Arial",
                        }}
                        labelOffset={15}
                    />
                </Group>
            </svg>
        </Paper>
    );

};

function calculateQuartiles(data: number[]) {
    if (data.length === 1) {
        return {
            firstQuartile: data[0],
            median: data[0],
            thirdQuartile: data[0],
        };
    }
    const sortedData = [...data].sort((a, b) => a - b);
    const mid = Math.floor(sortedData.length / 2);
    const isEven = sortedData.length % 2 === 0;

    // If even number of data points, median is average of two middle values
    const median = isEven
        ? (sortedData[mid] + sortedData[mid - 1]) / 2
        : sortedData[mid];

    const firstQuartile = sortedData[Math.floor((mid - 1) / 2)];
    const thirdQuartile = sortedData[Math.ceil((sortedData.length + mid - 1) / 2)];

    return { firstQuartile, median, thirdQuartile };
}