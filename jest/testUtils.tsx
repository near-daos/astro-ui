import {
  RenderResult,
  render as reactTestingLibRender,
} from '@testing-library/react';
import { ReactNode } from 'react';
import { NextRouter } from 'next/router';
import { RouterContext } from 'next/dist/shared/lib/router-context';

function createMockRouter(router?: Partial<NextRouter>): NextRouter {
  return {
    basePath: '',
    pathname: '/',
    route: '/',
    query: {},
    asPath: '/',
    back: jest.fn(),
    beforePopState: jest.fn(),
    prefetch: jest.fn(),
    push: jest.fn(),
    reload: jest.fn(),
    replace: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
    isFallback: false,
    isLocaleDomain: false,
    isReady: true,
    defaultLocale: 'en',
    domainLocales: [],
    isPreview: false,
    ...router,
  };
}

export function render(
  component: ReactNode,
  router?: Partial<NextRouter>
): RenderResult {
  return reactTestingLibRender(
    <RouterContext.Provider value={createMockRouter(router)}>
      {component}
    </RouterContext.Provider>
  );
}
