import { useState } from 'react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import './App.css' // We might not need this if we put everything in index.css, but standard Vite has it.

function App() {
  const [topic, setTopic] = useState('')
  const [script, setScript] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    setLoading(true);
    setError(null);
    setScript('');

    try {
      const response = await axios.post('/api/generate', {
        topic: topic
      });
      setScript(response.data.script);
    } catch (err) {
      console.error(err);
      setError('Failed to generate script. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>🎙️ Podcast AI Agent</h1>

      <div className="input-group">
        <label className="input-label" htmlFor="topic">
          What should today's episode be about?
        </label>
        <input
          id="topic"
          type="text"
          className="topic-input"
          placeholder="e.g. The Future of AI in Education, Vegan Travel in Japan..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
        />
        <button
          className="generate-btn"
          onClick={handleGenerate}
          disabled={loading || !topic.trim()}
        >
          {loading ? 'Thinking & Researching...' : 'Generate Script'}
        </button>
      </div>

      {error && <div style={{ color: '#ef4444', textAlign: 'center' }}>{error}</div>}

      {script && (
        <div className="result-area">
          <div className="markdown-content">
            <ReactMarkdown>{script}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
