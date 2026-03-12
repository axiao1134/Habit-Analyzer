---
name: chartjs-integration
description: Integra Chart.js para visualización de datos
license: MIT
compatibility: opencode
metadata:
  audience: frontend-developers
  category: implementation
---

# Skill: Chart.js Integration

## Propósito

Integrar Chart.js para visualización de datos de hábitos y progreso.

## Cuándo Usar

- Gráficos de progreso
- Dashboards
- Reportes visuales

## Instalación

```bash
npm install chart.js react-chartjs-2
```

## Componente: WeeklyProgressChart

```tsx
// src/components/Charts/WeeklyProgressChart.tsx
import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartData,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface WeeklyProgressChartProps {
  data: {
    date: string;
    hours: number;
    consistency: number;
  }[];
  className?: string;
}

export const WeeklyProgressChart: React.FC<WeeklyProgressChartProps> = ({
  data,
  className = ''
}) => {
  const chartData: ChartData<'line'> = useMemo(() => ({
    labels: data.map(d => new Date(d.date).toLocaleDateString('es-ES', { 
      weekday: 'short', 
      day: 'numeric' 
    })),
    datasets: [
      {
        label: 'Horas de Actividad',
        data: data.map(d => d.hours),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
        yAxisID: 'y'
      },
      {
        label: 'Consistencia (%)',
        data: data.map(d => d.consistency),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
        yAxisID: 'y1'
      }
    ]
  }), [data]);

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Progreso Semanal',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            if (context.datasetIndex === 1) {
              return `${label}: ${value}%`;
            }
            return `${label}: ${value}h`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Horas'
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        min: 0,
        max: 100,
        title: {
          display: true,
          text: 'Consistencia (%)'
        },
        grid: {
          drawOnChartArea: false
        }
      }
    }
  };

  return (
    <div className={className} style={{ height: '300px' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};
```

## Componente: CategoryDistributionChart

```tsx
// src/components/Charts/CategoryDistributionChart.tsx
import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface CategoryDistributionChartProps {
  data: {
    category: string;
    duration: number;
    color: string;
  }[];
  className?: string;
}

export const CategoryDistributionChart: React.FC<CategoryDistributionChartProps> = ({
  data,
  className = ''
}) => {
  const chartData: ChartData<'pie'> = useMemo(() => ({
    labels: data.map(d => d.category.charAt(0).toUpperCase() + d.category.slice(1)),
    datasets: [
      {
        data: data.map(d => d.duration),
        backgroundColor: data.map(d => d.color),
        borderColor: data.map(d => `${d.color}cc`),
        borderWidth: 2
      }
    ]
  }), [data]);

  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: 'Distribución por Categoría',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            const hours = (value / 3600).toFixed(1);
            return `${label}: ${hours}h (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className={className} style={{ height: '300px' }}>
      <Pie data={chartData} options={options} />
    </div>
  );
};
```

## Componente: DailyActivityBarChart

```tsx
// src/components/Charts/DailyActivityBarChart.tsx
import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface DailyActivityBarChartProps {
  data: {
    date: string;
    study: number;
    work: number;
    exercise: number;
  }[];
  className?: string;
}

export const DailyActivityBarChart: React.FC<DailyActivityBarChartProps> = ({
  data,
  className = ''
}) => {
  const chartData: ChartData<'bar'> = useMemo(() => ({
    labels: data.map(d => new Date(d.date).toLocaleDateString('es-ES', { 
      weekday: 'short', 
      day: 'numeric' 
    })),
    datasets: [
      {
        label: 'Estudio',
        data: data.map(d => d.study / 3600), // Convertir a horas
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1
      },
      {
        label: 'Trabajo',
        data: data.map(d => d.work / 3600),
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1
      },
      {
        label: 'Ejercicio',
        data: data.map(d => d.exercise / 3600),
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1
      }
    ]
  }), [data]);

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Actividad Diaria por Categoría',
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false
        }
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: 'Horas'
        }
      }
    }
  };

  return (
    <div className={className} style={{ height: '300px' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};
```
