import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppLayout from './components/layout/AppLayout';
import Home from './pages/Home';
import Pieces from './pages/Pieces';
import NewCollection from './pages/NewCollection';
import CollectionDetail from './pages/CollectionDetail';
import DesignPiece from './pages/DesignPiece';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="pieces" element={<Pieces />} />
          <Route path="collections">
            <Route path="new" element={<NewCollection />} />
            <Route path=":collectionId" element={<CollectionDetail />} />
            <Route path=":collectionId/design/:pieceType" element={<DesignPiece />} />
          </Route>
        </Route>
      </Routes>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            borderRadius: '8px',
          },
        }}
      />
    </BrowserRouter>
  );
}

export default App;
