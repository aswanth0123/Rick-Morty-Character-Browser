'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCharacters, fetchCharacters } from '@/redux/features/charactersSlice';
import { RootState } from '@/redux/store';

export default function Home() {
  const dispatch = useDispatch();
  const characters = useSelector((state: RootState) => state.characters.items);
  const loading = useSelector((state: RootState) => state.characters.loading);
  const error = useSelector((state: RootState) => state.characters.error);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [page, setPage] = useState(1);
  const info = useSelector((state: RootState) => state.characters.info);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status]);

  useEffect(() => {
    dispatch(fetchCharacters({ name: debouncedSearch, status, page }) as any);
  }, [dispatch, debouncedSearch, status, page]);


  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Rick & Morty Characters</h1>
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="p-2 border rounded w-full max-w-xs"
        />
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="p-2 border rounded w-full max-w-xs bg-background"
        >
          <option value="">All Statuses</option>
          <option value="Alive">Alive</option>
          <option value="Dead">Dead</option>
          <option value="unknown">unknown</option>
        </select>
      </div>
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 rounded-lg shadow-md overflow-hidden flex flex-col items-center p-4 relative animate-pulse"
            >
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-gray-300 w-16 h-6 mb-2" />
              <div className="w-32 h-32 rounded-full bg-gray-300 border-4 border-gray-200 mb-4 mt-4" />
              <div className="h-5 w-24 bg-gray-300 rounded mb-2" />
              <div className="h-4 w-20 bg-gray-300 rounded" />
            </div>
          ))}
        </div>
      )}
      {error && <div className="text-red-500">Error: {error}</div>}
      {!loading && characters.length === 0 && (
        <div className="text-center text-gray-500 mt-8">No characters found.</div>
      )}

{/* Cards */}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {characters.map((char) => (
          <div
            key={char.id}
            className="bg-[#9e8a8a] rounded-lg shadow-md overflow-hidden flex flex-col items-center p-4 relative transform transition-transform duration-300 hover:scale-105 hover:shadow-xl"
          >
            <div
              className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white ${char.status === 'Alive' ? 'bg-green-500' : 'bg-red-500'}`}
            >
              {char.status}
            </div>
            <img
              src={char.image}
              alt={char.name}
              className="w-32 h-32 object-cover rounded-full border-4 border-gray-200 mb-4 mt-4"
            />
            <h2 className="text-lg font-semibold mb-1 text-center">{char.name}</h2>
            <div className="text-sm text-gray-600">Species: {char.species}</div>
          </div>
        ))}
      </div>

{/* pageination */}

      <div className="flex justify-center items-center mt-8 space-x-4">
        <button
          className="px-4 py-2 bg-[#311654] rounded disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={loading || !info || page === 1}
        >
          Previous
        </button>
        <span className="font-semibold">Page {page}{info && info.pages ? ` / ${info.pages}` : ''}</span>
        <button
          className="px-4 py-2 bg-[#311654] rounded disabled:opacity-50"
          onClick={() => setPage((p) => (info && info.pages ? Math.min(info.pages, p + 1) : p + 1))}
          disabled={loading || !info || (info && page === info.pages)}
        >
          Next
        </button>
      </div>
    </main>
  );
}
