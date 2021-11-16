/**
 * We give up using stylelint-prettier. Because stylelint-prettier just runs Prettier.
 * And Prettier always lowercasing units. It will transfer 'PX' to 'px', then px2rem will be down.
 * https://github.com/stylelint/stylelint/issues/4048
 * Comparing star number of eslint-plugin-prettier and styleling-prettier, stylelint-prettier is not valued.
 */
module.exports = {
  "extends": [
    "stylelint-config-standard",
    "stylelint-config-rational-order"
  ],
  "rules": {
    "order/properties-order": [],
    "at-rule-no-unknown": null,
    "number-leading-zero": null,
    "function-calc-no-invalid": null,
    "no-descending-specificity": null,
    "declaration-colon-newline-after": null,
    "font-family-no-missing-generic-family-keyword": null,
    "value-keyword-case": null,
    "unit-case": null
  }
}
