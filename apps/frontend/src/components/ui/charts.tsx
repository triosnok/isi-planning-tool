import type { Component } from 'solid-js';
import {
  createEffect,
  createSignal,
  mergeProps,
  on,
  onCleanup,
  onMount,
} from 'solid-js';
import { unwrap } from 'solid-js/store';

import { mergeRefs, Ref } from '@solid-primitives/refs';
import type {
  ChartComponent,
  ChartData,
  ChartItem,
  ChartOptions,
  Plugin as ChartPlugin,
  ChartType,
  ChartTypeRegistry,
  TooltipModel,
} from 'chart.js';
import {
  ArcElement,
  BarController,
  BarElement,
  BubbleController,
  CategoryScale,
  Chart,
  Colors,
  DoughnutController,
  Filler,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PieController,
  PointElement,
  PolarAreaController,
  RadarController,
  RadialLinearScale,
  ScatterController,
  Tooltip,
} from 'chart.js';

export interface TypedChartProps {
  data: ChartData;
  options?: ChartOptions;
  plugins?: ChartPlugin[];
  ref?: Ref<HTMLCanvasElement | null>;
  width?: number | undefined;
  height?: number | undefined;
}

export interface ChartProps extends TypedChartProps {
  type: ChartType;
}

export interface ChartContext {
  chart: Chart;
  tooltip: TooltipModel<keyof ChartTypeRegistry>;
}

const BaseChart: Component<ChartProps> = (rawProps) => {
  const [canvasRef, setCanvasRef] = createSignal<HTMLCanvasElement | null>();
  const [chart, setChart] = createSignal<Chart>();

  const props = mergeProps(
    {
      width: 512,
      height: 512,
      options: { responsive: true } as ChartOptions,
      plugins: [] as ChartPlugin[],
    },
    rawProps
  );

  const init = () => {
    const ctx = canvasRef()?.getContext('2d') as ChartItem;
    const config = unwrap(props);
    const chart = new Chart(ctx, {
      type: config.type,
      data: config.data,
      options: config.options,
      plugins: config.plugins,
    });
    setChart(chart);
  };

  onMount(() => init());

  createEffect(
    on(
      () => props.data,
      () => {
        chart()!.data = props.data;
        chart()!.update();
      },
      { defer: true }
    )
  );

  createEffect(
    on(
      () => props.options,
      () => {
        chart()!.options = props.options;
        chart()!.update();
      },
      { defer: true }
    )
  );

  createEffect(
    on(
      [() => props.width, () => props.height],
      () => {
        chart()!.resize(props.width, props.height);
      },
      { defer: true }
    )
  );

  createEffect(
    on(
      () => props.type,
      () => {
        const dimensions = [chart()!.width, chart()!.height];
        chart()!.destroy();
        init();
        chart()!.resize(...dimensions);
      },
      { defer: true }
    )
  );

  onCleanup(() => {
    chart()?.destroy();
    mergeRefs(props.ref, null);
  });

  Chart.register(Colors, Filler, Legend, Tooltip);
  return (
    <canvas
      ref={mergeRefs(props.ref, (el) => setCanvasRef(el))}
      height={props.height}
      width={props.width}
    />
  );
};

function showTooltip(context: ChartContext) {
  let el = document.getElementById('chartjs-tooltip');
  if (!el) {
    el = document.createElement('div');
    el.id = 'chartjs-tooltip';
    document.body.appendChild(el);
  }

  const model = context.tooltip;
  if (model.opacity === 0 || !model.body) {
    el.style.opacity = '0';
    return;
  }

  el.className = `flex flex-col p-2 overflow-hidden rounded-lg border-2 border-gray-300 bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-950 ${
    model.yAlign ?? `no-transform`
  }`;

  let content = '';

  model.title.forEach((title) => {
    content += `<h3 class="font-bold">${title}</h3>`;
  });

  content += `<div>`;
  const body = model.body.flatMap((body) => body.lines);
  body.forEach((line, i) => {
    const colors = model.labelColors[i];
    content += `
        <div class="flex items-center">
          <span class="inline-block h-2 w-2 mr-1 rounded-full" style="background: ${colors.backgroundColor}; border-color: ${colors.borderColor};"></span>
          ${line}
        </div>`;
  });
  content += `</div>`;

  el.innerHTML = content;

  const pos = context.chart.canvas.getBoundingClientRect();
  el.style.opacity = '1';
  el.style.position = 'absolute';
  el.style.left = `${pos.left + window.scrollX + model.caretX}px`;
  el.style.top = `${pos.top + window.scrollY + model.caretY}px`;
  el.style.pointerEvents = 'none';
}

function createTypedChart(
  type: ChartType,
  components: ChartComponent[]
): Component<TypedChartProps> {
  const chartsWithScales: ChartType[] = ['bar', 'line', 'scatter'];
  const chartsWithLegends: ChartType[] = ['bar', 'line', 'pie'];

  const options: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: chartsWithScales.includes(type)
      ? {
          x: {
            border: { display: false },
            grid: { display: false },
          },
          y: {
            border: {
              dash: [3],
              dashOffset: 3,
              display: false,
            },
            grid: {
              color: 'hsla(240, 3.8%, 46.1%, 0.4)',
            },
          },
        }
      : {},
    plugins: {
      legend: chartsWithLegends.includes(type)
        ? {
            display: true,
            align: 'center',
            labels: {
              color: 'hsl(240, 3.8%, 46.1%)',
              font: { size: 14 },
            },
          }
        : { display: false },
      tooltip: {
        enabled: false,
        external: (context) => showTooltip(context),
      },
    },
  };

  Chart.register(...components);
  return (props) => <BaseChart type={type} options={options} {...props} />;
}

const BarChart = /* #__PURE__ */ createTypedChart('bar', [
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
]);
const BubbleChart = /* #__PURE__ */ createTypedChart('bubble', [
  BubbleController,
  PointElement,
  LinearScale,
]);
const DonutChart = /* #__PURE__ */ createTypedChart('doughnut', [
  DoughnutController,
  ArcElement,
]);
const LineChart = /* #__PURE__ */ createTypedChart('line', [
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
]);
const PieChart = /* #__PURE__ */ createTypedChart('pie', [
  PieController,
  ArcElement,
]);
const PolarAreaChart = /* #__PURE__ */ createTypedChart('polarArea', [
  PolarAreaController,
  ArcElement,
  RadialLinearScale,
]);
const RadarChart = /* #__PURE__ */ createTypedChart('radar', [
  RadarController,
  LineElement,
  PointElement,
  RadialLinearScale,
]);
const ScatterChart = /* #__PURE__ */ createTypedChart('scatter', [
  ScatterController,
  PointElement,
  LinearScale,
]);

export {
  BarChart,
  BubbleChart, BaseChart as Chart, DonutChart,
  LineChart,
  PieChart,
  PolarAreaChart,
  RadarChart,
  ScatterChart
};

