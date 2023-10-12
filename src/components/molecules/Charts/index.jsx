import React, { useCallback, useState } from 'react';
import {
  ResponsiveContainer,
  BarChart as ReBarChart,
  Bar,
  XAxis,
  Tooltip,
  YAxis,
  PieChart as RePieChart,
  Pie,
  Legend,
  Cell,
  ComposedChart,
  CartesianGrid,
  Area,
  Line,
  Sector,
} from 'recharts';

import { COLORS, LineChartData, FullPieColors, PieDataCustomShapeColors } from '../../../common/ChartData';

const renderActiveShape = props => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`Count ${value}`}</text>
    </g>
  );
};

export const BarChart = ({
  height,
  data,
  xAxisKey,
  yAxisKey,
  barKey,
  gradientStart,
  gradientEnd,
  gradientId,
  barKey2,
  legend,
  unit = '$',
  children,
}) => (
  <ResponsiveContainer height={height}>
    <ReBarChart
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="100%" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={gradientStart || '#40DDFF'} />
          <stop offset="70%" stopColor={gradientEnd || '#13B1E6'} />
        </linearGradient>
        <linearGradient id="secondBarGradient" x1="0" y1="0" x2="0" y2="100%" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFECD2 " />
          <stop offset="70%" stopColor="#FCB69F" />
        </linearGradient>
      </defs>
      <XAxis dataKey={xAxisKey} axisLine={false} tickLine={false} />
      <YAxis axisLine={false} tickLine={false} unit={unit || ''} dataKey={yAxisKey || ''} />
      <Tooltip />
      {legend && <Legend verticalAlign="top" height={36} />}
      <Bar dataKey={barKey} barSize={barKey2 || 40} fill={`url(#${gradientId})`} radius={[5, 5, 5, 5]} />
      {barKey2 && <Bar dataKey={barKey2} fill="url(#secondBarGradient)" minPointSize={10} radius={[5, 5, 5, 5]} />}
      {children}
    </ReBarChart>
  </ResponsiveContainer>
);

export const PieChart = ({ height, data, dataKey }) => (
  <ResponsiveContainer height={height}>
    <RePieChart>
      <Pie data={data} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey={dataKey}>
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend iconType="rect" />
    </RePieChart>
  </ResponsiveContainer>
);

export const LineChart = ({ height }) => (
  <ResponsiveContainer height={height}>
    <ComposedChart data={LineChartData} margin={{ top: 25, right: 30, left: 20, bottom: 5 }}>
      <defs>
        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#34dba1" stopOpacity={0.1} />
          <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0.1} />
        </linearGradient>
      </defs>
      <XAxis dataKey="date" axisLine={false} tickLine={false} />
      <YAxis dataKey="customers" axisLine={false} tickLine={false} />
      <Tooltip />
      <CartesianGrid vertical={false} stroke="#DDD" />
      <Line
        type="monotone"
        strokeLinecap="round"
        strokeWidth={2}
        dataKey="customers"
        stroke="#006991"
        dot={false}
        legendType="none"
      />
      <Area type="monotone" dataKey="customers" stroke="false" strokeWidth={2} fillOpacity={1} fill="url(#colorUv)" />
    </ComposedChart>
  </ResponsiveContainer>
);

export const FullPieChart = ({
  height,
  data,
  legendBottomCenter,
  colorsArr = FullPieColors,
  dataKey = 'count',
  label = true,
}) => (
  <ResponsiveContainer height={height}>
    <RePieChart>
      <Pie data={data} label={label} outerRadius={80} dataKey={dataKey}>
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={colorsArr[index % colorsArr.length]} />
        ))}
      </Pie>
      <Legend
        verticalAlign={legendBottomCenter ? 'bottom' : 'middle'}
        align={legendBottomCenter ? 'center' : 'right'}
        layout={legendBottomCenter ? 'horizontal' : 'vertical'}
      />
      <Tooltip />
    </RePieChart>
  </ResponsiveContainer>
);

export const PieChartCustomShape = ({ height, data, dataKey }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const onPieEnter = useCallback(
    (_, index) => {
      setActiveIndex(index);
    },
    [setActiveIndex],
  );
  return (
    <ResponsiveContainer height={height}>
      <RePieChart>
        <Pie
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          data={data}
          innerRadius={60}
          outerRadius={80}
          dataKey={dataKey}
          onMouseEnter={onPieEnter}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={PieDataCustomShapeColors[index % PieDataCustomShapeColors.length]} />
          ))}
        </Pie>
        <Legend verticalAlign="bottom" align="center" layout="horizontal" />
      </RePieChart>
    </ResponsiveContainer>
  );
};

export const HalfPieChart = ({ height, data, ...props }) => (
  <ResponsiveContainer height={height}>
    <RePieChart>
      <Pie
        dataKey="value"
        startAngle={180}
        endAngle={0}
        data={data}
        cx="50%"
        cy="50%"
        outerRadius={80}
        label
        paddingAngle={2}
        innerRadius={40}
        {...props}>
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % FullPieColors.length]} />
        ))}
      </Pie>
      <Legend verticalAlign="bottom" align="center" layout="horizontal" />
      <Tooltip />
    </RePieChart>
  </ResponsiveContainer>
);
