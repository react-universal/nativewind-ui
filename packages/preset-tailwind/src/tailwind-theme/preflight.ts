/**
 * @module @twind/preset-tailwind/preflight
 */
import type { Preflight } from '@native-twin/css';
import { fontFamily } from './font.js';

export const preflight: Preflight = {
  '*,::before,::after ': {
    '--tw-translate-x': '0',
    '--tw-translate-y': '0',
    '--tw-rotate': '0',
    '--tw-skew-x': '0',
    '--tw-skew-y': '0',
    '--tw-scale-x': '1',
    '--tw-scale-y': '1',
    '--tw-transform': `translateX(var(--tw-translate-x))
    translateY(var(--tw-translate-y)) rotate(var(--tw-rotate))
    skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
    scaleY(var(--tw-scale-y))`,
  },
  '::backdrop': {
    '--tw-translate-x': '0',
    '--tw-translate-y': '0',
    '--tw-rotate': '0',
    '--tw-skew-x': '0',
    '--tw-skew-y': '0',
    '--tw-scale-x': '1',
    '--tw-scale-y': '1',
    '--tw-transform': `translateX(var(--tw-translate-x))
    translateY(var(--tw-translate-y)) rotate(var(--tw-rotate))
    skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
    scaleY(var(--tw-scale-y))`,
  },
  /*
    1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)
    2. Allow adding a border to an element by just adding a border-width. (https://github.com/tailwindcss/tailwindcss/pull/116)
    */
  '*,::before,::after': {
    boxSizing: 'border-box' /* 1 */,
    borderWidth: '0' /* 2 */,
    borderStyle: 'solid' /* 2 */,
    borderColor: 'currentColor' /* 2 */,
  },

  '::before,::after': { '--tw-content': "''" },

  /*
    1. Use a consistent sensible line-height in all browsers.
    2. Prevent adjustments of font size after orientation changes in iOS.
    3. Use a more readable tab size.
    4. Use the user's configured `sans` font-family by default.
    5. Use the user's configured `sans` font-feature-settings by default.
    */
  html: {
    lineHeight: 1.5 /* 1 */,
    WebkitTextSizeAdjust: '100%' /* 2 */,
    MozTabSize: '4' /* 3 */,
    tabSize: 4 /* 3 */,
    // fontFamily: `theme(fontFamily.sans, ${
    //   (baseTheme.fontFamily as Record<string, string>).sans
    // })` /* 4 */,
    // fontFeatureSettings: 'theme(fontFamily.sans[1].fontFeatureSettings, normal)' /* 5 */,
  },

  /*
    1. Remove the margin in all browsers.
    2. Inherit line-height from `html` so users can set them as a class directly on the `html` element.
    */
  body: { margin: '0' /* 1 */, lineHeight: 'inherit' /* 2 */ },

  /*
    1. Add the correct height in Firefox.
    2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)
    3. Ensure horizontal rules are visible by default.
    */
  hr: { height: '0' /* 1 */, color: 'inherit', /* 2 */ borderTopWidth: '1px' /* 3 */ },

  /*
    Add the correct text decoration in Chrome, Edge, and Safari.
    */
  'abbr:where([title])': { textDecoration: 'underline dotted' },

  /*
    Remove the default font size and weight for headings.
    */
  'h1,h2,h3,h4,h5,h6': { fontSize: 'inherit', fontWeight: 'inherit' },

  /*
    Reset links to optimize for opt-in styling instead of opt-out.
    */
  a: { color: 'inherit', textDecoration: 'inherit' },

  /*
    Add the correct font weight in Edge and Safari.
    */
  'b,strong': { fontWeight: 'bolder' },

  /*
    1. Use the user's configured `mono` font family by default.
    2. Use the user's configured `mono` font-feature-settings by default.
    3. Correct the odd `em` font sizing in all browsers.
    */
  'code,kbd,samp,pre': {
    // fontFamily: `theme(fontFamily.mono, ${
    //   (baseTheme.fontFamily as Record<string, string>).mono
    // })`,
    fontFeatureSettings: fontFamily.mono,
    fontSize: '1em',
  },

  /*
    Add the correct font size in all browsers.
    */
  small: { fontSize: '80%' },

  /*
    Prevent `sub` and `sup` elements from affecting the line height in all browsers.
    */
  'sub,sup': {
    fontSize: '75%',
    lineHeight: 0,
    position: 'relative',
    verticalAlign: 'baseline',
  },
  sub: { bottom: '-0.25em' },
  sup: { top: '-0.5em' },

  /*
    1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)
    2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)
    3. Remove gaps between table borders by default.
    */
  table: {
    textIndent: '0' /* 1 */,
    borderColor: 'inherit' /* 2 */,
    borderCollapse: 'collapse' /* 3 */,
  },

  /*
    1. Change the font styles in all browsers.
    2. Remove the margin in Firefox and Safari.
    3. Remove default padding in all browsers.
    */
  'button,input,optgroup,select,textarea': {
    fontFamily: 'inherit' /* 1 */,
    fontSize: '100%' /* 1 */,
    lineHeight: 'inherit' /* 1 */,
    color: 'inherit' /* 1 */,
    margin: '0' /* 2 */,
    padding: '0' /* 3 */,
  },

  /*
    Remove the inheritance of text transform in Edge and Firefox.
    */
  'button,select': { textTransform: 'none' },

  /*
    1. Correct the inability to style clickable types in iOS and Safari.
    2. Remove default button styles.
    */
  "button,[type='button'],[type='reset'],[type='submit']": {
    WebkitAppearance: 'button' /* 1 */,
    backgroundColor: 'transparent' /* 2 */,
    backgroundImage: 'none' /* 4 */,
  },

  /*
    Use the modern Firefox focus style for all focusable elements.
    */
  ':-moz-focusring': { outline: 'auto' },

  /*
    Remove the additional `:invalid` styles in Firefox. (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)
    */
  ':-moz-ui-invalid': { boxShadow: 'none' },

  /*
    Add the correct vertical alignment in Chrome and Firefox.
    */
  progress: { verticalAlign: 'baseline' },

  /*
    Correct the cursor style of increment and decrement buttons in Safari.
    */
  '::-webkit-inner-spin-button,::-webkit-outer-spin-button': {
    height: 'auto',
  },

  /*
    1. Correct the odd appearance in Chrome and Safari.
    2. Correct the outline style in Safari.
    */
  "[type='search']": {
    WebkitAppearance: 'textfield' /* 1 */,
    outlineOffset: '-2px' /* 2 */,
  },

  /*
    Remove the inner padding in Chrome and Safari on macOS.
    */
  '::-webkit-search-decoration': { WebkitAppearance: 'none' },

  /*
    1. Correct the inability to style clickable types in iOS and Safari.
    2. Change font properties to `inherit` in Safari.
    */
  '::-webkit-file-upload-button': {
    WebkitAppearance: 'button' /* 1 */,
    font: 'inherit' /* 2 */,
  },

  /*
    Add the correct display in Chrome and Safari.
    */
  summary: { display: 'list-item' },

  /*
    Removes the default spacing and border for appropriate elements.
    */
  'blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre': {
    margin: '0',
  },
  fieldset: { margin: '0', padding: '0' },
  legend: { padding: '0' },
  'ol,ul,menu': { listStyle: 'none', margin: '0', padding: '0' },

  /*
    Prevent resizing textareas horizontally by default.
    */
  textarea: { resize: 'vertical' },

  /*
    1. Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)
    2. Set the default placeholder color to the user's configured gray 400 color.
    */
  'input::placeholder,textarea::placeholder': {
    opacity: 1 /* 1 */,
    color: '#9ca3af' /* 2 */,
  },

  /*
    Set the default cursor for buttons.
    */
  'button,[role="button"]': { cursor: 'pointer' },

  /*
    Make sure disabled buttons don't get the pointer cursor.
    */
  ':disabled': { cursor: 'default' },

  /*
    1. Make replaced elements `display: block` by default. (https://github.com/mozdevs/cssremedy/issues/14)
    2. Add `vertical-align: middle` to align replaced elements more sensibly by default. (https://github.com/jensimmons/cssremedy/issues/14#issuecomment-634934210)
      This can trigger a poorly considered lint error in some tools but is included by design.
    */
  'img,svg,video,canvas,audio,iframe,embed,object': {
    display: 'block' /* 1 */,
    verticalAlign: 'middle' /* 2 */,
  },

  /*
    Constrain images and videos to the parent width and preserve their intrinsic aspect ratio. (https://github.com/mozdevs/cssremedy/issues/14)
    */
  'img,video': { maxWidth: '100%', height: 'auto' },

  /* Make elements with the HTML hidden attribute stay hidden by default */
  '[hidden]': { display: 'none' },
};
