import React from "react";
import { AcuityCountPerDay } from "../../interfaces/PosteventDashboard";
import { scaleBand, scaleLinear } from "@visx/scale";
import { Text } from "@visx/text";
import { Group } from "@visx/group";
import { BarStack } from "@visx/shape";
import { triageColorStyles } from "../../constants/colorPalettes";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { timeParse, timeFormat } from "d3-time-format";


export const PatientEncounterCountByDayStackedBarChart: React.FC<{
    acuityCountPerDay: AcuityCountPerDay;
    displayCounts?: boolean;
}> = (
    { acuityCountPerDay, displayCounts = true }
) => {

        const keys = displayCounts
            ? ["countWhite", "countGreen", "countYellow", "countRed"]
            : ["percWhite", "percGreen", "percYellow", "percRed"];


        const transformedData = Object.entries(acuityCountPerDay).map(([date, counts]) => {
            return {
                date,
                ...(displayCounts ? {
                    countWhite: counts.countWhite,
                    countGreen: counts.countGreen,
                    countYellow: counts.countYellow,
                    countRed: counts.countRed
                } : {
                    percWhite: counts.percWhite,
                    percGreen: counts.percGreen,
                    percYellow: counts.percYellow,
                    percRed: counts.percRed
                }),
                totalCounts: counts.totalCounts,
            };
        });

        const yAxisLabel = displayCounts ? "Counts" : "Percentage (%)";
        const chartTitle = displayCounts ? "Acuity Counts By Day" : "Acuity Percentages By Day";

        const width = 300;
        const height = 300;

        const margin = { top: 50, bottom: 20, left: 20, right: 20 };

        const xScale = scaleBand({
            range: [0, width - margin.left - margin.right],
            round: true,
            domain: transformedData.map((d) => d.date),
            padding: 0.2,
        });

        const yScale = scaleLinear({
            range: [height - margin.bottom - margin.top, 0],
            round: true,
            domain: displayCounts ? [0, Math.max(...transformedData.map(d => d.totalCounts))] : [0, 100],
        });

        const parseDate = timeParse("%Y-%m-%d");
        const formatDate = timeFormat("%b %d");
        const formatAxisDate = (date: string) => {
            const d = parseDate(date);
            return d ? formatDate(d) : date;
        };

        const getColor = (key: string) => {
            const acuityKey = key.replace("count", "").replace("perc", "").toLowerCase();
            if (Object.keys(triageColorStyles).includes(acuityKey)) {
                const colorStyle = triageColorStyles[acuityKey as keyof typeof triageColorStyles];
                return colorStyle.backgroundColor;
            } else {
                console.error(`No color style found for key: '${key}', derived acuityKey: '${acuityKey}'`);
                return "#000"; // Fallback color
            }
        };


        return (<>
            <svg width={width} height={height}>
                {/* Chart Title */}
                <Text
                    x={width / 2}
                    y={15}
                    textAnchor="middle"
                    fontSize={16}
                    fill="#000"
                >
                    {chartTitle}
                </Text>
                {/* Chart content*/}
                <Group left={margin.left} top={margin.top}>
                    <BarStack
                        data={transformedData}
                        keys={keys}
                        x={(d) => d.date}
                        xScale={xScale}
                        yScale={yScale}
                        color={getColor}
                    >
                        {(barStacks) =>
                            barStacks.map((barStack) =>
                                barStack.bars.map((bar) => (
                                    <rect
                                        key={`bar-stack-${barStack.index}-${bar.index}`}
                                        x={bar.x}
                                        y={bar.y}
                                        height={bar.height}
                                        width={bar.width}
                                        fill={bar.color}
                                        stroke="black"
                                        strokeWidth={1}
                                    />
                                ))
                            )
                        }
                    </BarStack>

                    {/* Conditionally render totals only if displaying counts */}
                    {displayCounts && transformedData.map(d => {
                        const x = xScale(d.date);
                        const y = yScale(d.totalCounts);

                        return (
                            <Text
                                key={`text-${d.date}`}
                                x={x ? x + xScale.bandwidth() / 2 : 0}
                                y={y - 10}
                                textAnchor="middle"
                            >
                                {d.totalCounts}
                            </Text>
                        );
                    })}
                </Group>
                <AxisLeft
                    scale={yScale}
                    left={margin.left}
                    top={margin.top}
                    label={yAxisLabel}
                    stroke="#000"
                    tickStroke="#000"
                    tickLabelProps={() => ({
                        fill: "#000",
                        fontSize: 11,
                        textAnchor: "end",
                    })}
                />
                <AxisBottom
                    scale={xScale}
                    top={height - margin.bottom}
                    left={margin.left}
                    stroke="#000"
                    tickStroke="#000"
                    tickFormat={formatAxisDate}
                    tickLabelProps={() => ({
                        fill: "#000",
                        fontSize: 11,
                        textAnchor: "middle",
                    })}
                />
            </svg>
        </>
        );

    }