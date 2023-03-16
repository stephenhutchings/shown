declare module "shown" {
    /**
     * Generate a bar chart.
     * @example
     * shown.bar({
     *   data: [
     *      3.57773343,
     *      5.72659784,
     *      0.93839406,
     *      4.13082349,
     *      3.12045823,
     *   ],
     * })
     * @example
     * shown.bar({
     *   title: "Bar Chart",
     *   data: [
     *      [6286, 1065],
     *      [4197, 1853],
     *      [3444, 1479],
     *   ],
     *   map: { key: ["A", "B"] },
     *   xAxis: { label: ["I", "II", "III"] }
     * })
     * @example
     * shown.bar({
     *   title: "Bar Chart",
     *   data: [
     *      [62.86, 10.65, 14.54, 10.09, 1.86],
     *      [41.97, 18.53, 11.71, 17.85, 9.94],
     *      [34.44, 14.79, 30.64, 18.31, 1.82],
     *   ],
     *   map: {
     *     width: (v, i) => v === 30.64 ? 0.8 : 0.6,
     *     label: (v, i) => v === 30.64 ? v.toFixed(1) : false,
     *     key: (v, i) => ["A", "B", "C", "D", "E"][i],
     *   },
     *   stack: true,
     *   xAxis: { label: ["I", "II", "III"] }
     * })
     * @example
     * shown.bar({
     *   title: "Stacked Series",
     *   data: [
     *     [
     *       [10.65, 14.54],
     *       [18.53, 11.71],
     *       [14.79, 30.64],
     *     ], [
     *       [10.09, 21.86],
     *       [17.85, 19.94],
     *       [18.31, 11.82],
     *     ]
     *   ],
     *   map: {
     *     key: ["In", "Out"],
     *     series: ["A", "B", "C"],
     *     tally: Math.round,
     *     label: Math.round,
     *     attrs: (d) => ({ "data-value": d })
     *   },
     *   xAxis: { label: ["I", "II"] }
     * })
     * @param options - Data and display options for the chart.
     * @param options.data - The data for this chart. Data can
     * be passed either as a flat array of numbers, or a array of arrays for a
     * stacked bar chart.
     * @param [options.title] - The title for this chart, set to the
     * `<title>` element for better accessibility.
     * @param [options.description] - The description for this chart, set
     * to the `<desc>` element for better accessibility.
     * @param [options.map] - Controls for transforming data. See {@link MapOptions} for more details.
     * @param [options.stack] - Whether to stack nested values or render them side-by-side. If values are
     * nested three-levels deep, items will always be stacked.
     * @param [options.xAxis] - Overrides for the x-axis. See {@link AxisOptions} for more details.
     * @param [options.yAxis] - Overrides for the y-axis. See {@link AxisOptions} for more details.
     * @returns Rendered chart
     */
    function bar(options: {
        data: any[];
        title?: string;
        description?: string;
        map?: MapOptions;
        stack?: boolean;
        xAxis?: AxisOptions;
        yAxis?: AxisOptions;
    }): string;
    /**
     * Generate a chart legend.
     * @example
     * shown.legend({
     *   data: [
     *     { key: "Item 1", color: "#ea84e1", shape: "circle" },
     *     { key: "Item 2", color: "#7bcbf0", shape: "square" }
     *   ],
     *   line: true,
     *   wrap: true,
     * });
     * @param options.data - Mapped data. See {@link LegendItem} for more details.
     * @param [options.line] - Include a line with each symbol, for use
     * alongside a line chart.
     * @param [options.wrap] - Wrap the template with `<div class="shown"
     * />` element. This is required when the legend is rendered separately to
     * ensure scoped styles are applied.
     * @param [options.defs] - Include `<symbol>` definitions for shapes.
     * If `undefined`, this defaults to the same value as `wrap`. Symbol definitions
     * only need to be included once on any page.
     * @returns Rendered legend
     */
    function legend(options: {
        data: LegendItem[];
        line?: boolean;
        wrap?: boolean;
        defs?: boolean;
    }): string;
    /**
     * Generate a line chart.
     * @example
     * shown.line({
     *   title: "Custom axis",
     *   data: [
     *     -0.0327,  0.05811,  0.18046,  0.27504,  0.43335,  0.43815,
     *     0.54249,  0.57011,  0.54897,  0.60961,  0.58727,  0.53557,
     *     0.55060,      NaN,    null, undefined,    false,  0.02642,
     *     -0.0097,  -0.1826,  -0.2999,  -0.3352,  -0.4735,  -0.4642,
     *     -0.5720,  -0.6065,  -0.5761,  -0.5724,  -0.6096,  -0.5314,
     *     -0.4492,  -0.4007,  -0.3008,  -0.1924,  -0.0696,  0.00279,
     *   ],
     *   xAxis: { min: 1988, max: 2023 },
     *   yAxis: { ticks: 15, label: (v, i) => (i % 2 !== 0) && v.toFixed(1) },
     * })
     * @example
     * shown.line({
     *   title: "Map x and y data",
     *   data: [{x: 0, y: 1}, {x: 1, y: -1}, {x: 2, y: 1}],
     *   map: {
     *     x: (d) => d.x,
     *     y: (d) => d.y,
     *     curve: "bump"
     *   }
     * })
     * @example
     * shown.line({
     *   title: "Multiple lines, curves and shapes",
     *   data: [
     *      [52.86, 20.65, 14.54, 10.09, 41.86],
     *      [21.97, 31.71, 56.94, 17.85, 23.53],
     *      [ 6.73, 10.84, 37.62, 45.79, 53.32],
     *      [38.44, 50.79, 22.31, 31.82,  7.64],
     *   ],
     *   map: {
     *     curve: ["linear", "bump", "monotone", "stepX"],
     *     shape: ["circle", "square", "triangle", "diamond"],
     *     key: ["α", "β", "γ", "δ"],
     *   },
     *   xAxis: { label: ["A", "B", "C", "D", "E"], inset: 0.1 },
     * })
     * @param options - Data and display options for the chart.
     * @param options.data - The data for this chart. Data can
     * be passed either as a flat array for a single line, or nested arrays
     * for multiple lines.
     * @param [options.title] - The title for this chart, set to the
     * `<title>` element for better accessibility.
     * @param [options.description] - The description for this chart, set
     * to the `<desc>` element for better accessibility.
     * @param [options.map] - Controls for transforming data. See {@link MapOptions} for more details.
     * @param [options.xAxis] - Overrides for the x-axis. See {@link AxisOptions} for more details.
     * @param [options.yAxis] - Overrides for the y-axis. See {@link AxisOptions} for more details.
     * @param [options.showGaps] - Points in the line with non-finite values are rendered as broken lines
     * where data is unavailable. Set to `false` to ignore missing values instead.
     * @returns Rendered chart
     */
    function line(options: {
        data: any[];
        title?: string;
        description?: string;
        map?: MapOptions;
        xAxis?: AxisOptions;
        yAxis?: AxisOptions;
        showGaps?: boolean;
    }): string;
    /**
     * Generate a pie chart.
     * @example
     * shown.pie({ data: [60, 30, 10] });
     * @example
     * shown.pie({
     *    title: "Donut Chart",
     *    data: [{ n: 120 }, { n: 300 }, { n: 180 }],
     *    map: {
     *      value: (d, i) => d.n,
     *      label: (d, i) => "$" + d.n,
     *      color: ["#fc6", "#fa0", "#fb3"],
     *      width: 0.6
     *    },
     *  })
     * @example
     * shown.pie({
     *   title: "Gauge Chart",
     *   data: [60, 30, 10],
     *   startAngle: -0.33,
     *   endAngle: 0.33,
     *   map: {
     *     width: 0.4,
     *     key: ["Item 1", "Item 2", "Item 3"],
     *     attrs: (d) => ({ "data-value": d })
     *   }
     * });
     * @param options - Data and display options for the chart.
     * @param options.data - The data for this chart. Values can sum to
     * any number, and percentages will be calculated as needed.
     * @param [options.title] - The title for this chart, set to the
     * `<title>` element for better accessibility.
     * @param [options.description] - The description for this chart, set
     * to the `<desc>` element for better accessibility.
     * @param [options.sorted] - Whether to sort the values.
     * @param [options.map] - Controls for transforming data. See {@link MapOptions} for more details.
     * @param [options.startAngle] - The initial rotation of the chart.
     * Angle values should fall between zero and one.
     * @param [options.endAngle] - The final rotation of the chart.
     * Angle values should fall between zero and one.
     * @returns Rendered chart
     */
    function pie(options: {
        data: number[];
        title?: string;
        description?: string;
        sorted?: boolean;
        map?: MapOptions;
        startAngle?: number;
        endAngle?: number;
    }): string;
    /**
     * Generate a scatter chart.
     * @example
     * shown.scatter({
     *   data: [
     *     [[ 77,  67], [389, 416], [352, 319], [190, 147], [228, 240], [ 25,  39]],
     *     [[422, 450], [292, 278], [108, 126], [461, 453], [425, 392], [226, 205]],
     *     [[113, 141], [317, 291], [356, 357], [349, 302], [161, 192], [424, 419]],
     *     [[137, 130], [400, 430], [377, 322], [ 30,  48], [131,  56], [268, 258]],
     *     [[357, 361], [251, 192], [175, 187], [404, 352], [128, 109], [120, 157]],
     *     [[ 65,  99], [235, 170], [204, 161], [220, 214], [252, 244], [ 44,  97]]
     *   ]
     * })
     * @example
     * shown.scatter({
     *   data: [
     *     {x: 11, y: 14}, {x: 32, y: 23}, {x: 25, y: 34}, {x: 45, y: 43},
     *     {x: 31, y: 24}, {x: 31, y: 28}, {x: 29, y: 19}, {x: 40, y: 33},
     *     {x: 21, y: 34}, {x: 21, y: 38}, {x: 39, y: 29}, {x: 30, y: 33},
     *     {x: 25, y: 25, special: true}
     *   ],
     *   map: {
     *     x: (d) => d.x,
     *     y: (d) => d.y,
     *     shape: d => d.special ? "cross" : "circle",
     *     attrs: (d) => d.special && {
     *       style: { color: "#fe772b" }
     *     }
     *   },
     *   xAxis: { min: 0, line: (v, i, axis) => v === axis.min || v === axis.max },
     *   yAxis: { min: 0, line: (v, i, axis) => v === axis.min || v === axis.max },
     * })
     * @param options - Data and display options for the chart.
     * @param options.data - The data for this chart. Data can
     * be passed either as an array of `[x, y]` points, or nested arrays
     * for multiple series.
     * @param [options.title] - The title for this chart, set to the
     * `<title>` element for better accessibility.
     * @param [options.description] - The description for this chart, set
     * to the `<desc>` element for better accessibility.
     * @param [options.map] - Controls for transforming data. See {@link MapOptions} for more details.
     * @param [options.xAxis] - Overrides for the x-axis. See {@link AxisOptions} for more details.
     * @param [options.yAxis] - Overrides for the y-axis. See {@link AxisOptions} for more details.
     * @returns Rendered chart
     */
    function scatter(options: {
        data: any[];
        title?: string;
        description?: string;
        map?: MapOptions;
        xAxis?: AxisOptions;
        yAxis?: AxisOptions;
    }): string;
}

