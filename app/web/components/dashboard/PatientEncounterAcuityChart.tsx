import React from "react";
import { Typography, Paper } from "@mui/material";
import { Group } from "@visx/group";
import { Bar } from "@visx/shape";
import { Text } from "@visx/text";
import { scaleBand, scaleLinear } from "@visx/scale";
import { AcuityCountsData } from "../../interfaces/AcuityCountsData";


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
        white: "#d3d3d3",
        green: "#008080",
        yellow: "#ffbf00",
        red: "#800020",
    };

    return (
        <Paper elevation={3} sx={{ padding: "1rem", minHeight: "300px", minWidth: "400px" }}>
            <Typography variant="h5" gutterBottom>Patient Encounters by Acuity</Typography>
            <svg width={width} height={height}>
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
            </svg>
        </Paper >
    );
};

interface PatientEncounterAcuityBarChartProps {
    acuityCountsData: AcuityCountsData[];
}
