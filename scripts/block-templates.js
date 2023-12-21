import { createOptimizedPicture } from './aem.js';

const NAMES = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

export async function runBlockTemplate(block, blockName, template) {
  const getRowsAndColumns = (blockEl) => {
    const rows = [];
    const rowsEl = [...blockEl.children];
    rowsEl.forEach((row, i) => {
      const r = {};
      const cols = [...row.children];
      cols.forEach((col, j) => {
        if (col.children.length === 1) {
          r[NAMES[j]] = col.children[0];
        } else {
          r[NAMES[j]] = [...col.children];
        }
      });
      rows.push(r);
    });
    return { rows };
  };

  const context = getRowsAndColumns(block);

  console.log(context);

  Handlebars.registerHelper('col', (num) => {
    if (Array.isArray(num)) {
      return num.map((el) => {
        return el.outerHTML ? new Handlebars.SafeString(el.outerHTML) : el;
      }).join('');
    }
    return num.outerHTML ? new Handlebars.SafeString(num.outerHTML) : num;
  });

  const tpl = Handlebars.compile(template);

  const dom = tpl(context);
  block.innerHTML = dom;
}

// eslint-disable-next-line import/prefer-default-export
export async function applyBlockTemplate(block, template) {
  const { blockName } = block.dataset;

  runBlockTemplate(block, blockName, template);

}