/**
 * To render a chart, the data you supply is mapped to various
 * properties. `MapOptions` provides a flexible way to define how these
 * properties, like `value`, `label` and `color`, will be selected.
 *
 * Each option can be declared as a function. The function is passed the
 * original datum and indices that correspond to how deeply the datum is nested.
 *
 * However, it's often useful to use a shorthand syntax instead. If the
 * property is an array, the array item at the index corresponding to the
 * value's index is used. If the property is a string or number, that value is
 * used for all items in the data.
 *
 * For example, both of these declarations will return `"black"` for the first
 * item in the data and `"white"` for the second item.
 *
 * ```javascript
 * {
 *   color: function(d, i) { return ["black", "white"][i] },
 *   color: ["black", "white"]
 * }
 * ```
 * @property [value] - Parse the raw value from the supplied data. This function is useful if your
 * data structure wraps each value in an object.
 * The default function returns the value unchanged.
 * @property [x] - Parse the x-axis value from the data. This function is useful if your
 * data structure wraps each value in an object.
 * The default function returns the _index_ of the item.
 * **Line and Scatter Chart only**
 * @property [y] - Parse the y-axis value from the data. This function is useful if your
 * data structure wraps each value in an object.
 * The default function returns the _value_ of the item.
 * **Line and Scatter Chart only**
 * @property [r] - Parse the radial size from the data. This function is useful if you want to
 * visualise another dimension in the data. If the radius is not greater
 * than zero, the item isn't be rendered.
 * The default function returns a radial size of 1.
 * **Scatter Chart only**
 * @property [label] - Convert the data into a formatted string.
 * The default function returns the value fixed to the same number of decimals
 * as the most precise value in the dataset. Return `false` to prevent this
 * label from being rendered.
 * @property [tally] - Add an additional label summing the total values into a formatted string.
 * If true, the default function returns the value fixed to the same number of
 * decimals as the most precise value in the dataset. Return `false` to prevent
 * the tally from being rendered. When only a single series is present, the bar
 * chart defaults to using a tally rather than a label.
 * **Bar Chart only**
 * @property [color] - Select a color for the supplied data.
 * The default function returns evenly distributed colors from the default
 * palette. Return an array of two colors to change the color of the label.
 * @property [shape] - Select a shape for the supplied data.
 * Supported shapes include `circle | square | triangle | diamond | cross | asterisk`.
 * @property [curve] - Select a curve for the current line. Lines can include multiple curve types.
 * Supported curves include `linear | stepX | stepY | stepXMid | stepYMid |
 * monotone | bump`.
 * @property [width] - Change the size of the object. Return values should fall between 0 and 1.
 * @property [key] - Select the legend key for the supplied data. A legend is only rendered when
 * there is more than one unique key.
 * @property [series] - Select the series key for the supplied data.
 * @property [attrs] - Set attributes on the DOM element that corresponds to a data point. This
 * function is useful if you want to override or add arbitrary attributes on the
 * chart.
 */
