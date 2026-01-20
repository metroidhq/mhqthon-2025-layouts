import { Provider } from 'react-redux';
import { StrictMode } from 'react';
import { RouterProvider } from 'react-router-dom';
import { createRoot } from 'react-dom/client';

import { GlobalStyle } from '@components/GlobalStyle';
import { router } from '@src/routes';
import { store } from '@store';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

createRoot(document.querySelector('#root')!).render(
  <StrictMode>
    <Provider store={store}>
      <DndProvider backend={HTML5Backend}>
        <GlobalStyle />
        <RouterProvider router={router} />
      </DndProvider>
    </Provider>
  </StrictMode>,
);
