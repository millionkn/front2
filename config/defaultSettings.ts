import { Settings as ProSettings } from '@ant-design/pro-layout';

type DefaultSettings = Partial<ProSettings> & {
  pwa: boolean;
};

const proSettings: DefaultSettings = {
  "navTheme": "light",
  "primaryColor": "#1890ff",
  "layout": "top",
  "contentWidth": "Fluid",
  "fixedHeader": true,
  "fixSiderbar": true,
  "title": "和平区老旧小区更新改造工程嫩江路片区项目",
  "pwa": false,
  "iconfontUrl": "",
  "splitMenus": false,
  "footerRender": false,
  "menuRender": false
};

export type { DefaultSettings };

export default proSettings;