declare type MapOptions = {
    value?: ((...params: any[]) => any) | number[] | number;
    x?: ((...params: any[]) => any) | number[] | number;
    y?: ((...params: any[]) => any) | number[] | number;
    r?: ((...params: any[]) => any) | number[] | number;
    label?: ((...params: any[]) => any) | string[] | string;
    tally?: ((...params: any[]) => any) | string[] | string | true;
    color?: ((...params: any[]) => any) | string[] | string;
    shape?: ((...params: any[]) => any) | string[] | string;
    curve?: ((...params: any[]) => any) | string[] | string;
    width?: ((...params: any[]) => any) | number[] | number;
    key?: ((...params: any[]) => any) | string[] | string;
    series?: ((...params: any[]) => any) | string[] | string;
    attrs?: ((...params: any[]) => any) | object[] | any;
};

/**
 * For charts that feature an x- or y-axis, `shown` will automatically try to
 * guess the best way to display the axis based on the chart data. When you
 * need to, use axis options to override the way an axis is displayed. Any
 * settings you provide will always override the defaults.
 * @property [min] - The minimum value for this axis.
 * The default value is derived from `data`.
 * @property [max] - The maximum value for this axis.
 * The default value is derived from `data`.
 * @property [ticks] - The number of divisions to use for
 * this axis. The default value is a derived number between 2 and 13 that best
 * splits the difference between `min` and `max`.
 * @property [label] - A function to map an axis
 * value to a label. The function is passed the current value, index and axis as
 * arguments. When supplying an array, the item at the corresponding index will
 * be selected
 * @property [line] - A function to toggle an axis
 * line. The function is passed the current value, index and axis as
 * arguments. When supplying an array, the item at the corresponding index will
 * be selected
 * @property [inset = 0] - The amount to inset the first and last tick
 * from the sides of the axis. The value is relative to the width of the chart
 * and should fall between 0 and 1.
 * @property [spine = true] - Whether to render lines at the extreme
 * ends of the axis. This value is only used with a non-zero inset.
 */
declare type AxisOptions = {
    min?: number;
    max?: number;
    ticks?: number;
    label?: ((...params: any[]) => any) | any[];
    line?: ((...params: any[]) => any) | any[];
    inset?: number;
    spine?: boolean;
};

/**
 * Charts render a {@link #legend|Legend} when needed, passing their internally
 * mapped data. When supplying data for a standalone legend, each item should
 * define these properties.
 * @property key - Select the legend key for this item. A legend is
 * only rendered when there is more than one unique key.
 * @property color - Select a color for this item. When an
 * array is passed, the first item in the array is used.
 * @property [shape] - Select a shape for the legend item. Supported
 * shapes include `circle | square | triangle | diamond | cross | asterisk`.
 */
declare type LegendItem = {
    key: string;
    color: string | string[];
    shape?: string;
};

