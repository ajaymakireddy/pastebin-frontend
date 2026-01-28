import React, { useState, useEffect } from "react";
import { Routes, Route, useParams } from "react-router-dom";

function CreatePaste() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [views, setViews] = useState("");
  const [url, setUrl] = useState("");

  async function submit() {
    const res = await fetch("https://pastebin-backend-jxma.onrender.com/api/pastes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content,
        ttl_seconds: ttl ? Number(ttl) : undefined,
        max_views: views ? Number(views) : undefined,
      }),
    });

    const data = await res.json();
    setUrl(data.url);
  }

  return (
    <div className="container">
      <h1>Pastebin Lite</h1>

      <textarea
        rows={8}
        placeholder="Enter your text here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="inputs">
        <input
          placeholder="TTL (seconds)"
          value={ttl}
          onChange={(e) => setTtl(e.target.value)}
        />
        <input
          placeholder="Max Views"
          value={views}
          onChange={(e) => setViews(e.target.value)}
        />
      </div>

      <button onClick={submit}>Create Paste</button>

      {url && (
        <div className="link-box">
          Share link: <br />
          <a href={url}>{url}</a>
        </div>
      )}
    </div>
  );
}

function ViewPaste() {
  const { id } = useParams();
  const [paste, setPaste] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`https://pastebin-backend-jxma.onrender.com/api/pastes/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(setPaste)
      .catch(() => setError("Paste not available"));
  }, [id]);

  if (error) return <div className="container error">{error}</div>;
  if (!paste) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <h1>Your Paste</h1>
      <pre>{paste.content}</pre>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<CreatePaste />} />
      <Route path="/p/:id" element={<ViewPaste />} />
    </Routes>
  );
}
