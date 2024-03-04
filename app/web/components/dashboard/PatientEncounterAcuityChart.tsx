import React from "react";
import { Typography, Paper } from "@mui/material";
import { Group } from "@visx/group";
import { Bar } from "@visx/shape";
import { Text } from "@visx/text";
import { scaleBand, scaleLinear } from "@visx/scale";
import { AcuityCountsData } from "../../interfaces/AcuityCountsData";
import { triageColorStyles } from "../../constants/colorPalettes";


/**
 * Placeholder representing the Patient Encounter Acuity bar chart.
 * 
 * @returns The PatientEncounterAcuityBarChart component
 */
export const PatientEncounterAcuityBarChart: React.FC<PatientEncounterAcuityBarChartProps> = ({ acuityCountsData }) => {

    // Chart dimensions
    const width = 400;
    const height = 300;
    const margin = { top: 20, bottom: 40, left: 20, right: 20 };

    // Scales
    const xScale = scaleBand({
        range: [margin.left, width - margin.right],
        round: true,
        domain: acuityCountsData.map(d => d.acuity),
        padding: 0.4,
    });
    const yScale = scaleLinear({
        range: [height - margin.bottom, margin.top],
        round: true,
        domain: [0, Math.max(...acuityCountsData.map(d => d.encounters))],
    });

    const barColors = {
        white: triageColorStyles.white.backgroundColor,
        green: triageColorStyles.green.backgroundColor,
        yellow: triageColorStyles.yellow.backgroundColor,
        red: triageColorStyles.red.backgroundColor,
    };

    const legendData = [
        { color: barColors.white, label: "White" },
        { color: barColors.green, label: "Green" },
        { color: barColors.yellow, label: "Yellow" },
        { color: barColors.red, label: "Red" },
    ];

    return (
        <Paper elevation={3} sx={{ padding: "1rem", minHeight: `${height}px`, minWidth: `${width}px` }}>
            <Typography variant="h5" gutterBottom sx={{ textAlign: "center", fontWeight: "bold" }}>Patient Encounters by Acuity</Typography>
            <svg width={width} height={height} overflow={"visible"}>
                <Group>
                    {acuityCountsData.map((d) => (<>

                        <Bar
                            key={d.acuity}
                            x={xScale(d.acuity)}
                            y={yScale(d.encounters)}
                            height={yScale(0) - yScale(d.encounters)}
                            width={xScale.bandwidth()}
                            fill={barColors[d.acuity as keyof typeof barColors]}
                            stroke="black"
                            strokeWidth={1}
                        />
                        <Text
                            x={xScale(d.acuity)! + xScale.bandwidth() / 2}
                            y={height - margin.bottom + 20}
                            textAnchor="middle"
                            verticalAnchor="start"
                            style={{ fontSize: 12, fontFamily: "Arial" }}
                        >
                            {d.encounters}
                        </Text>
                    </>
                    ))}
                </Group>
                {/* Render the legend */}
                <Group top={height - margin.bottom + 35}>
                    {(() => {
                        const legendWidth = legendData.length * 100;
                        const startingX = (width - legendWidth) / 2;

                        return legendData.map((legend, index) => (
                            <Group key={index} left={startingX + index * 100}>
                                <rect fill={legend.color} width={15} height={15} />
                                <Text
                                    x={20}
                                    y={12}
                                    style={{ fontSize: 12, fontFamily: "Arial" }}
                                >
                                    {legend.label}
                                </Text>
                            </Group>
                        ));
                    })()}
                </Group>

            </svg>
        </Paper >
    );
};

interface PatientEncounterAcuityBarChartProps {
    acuityCountsData: AcuityCountsData[];
}
