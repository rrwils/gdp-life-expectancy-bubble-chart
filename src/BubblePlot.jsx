import {data} from './data.js';
import * as d3 from 'd3';
import { useEffect, useRef } from 'react';
import { AxisBottom } from './AxisBottom.jsx';
import { AxisLeft } from './AxisLeft.jsx';
import { useState } from 'react';

export const BubblePlot = () => {
    const margin = {top: 30, right: 30, bottom: 60, left: 70};
    const bubbleMinSize = 5;
    const bubbleMaxSize = 40;

    const width = 800;
    const height = 700;

    const boundsWidth = width - margin.left - margin.right;
    const boundsHeight = height - margin.top - margin.bottom;

    const continents = Array.from(new Set(data.map(d => d.continent)));

    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.gdpPercap)])
        .nice(6)
        .range([0, boundsWidth]);

    const yScale = d3.scaleLinear()
        .domain([35, d3.max(data, d => d.lifeExp)])
        .range([boundsHeight, 0]);

    const sizeScale = d3.scaleSqrt()
        .domain([0, d3.max(data, d => d.pop)])
        .range([bubbleMinSize, bubbleMaxSize]);
    
    const colorScale = d3.scaleOrdinal()
        .domain(data.map(d => d.continent))
        .range(d3.schemeSet1);

    const strokeColorScale = d3.scaleOrdinal()
        .domain(data.map(d => d.continent))
        .range(d3.schemeSet1.map(color => d3.color(color).darker(1).toString()));

    const popValues = data.map(d => d.pop).sort(d3.ascending);
    // const sizeLegendValues = [
    //     d3.quantile(popValues, 0.5),
    //     d3.quantile(popValues, 0.7),
    //     d3.quantile(popValues, 0.9),
    // ].map(pop => ({
    //     pop,
    //     r: sizeScale(pop),
    // }));

    const sizeLegendValues = [1e7, 5e7, 5e8].map(pop => ({
        pop,
        r: sizeScale(pop),
    })).sort((a, b) => b.r - a.r);  // Sort descending by radius for better stacking

    const sizeLegendPositions = sizeLegendValues.reduce((acc, item, i) => {
    const previous = acc[i - 1];
    const y = previous ? previous.y - previous.r * 1.8 - 5 : -item.r;  // Stack with bottoms aligned, gap for clarity
    acc.push({ ...item, y });
    return acc;
    }, []);

    const[tooltip, setTooltip] = useState({
        visible: false,
        x: 0,
        y: 0,
        data: null,
    });

    const [hovered, setHovered] = useState(null);


    return (
        <svg width={width} height={height}>
            <rect width={width} height={height} fill="#ececec"/>
            <g transform={`translate(${margin.left}, ${margin.top})`}>

                
                <rect width={boundsWidth} height={boundsHeight} fill="#ffffff" />

                {data.map((d, i) => (
                    <circle 
                        key={i}
                        cx={xScale(d.gdpPercap)}
                        cy={yScale(d.lifeExp)}
                        r={sizeScale(d.pop)}
                        fill={colorScale(d.continent)}
                        fillOpacity={hovered === i ? 1 : hovered !== null ? 0.2 : 0.5}
                        stroke={strokeColorScale(d.continent)}
                        strokeWidth={0.8}
                        strokeOpacity={hovered === i ? 1 : hovered !== null ? 0.2 : 1}
                        onMouseEnter={() => {
                            const tooltipWidth = 190;
                            const tooltipHeight = 70;
                            const padding = 5;
                            let x = xScale(d.gdpPercap) + padding;
                            if (x + tooltipWidth > boundsWidth) {
                                x = xScale(d.gdpPercap) - tooltipWidth - padding;
                            }
                            if (x < 0) {
                                x = 0;
                            }

                            let y = yScale(d.lifeExp) - tooltipHeight - padding;
                            if (y < 0) {
                                y = yScale(d.lifeExp) + padding;
                            }
                            if (y + tooltipHeight > boundsHeight) {
                                y = boundsHeight - tooltipHeight - padding;
                            }

                            setHovered(i);
                            setTooltip({
                                visible: true,
                                x,
                                y,
                                data: d
                            });
                        }}
                        onMouseLeave={() => {
                            setHovered(null);
                            setTooltip({
                                visible: false,
                                x: 0,
                                y: 0,
                                data: null
                            });
                        }}
                    />
                ))}

                <g transform={`translate(0, ${boundsHeight})`}>
                    <AxisBottom xScale={xScale} pixelsPerTick={50} boundsHeight={boundsHeight} label="GDP per capita" />
                </g>

                <AxisLeft yScale={yScale} pixelsPerTick={50} boundsWidth={boundsWidth} label="Life expectancy (years)" />

                {/* Size Legend */}
                <g transform={`translate(${boundsWidth - 80}, ${boundsHeight - 40})`}>
                    <text x={-40} y={20} fontSize={12} fill="#000">Population Size</text>
                    {sizeLegendPositions.map((item, idx) => (
                        <g key={idx}>
                            <circle
                                cx={0}
                                cy={item.y}
                                r={item.r}
                                fill="rgb(255, 255, 255)"
                                stroke="#333"
                                strokeWidth={1}
                            />
                            <text x={item.r + 8} y={item.y + 4} fontSize={12} fill="#000">
                                {d3.format('.2s')(item.pop)}
                            </text>
                        </g>
                    ))}

                    {/* Color Legend */}
                    <g transform={`translate(-120, -120)`}>
                        {continents.map((continent, i) => {
                            return (
                                <g key={continent} transform={`translate(0, ${i * 20 + 15})`}>
                                    <rect width={10} height={10} fill={colorScale(continent)} fillOpacity={0.8}/>
                                    <text x={15} y={10} fontSize={12} fill="#000000">
                                        {continent}
                                    </text>
                                </g>
                            )
                        })
                        }
                    </g>
                </g>

                {tooltip.visible && (
                    <g transform={`translate(${tooltip.x}, ${tooltip.y})`} pointerEvents="none">
                        <rect width={180} height={80} fill="white" fillOpacity={1} stroke="#333" strokeWidth={1} rx={4} />
                        <text x={10} y={18} fontSize={11} fill="#000" fontWeight={700}>{tooltip.data.country}</text>
                        <text x={10} y={33} fontSize={11} fill="#000">Life Expectancy: {tooltip.data.lifeExp.toFixed(1)} years</text>
                        <text x={10} y={48} fontSize={11} fill="#000">GDP per capita: ${d3.format('.2s')(tooltip.data.gdpPercap)}</text>
                        <text x={10} y={63} fontSize={11} fill="#000">Population: {d3.format('.2s')(tooltip.data.pop)}</text>
                    </g>
                )}

            </g>

        </svg>
    )
}