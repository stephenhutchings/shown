import line from "./line.js"

/**
 * Generate an area chart.
 * @alias module:shown.area
 * @param {Object} options - Data and display options for the chart. Area charts
 * are a wrapper for line charts, with the default options for `sorted` and
 * `area` set to true.
 * @param {any[]} options.data - The data for this chart. Data can
 * be passed either as a flat array for a single line, or nested arrays
 * for multiple lines.
 * @param {string} [options.title] - The title for this chart, set to the
 * `<title>` element for better accessibility.
 * @param {string} [options.description] - The description for this chart, set
 * to the `<desc>` element for better accessibility.
 * @param {MapOptions} [options.map]
 * Controls for transforming data. See {@link MapOptions} for more details.
 * @param {AxisOptions} [options.xAxis]
 * Overrides for the x-axis. See {@link AxisOptions} for more details.
 * @param {AxisOptions} [options.yAxis]
 * Overrides for the y-axis. See {@link AxisOptions} for more details.
 * @param {boolean} [options.sorted] - Whether to sort the values.
 * @returns {string} Rendered chart
 *
 * @example
 * shown.area({
 *   title: "Stacked area chart",
 *   data: [
 *      [52.86, 20.65, 14.54, 10.09,  8.41],
 *      [21.97, 31.71,  6.31, 17.85, 23.53],
 *      [ 6.73, 10.84, 37.62, 45.79, 53.32],
 *      [38.44, 50.79, 22.31, 31.82,  7.64],
 *   ],
 *   map: {
 *     curve: "monotone",
 *     key: ["α", "β", "γ", "δ"],
 *   },
 *   sorted: true,
 * })
 *
 * @example
 * shown.area({
 *   title: "Discontinuous data is interpolated",
 *   data: [
 *     [ 12.2, 19.2, 35.9, 88.1, 12.8, 48.2,      ],
 *     [ 25.7, 10.1, 48.5, 84.4, 39.6,            ],
 *     [ 11.0, 43.5, 68.4, 79.6, null, null, 35.4 ],
 *     [ 20.3, null, 17.5, 71.6, 67.1, 64.1, 25.4 ],
 *   ],
 *   map: {
 *     key: ["A", "B", "C", "D"],
 *   },
 * })
 */

export default ({ data, title, description, map, xAxis, yAxis, sorted }) => {
  return line({
    data,
    title,
    description,
    map,
    xAxis,
    yAxis,
    sorted,
    showGaps: true,
    area: true,
  })
}
