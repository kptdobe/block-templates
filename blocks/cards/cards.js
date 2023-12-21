import { applyBlockTemplate } from '../../scripts/block-templates.js';

export default function decorate(block) {
  /* using config and template files */
  // applyBlockTemplate(block);

  /* inline config and template */
  applyBlockTemplate(block, `<ul>
        {{#each rows}}
        <li>
            {{{col one}}}
            {{{col two}}}
        </li>
        {{/each}}
    </ul>
  `);
}