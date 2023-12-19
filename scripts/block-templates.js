import { createOptimizedPicture } from './aem.js';

export async function runBlockTemplate(block, blockName, config, template) {
  const decorateRowsAndColumns = (blockEl, rows, columns) => {
    const rowsEl = [...blockEl.children];
    rowsEl.forEach((row, i) => {
      if (rows && rows[i]) row.className = `${blockName}-${rows[i]}`;
      const cols = [...row.children];
      cols.forEach((col, j) => {
        if (columns && columns[j]) col.className = `${blockName}-${columns[j]}`;
      });
    });
  };

  const applyTemplate = (row, rowTemplate) => {
    const matches = [...rowTemplate.matchAll(/{{\s*([a-zA-Z0-9_]+)\s*}}/g)];
    let currentPos = 0;
    const segments = [];
    matches.forEach((match) => {
      const rawMatch = match[0];
      const key = match[1].trim();
      const { index } = match;
      segments.push(rowTemplate.substring(currentPos, index));
      segments.push(row.querySelector(`.${blockName}-${key}`).outerHTML);
      currentPos = index + rawMatch.length;
    });
    segments.push(rowTemplate.substring(currentPos));
    const elem = document.createElement('div');
    elem.innerHTML = segments.join('');
    return elem.firstElementChild;
  };

  const decorateBlockImages = (blockEl, images) => {
    blockEl.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: images }])));
  };

  if (config.columns || config.rows) decorateRowsAndColumns(block, config.rows, config.columns);
  if (config.images) decorateBlockImages(block, config.images);
  if (config.type === 'template') {
    try {
      const dom = new DOMParser().parseFromString(template, 'text/html');
      if (config.rowElement) {
        const templateRowEl = dom.querySelector(config.rowElement);
        if (templateRowEl) {
          [...block.children].forEach((row) => {
            const appliedRow = applyTemplate(row, templateRowEl.outerHTML);
            templateRowEl.before(appliedRow);
          });
          templateRowEl.remove();
        }
        block.textContent = '';
        block.append(...dom.body.children);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('Template Error', error);
    }
  }
}

// eslint-disable-next-line import/prefer-default-export
export async function applyBlockTemplate(block, config, template) {
  const { blockName } = block.dataset;

  const fetchConfig = async () => {
    try {
      const resp = await fetch(`${window.hlx.codeBasePath}/blocks/${blockName}/${blockName}.config`);
      return await resp.json();
    } catch {
      // no config found
      return {};
    }
  };

  const fetchTemplate = async () => {
    try {
      const resp = await fetch(`${window.hlx.codeBasePath}/blocks/${blockName}/${blockName}.html`);
      const templateText = await resp.text();
      return templateText;
    } catch {
      // no template found
      return '';
    }
  };

  const configObject = config || await fetchConfig();
  const templateString = (configObject.type === 'template' && !template) ? await fetchTemplate() : template;
  runBlockTemplate(block, blockName, configObject, templateString);
}
