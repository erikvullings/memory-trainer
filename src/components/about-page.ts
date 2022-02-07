import m from 'mithril';
import { render } from 'mithril-ui-form';
import { Dashboards } from '../models';
import { MeiosisComponent } from '../services';

const md = `#### Memory Trainer

Quickly learn new words or definitions. Enter a set of words and their meaning, and the app will challenge you. When you have finished a 'round', you can start all over again, or just continue with the ones you did wrong.

This application is a digital version of the one where you write a word on one side of a card, and its definition on the other side. You stack all cards, and the learning begins when you pick your first card. Next, you read the word and guess its definition, and verify it by flipping it over. If you guessed correctly, the card goes to the correct stack, otherwise to the incorrect stack of cards. When you are done, you pickup the incorrect stack of cards and start training yourself agian.

When you are done training in one direction (from word to definition), you can also reverse it and test yourself the other way (from definition to word).

Nothing is stored online, and all data is kept private locally, so you either need to download the results for later use, or use the PERMALINK option on the home page to copy a link to your clipboard, and send it to yourself. The link will also contain the data you entered, so you can also share your list of words and definitions with your friends.`;

export const AboutPage: MeiosisComponent = () => ({
  oninit: ({
    attrs: {
      actions: { setPage },
    },
  }) => setPage(Dashboards.ABOUT),
  view: () => {
    return [m('.row', m.trust(render(md)))];
  },
});
