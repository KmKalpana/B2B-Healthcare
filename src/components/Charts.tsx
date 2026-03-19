import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
} from "recharts";
import "../styles/charts.css";
import ChartSkeleton from "./skeleton/ChartSkeleton";

interface ChartData {
  name: string;
  value: number;
  color: string;
}

interface ChartsProps {
  data: ChartData[];
  loading?: boolean;
}

export default function Charts({ data, loading = false }: ChartsProps) {

  if (!data || data.length === 0) {
    return (
      <div className="charts-container">
        <h3 className="chart-title">Complete Patient Status Distribution</h3>
        <div className="no-data">No patient data available</div>
      </div>
    );
  }

  return (
    <div className="charts-container">
      <h3 className="chart-title">Complete Patient Status Distribution</h3>
      
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart 
            data={data} 
            margin={{ top: 25, right: 15, left: 0, bottom: 15 }}
            barCategoryGap={12}
            barGap={8}
          >
            <XAxis 
              dataKey="name" 
              stroke="#64748b" 
              strokeWidth={1.5}
              fontSize={12}
              tickLine={{ stroke: '#64748b', strokeWidth: 1 }}
              axisLine={{ stroke: '#64748b', strokeWidth: 1.5 }}
              tickMargin={8}
            />
            
            <YAxis 
              stroke="#64748b"
              strokeWidth={1.5}
              fontSize={11}
              tickLine={{ stroke: '#64748b', strokeWidth: 1 }}
              axisLine={{ stroke: '#64748b', strokeWidth: 1.5 }}
              tickMargin={6}
              tickCount={8}
            />
            
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
                fontSize: '14px'
              }}
              labelStyle={{ fontWeight: 600, color: '#1e293b' }}
            />
            
            <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={28}>
              <LabelList 
                dataKey="value" 
                position="top" 
                fill="#1e293b" 
                fontSize={13} 
                fontWeight={700}
                offset={8}
              />
              {data.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
