import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, addDoc, onSnapshot } from "firebase/firestore";

const App = () => {
  const [song, setSong] = useState("");
  const [artist, setArtist] = useState("");
  const [favoriteSong, setFavoriteSong] = useState("");
  const [songs, setSongs] = useState([]);

  const songsCollectionRef = collection(db, "songs");

  useEffect(() => {
    const unsubscribe = onSnapshot(songsCollectionRef, (snapshot) => {
      const songsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSongs(songsData);
    });

    return () => unsubscribe();
  }, [songsCollectionRef]);

  const addSong = async (e) => {
    e.preventDefault();
    if (song && artist) {
      await addDoc(songsCollectionRef, { song, artist });
      setSong("");
      setArtist("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-8 text-white">My Music Library</h1>

          <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-xl p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-white">Your Favorite Song</h2>
            <input
              type="text"
              placeholder="Enter your all-time favorite song"
              value={favoriteSong}
              onChange={(e) => setFavoriteSong(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none mb-4 text-white"
            />
          </div>

          <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-xl p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-white">Add New Song</h2>
            <form onSubmit={addSong} className="space-y-4">
              <input
                type="text"
                placeholder="Song Name"
                value={song}
                onChange={(e) => setSong(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none text-white"
              />
              <input
                type="text"
                placeholder="Artist Name"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none text-white"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200"
              >
                Add Song
              </button>
            </form>
          </div>

          <div className="w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-white">Your Song Collection</h2>
            <div className="space-y-3">
              {songs.map(({ id, song, artist }) => (
                <div
                  key={id}
                  className="p-4 bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-white">{song}</h3>
                      <p className="text-gray-400 text-sm">{artist}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;