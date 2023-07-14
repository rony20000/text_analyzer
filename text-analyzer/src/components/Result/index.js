import { Spinner } from "react-bootstrap";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
} from "recharts";

import "./Result.css";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const RADIAN = Math.PI / 180;

const Result = ({ data, isLoading }) => {
  const countriesData = data
    ? Object.values(data).filter((entity) => entity.type === "Country")
    : [];
  const personsData = data
    ? Object.values(data).filter((entity) => entity.type === "Person")
    : [];

  const renderCustomizedLabelForCountries = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) =>
    renderCustomizedLabel({
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      percent,
      label: countriesData[index].name,
    });

  const renderCustomizedLabelForPersons = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) =>
    renderCustomizedLabel({
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      percent,
      label: personsData[index].name,
    });

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    label,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        verticalAnchor="middle"
        dominantBaseline="central"
        width={25}
      >
        {`${(percent * 100).toFixed(0)}%\n${label}`}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`${label} : ${payload[0].value}`}</p>
        </div>
      );
    }

    return null;
  };

  if (isLoading) {
    return (
      <div className="result">
        <div className="loading">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </div>
    );
  }

  if (countriesData.length === 0 && personsData.length === 0) {
    return (
      <div className="result">
        <div className="wrapper">
          <h2>There is no valid Persons nor Countries</h2>
        </div>
      </div>
    );
  }

  if (data) {
    return (
      <div className="result">
        <div className="wrapper">
          <div className="country-chart">
            <h2>Countries</h2>
            <PieChart width={400} height={400}>
              <Pie
                data={countriesData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabelForCountries}
                outerRadius={200}
                fill="#8884d8"
                dataKey="repetition"
              >
                {countriesData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
            <BarChart
              width={440}
              height={300}
              margin={{ top: 50 }}
              data={countriesData}
            >
              <CartesianGrid fill="#FFF" />
              <XAxis dataKey="name" />
              <YAxis dataKey="repetition" />
              <Tooltip
                cursor={{ fill: "transparent" }}
                content={<CustomTooltip />}
              />
              <Bar type="monotone" dataKey="repetition" fill="#8884d8" />
            </BarChart>
          </div>
          <div className="people-chart">
            <h2>People</h2>
            <PieChart width={400} height={400}>
              <Pie
                data={personsData}
                cx="50%"
                cy="50%"
                labelLine={false}
                nameKey="name"
                label={renderCustomizedLabelForPersons}
                outerRadius={200}
                fill="#8884d8"
                dataKey="repetition"
              >
                {personsData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
            <BarChart
              width={440}
              height={300}
              margin={{ top: 50 }}
              data={personsData}
            >
              <CartesianGrid fill="#FFF" />
              <XAxis dataKey="name" />
              <YAxis dataKey="repetition" />
              <Tooltip
                cursor={{ fill: "transparent" }}
                content={<CustomTooltip />}
              />
              <Bar type="monotone" dataKey="repetition" fill="#8884d8" />
            </BarChart>
          </div>
        </div>
      </div>
    );
  } else {
    <div className="result" />;
  }
};

export default Result;
