import { PluginCardProps } from 'astro_2.0/features/pages/plugins/PluginCard/PluginCard';
import { IWizardInitialData } from 'astro_2.0/features/pages/plugins/UsePluginPopup/types';

const generatePlugin = (tokenName: string, created: string) => ({
  tokenName,
  created,
  functionName: 'FunctionName',
});

const generatePlugins = () => {
  const plugins: PluginCardProps[] = [];
  const names = ['tkn', 'gatorade', 'farm'];

  for (let i = 1; i < 51; i += 1) {
    const month = `0${Math.floor((Math.random() * 100) % 8) + 1}`.slice(-2);
    const day = `0${Math.floor((Math.random() * 1000) % 28) + 1}`.slice(-2);
    const date = `2021-${month}-${day}`;
    const name = `${names[Math.floor((Math.random() * 100) % 3)]}.near`;
    const pluginsItem: PluginCardProps = generatePlugin(name, date);

    plugins.push(pluginsItem);
  }

  return plugins;
};

export const PLUGINS_DATA = generatePlugins();

export const PLUGIN_INITIAL_DATA: IWizardInitialData = {
  functions: [
    {
      id: '1',
      functionName: 'Token Farm: Create new token',
      code: '{"contract":"app.tokenfarm.near","method":"createToken","description":"Create a new token on token farm","args":[]}',
    },
  ],
};
