import React from 'react';
import { HashRouter as Router } from 'react-router-dom';

import { shallow, mount } from 'enzyme';
import App from '../src/App';
import api from '../src/api';
import { API_LOGOUT } from '../src/endpoints';

import Dashboard from '../src/pages/Dashboard';
import { asyncFlush } from '../jest.setup';

const DEFAULT_ACTIVE_GROUP = 'views_group';
const DEFAULT_ACTIVE_ITEM = 'views_group_dashboard';

const routeGroups = [{
  groupId: DEFAULT_ACTIVE_GROUP,
  title: 'test',
  routes: [{ path: '/home', title: 'Dashboard', component:  Dashboard }],
}];

describe('<App />', () => {
  test('renders without crashing', () => {
    const appWrapper = shallow(<App />);
    expect(appWrapper.length).toBe(1);
  });

  test('onNavToggle sets state.isNavOpen to opposite', () => {
    const appWrapper = shallow(<App />);
    expect(appWrapper.state().isNavOpen).toBe(true);
    appWrapper.instance().onNavToggle();
    expect(appWrapper.state().isNavOpen).toBe(false);
  });

  test('onLogoClick sets selected nav back to defaults', () => {
    const appWrapper = shallow(<App />);
    appWrapper.setState({ activeGroup: 'foo', activeItem: 'bar' });
    expect(appWrapper.state().activeItem).toBe('bar');
    expect(appWrapper.state().activeGroup).toBe('foo');
    appWrapper.instance().onLogoClick();
    expect(appWrapper.state().activeGroup).toBe(DEFAULT_ACTIVE_GROUP);
  });

  test('api.logout called from logout button', async () => {
    api.get = jest.fn().mockImplementation(() => Promise.resolve({}));
    const appWrapper = shallow(<App />);
    appWrapper.instance().onDevLogout();
    appWrapper.setState({ activeGroup: 'foo', activeItem: 'bar' });
    expect(api.get).toHaveBeenCalledTimes(1);
    expect(api.get).toHaveBeenCalledWith(API_LOGOUT);
    await asyncFlush();
    expect(appWrapper.state().activeItem).toBe(DEFAULT_ACTIVE_ITEM);
    expect(appWrapper.state().activeGroup).toBe(DEFAULT_ACTIVE_GROUP);
  });

  test('Componenet makes REST call to API_CONFIG endpoint when mounted', () => {
    api.get = jest.fn().mockImplementation(() => Promise.resolve({}));
    const appWrapper = shallow(<App.WrappedComponent />);
    expect(api.get).toHaveBeenCalledTimes(1);
    expect(api.get).toHaveBeenCalledWith(API_CONFIG);
  });
});
