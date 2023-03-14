// prettier-ignore
const DEFAULT_COLORS = [
  "#0036b0", "#0236b1", "#0536b1", "#0737b2", "#0a37b2", "#0c37b3", "#0f37b3",
  "#1137b4", "#1437b4", "#1638b5", "#1938b5", "#1b38b6", "#1e38b6", "#2038b7",
  "#2338b7", "#2539b8", "#2839b8", "#2a39b9", "#2d39b9", "#2f39ba", "#323aba",
  "#343abb", "#373abb", "#393abc", "#3c3abc", "#3e3abd", "#413bbd", "#433bbe",
  "#463bbe", "#483bbf", "#4b3bbf", "#4d3bc0", "#503cc0", "#523cc1", "#553cc1",
  "#573cc2", "#5a3cc2", "#5c3dc3", "#5f3dc3", "#613dc4", "#643dc4", "#663dc5",
  "#693dc5", "#6b3ec6", "#6e3ec6", "#703ec7", "#733ec7", "#753ec8", "#783fc8",
  "#7a3fc9", "#7d3fc9", "#7f3fca", "#823fca", "#843fcb", "#8740cb", "#8940cc",
  "#8c40cc", "#8e40cd", "#9140cd", "#9340ce", "#9641ce", "#9841cf", "#9b41cf",
  "#9d41d0", "#a041d0", "#a242d1", "#a542d1", "#a742d2", "#aa42d2", "#ac42d3",
  "#af42d3", "#b143d4", "#b443d4", "#b643d5", "#b943d5", "#bb43d6", "#be43d6",
  "#c044d7", "#c344d7", "#c544d8", "#c844d9", "#cb44d9", "#ce44d9", "#d144d9",
  "#d444da", "#d844da", "#da44da", "#db44d7", "#db44d5", "#db44d2", "#db44cf",
  "#dc44cd", "#dc44ca", "#dc44c7", "#dc44c5", "#dd44c2", "#dd44bf", "#dd44bd",
  "#dd45ba", "#de45b7", "#de45b4", "#de45b2", "#df45af", "#df45ac", "#df45a9",
  "#df45a7", "#e045a4", "#e045a1", "#e0459e", "#e0459b", "#e14599", "#e14596",
  "#e14593", "#e14590", "#e2458d", "#e2458a", "#e24688", "#e24685", "#e34682",
  "#e3467f", "#e3467c", "#e34679", "#e44676", "#e44673", "#e44671", "#e54670",
  "#e5456e", "#e5456d", "#e6456c", "#e6446a", "#e74469", "#e74467", "#e84466",
  "#e84364", "#e84363", "#e94361", "#e94260", "#ea425e", "#ea425c", "#eb425b",
  "#eb4159", "#eb4158", "#ec4156", "#ec4154", "#ed4053", "#ed4051", "#ed404f",
  "#ee3f4e", "#ee3f4c", "#ef3f4a", "#ef3f49", "#ef3e47", "#f03e45", "#f03e44",
  "#f13e42", "#f13d40", "#f23d3e", "#f23d3d", "#f23e3d", "#f3403c", "#f3413c",
  "#f4423c", "#f4433b", "#f4453b", "#f5463b", "#f5473b", "#f6493a", "#f64a3a",
  "#f64b3a", "#f74d3a", "#f74e39", "#f85039", "#f85139", "#f85239", "#f95438",
  "#f95538", "#fa5738", "#fa5838", "#fa5a37", "#fb5b37", "#fb5d37", "#fc5e37",
  "#fc6036", "#fc6136", "#fd6336", "#fd6436", "#fe6635", "#fe6835", "#fe6934",
  "#fe6a34", "#fe6b33", "#fe6c32", "#fe6d31", "#fe6f30", "#fe7030", "#fe712f",
  "#fe722e", "#fe732d", "#fe752c", "#fe762b", "#fe772b", "#fe782a", "#fe7a29",
  "#fe7b28", "#fe7c27", "#fe7e27", "#fe7f26", "#fe8025", "#fe8224", "#fe8323",
  "#fe8423", "#fe8622", "#fe8721", "#fe8920", "#fe8a1f", "#fe8c1e", "#fe8d1e",
  "#fe8f1d", "#fe901c", "#fe921b", "#fe931a", "#fe951a", "#fe9619", "#fe9818",
  "#ff9a17", "#ff9b16", "#ff9d15", "#ff9e15", "#ffa014", "#ffa213", "#ffa312",
  "#ffa511", "#ffa711", "#ffa910", "#ffaa0f", "#ffac0e", "#ffae0d", "#ffb00c",
  "#ffb10c", "#ffb30b", "#ffb50a", "#ffb709", "#ffb908", "#ffbb08", "#ffbc07",
  "#ffbe06", "#ffc005", "#ffc204", "#ffc403", "#ffc603", "#ffc802", "#ffca01"
]

/**
 * @private
 * @typedef {string} BackgroundColor
 * @typedef {string|false} TextColor
 * @typedef {[BackgroundColor,TextColor]} ColorPair
 */

/**
 * Returns up to ~250 evenly spaced colors from the default color palette.
 * @private
 * @param {*} t Value between zero and one
 * @returns {string|ColorPair} color
 */
export const get = (t) => {
  if (!(t >= 0 && t <= 1)) t = 0

  const c = Math.floor(t * (DEFAULT_COLORS.length - 1))

  return t < 0.6 ? [DEFAULT_COLORS[c], "#fff"] : DEFAULT_COLORS[c]
}

/**
 * Wraps a function call, returning a pair of colors for the
 * background and optional contrasting text color.
 * @private
 * @param {Function} fn Base function
 * @returns {ColorPair} Colors
 */
export const wrap =
  (fn) =>
  (...args) => {
    const res = fn(...args)
    return Array.isArray(res) ? res : [res, false]
  }

export default get
