import { applyBlockTemplate } from '../../scripts/block-templates.js';

export default function decorate(block) {
  /* using config and template files */
  // applyBlockTemplate(block);

  /* inline config and template */
  applyBlockTemplate(block, {
    type: 'template',
    rowElement: 'li',
    columns: ['image', 'body'],
    images: 750,
  }, `
  <ul>
    <li>
        {{image}}
        {{body}}
    </li>
  </ul>
  `);
}
