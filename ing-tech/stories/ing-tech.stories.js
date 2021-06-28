import { html } from 'lit-html';
import '../src/ing-tech.js';

export default {
  title: 'IngTech',
  component: 'ing-tech',
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

function Template({ title, backgroundColor }) {
  return html`
    <ing-tech
      style="--ing-tech-background-color: ${backgroundColor || 'white'}"
      .title=${title}
    >
    </ing-tech>
  `;
}

export const App = Template.bind({});
App.args = {
  title: 'My app',
};
