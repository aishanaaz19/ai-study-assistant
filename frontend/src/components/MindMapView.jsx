import React, { useState, useEffect, useRef } from 'react';
import ReactFlow, { MiniMap, Controls, Background } from 'reactflow';
import 'reactflow/dist/style.css';
import { Brain, Zap, Download } from 'lucide-react';
import axios from 'axios';
import { toPng } from 'html-to-image';

// Strict radial layout: center, branches, fanned subtopics only
const getRadialMindMapNodes = (nodes, edges) => {
  const center = { x: 600, y: 400 };
  const rMain = 480; // Spacer radius for more distance
  const rSub = 200;  // Spacer radius for subtopics

  const nodeStyle = {
    background: "#e0e7ff",            // soft blue
    border: "2px solid #6366f1",      // indigo border for contrast
    color: "#1e293b",                 // dark text
    borderRadius: 10,
    fontWeight: 500,
    fontSize: 16,
    padding: 10,
    minWidth: 120,
    boxShadow: "0 2px 8px rgba(99,102,241,0.09)"
  };

  const out = [];
  const centerNode = nodes.find(n => n.type === "center");
  if (centerNode) {
    out.push({
      ...centerNode,
      position: center,
      data: { label: centerNode.label },
      style: { ...nodeStyle, background: "#fff", border: "2px solid #6366f1", fontWeight: 700 }
    });
  }

  const mainNodes = nodes.filter(n => n.type === "main");
  mainNodes.forEach((m, i) => {
    const ang = (2 * Math.PI * i) / mainNodes.length;
    const mainPos = {
      x: center.x + rMain * Math.cos(ang),
      y: center.y + rMain * Math.sin(ang)
    };
    out.push({
      ...m,
      position: mainPos,
      data: { label: m.label },
      style: nodeStyle
    });

    const subEdges = edges.filter(e => e.from === m.id);
    const subNodes = nodes.filter(n => subEdges.some(e => e.to === n.id) && n.type === "sub");
    subNodes.forEach((sub, j) => {
      const subAngle = ang + ((j - (subNodes.length-1)/2) * (Math.PI/8));
      const subPos = {
        x: mainPos.x + rSub * Math.cos(subAngle),
        y: mainPos.y + rSub * Math.sin(subAngle)
      };
      out.push({
        ...sub,
        position: subPos,
        data: { label: sub.label },
        style: { ...nodeStyle, background: "#f9fafb", border: "2px solid #a5b4fc" }
      });
    });
  });

  nodes.forEach(n => {
    if (!out.find(o => o.id === n.id)) {
      out.push({
        ...n,
        position: { x: 0, y: 0 },
        data: { label: n.label },
        style: { ...nodeStyle, background: "#fff", border: "2px solid #94a3b8" }
      });
    }
  });

  return out;
};


const MindMapView = ({ pdfState, showMessage }) => {
  const [mindMapData, setMindMapData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const flowWrapperRef = useRef(null);

  useEffect(() => {
    setMindMapData(null);
    setError('');
    setLoading(false);
  }, [pdfState.file]);

  const generateMindMap = async () => {
    if (!pdfState?.file) {
      showMessage && showMessage('❌ Please upload a PDF file first.', 'error');
      return;
    }
    setLoading(true);
    setError('');
    setMindMapData(null);

    const formData = new FormData();
    formData.append('pdfFile', pdfState.file);

    try {
      const response = await axios.post(
        'http://localhost:3000/api/generate-mindmap',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (response.data.nodes && response.data.edges) {
        setMindMapData(response.data);
        showMessage && showMessage('✅ Mind map generated successfully!', 'success');
      } else {
        setError('No mind map could be generated from this document.');
        showMessage && showMessage('❌ No mind map generated.', 'error');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message;
      setError('Failed to generate mind map: ' + errorMessage);
      showMessage && showMessage('❌ Failed to generate mind map.', 'error');
    } finally {
      setLoading(false);
    }
  };

  let nodes = [];
  let edges = [];
  if (mindMapData && Array.isArray(mindMapData.nodes) && Array.isArray(mindMapData.edges)) {
    edges = mindMapData.edges.map(e => ({
      id: `${e.from}-${e.to}`,
      source: e.from,
      target: e.to,
      animated: true,
      label: e.label,
    }));

    // Strict radial layout for nodes
    nodes = getRadialMindMapNodes(mindMapData.nodes, mindMapData.edges);
  }

  const handleDownloadImage = async () => {
    if (flowWrapperRef.current) {
      try {
        const dataUrl = await toPng(flowWrapperRef.current);
        const link = document.createElement('a');
        link.download = `${pdfState.file?.name.replace('.pdf', '') || 'mindmap'}.png`;
        link.href = dataUrl;
        link.click();
      } catch (error) {
        showMessage && showMessage('❌ Failed to download image.', error);
      }
    }
  };

  return (
  <div className="rounded-2xl border border-white/10 dark:border-gray-200 overflow-hidden shadow-2xl dark:shadow-lg dark:bg-gray-900 bg-white">
    {/* Header */}
    <div className="px-6 py-4 border-b border-white/10 dark:border-gray-200 bg-gray-900 dark:bg-white">
      <h3 className="text-lg font-medium text-white dark:text-gray-900 flex items-center gap-2">
        <Brain className="w-5 h-5 text-purple-400 dark:text-purple-600" />
        Mind Map Generator
      </h3>
      <p className="text-gray-400 dark:text-gray-600 text-sm mt-1">
        Visualize interactive mind maps from your document and download them as images.
      </p>
    </div>

    <div className="p-6 bg-gray-950 dark:bg-white">
      {/* Generate Button Section */}
      {!mindMapData && (
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-purple-500/20 dark:bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-purple-400 dark:text-purple-600" />
          </div>
          {pdfState.file ? (
            <button
              onClick={generateMindMap}
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 disabled:hover:scale-100 shadow-lg flex items-center gap-2 mx-auto"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Generating Mind Map...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Generate Mind Map</span>
                </>
              )}
            </button>
          ) : (
            <p className="text-gray-400 dark:text-gray-600">
              Upload a PDF file to generate a mind map
            </p>
          )}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 dark:bg-red-50 border border-red-500/20 dark:border-red-300 text-red-200 dark:text-red-800 px-4 py-3 rounded-xl mb-6">
          {error}
        </div>
      )}

      {/* Mind Map Display & Download */}
      {mindMapData && nodes.length > 0 && (
  <div className="flex flex-col items-center">
    <div
      ref={flowWrapperRef}
      style={{
        width: "100%",
        height: "600px",
        maxWidth: "1100px",
        minWidth: "600px",
        minHeight: "400px",
        maxHeight: "700px",
        overflow: "auto", // Allow scroll if content overflows
        margin: "0 auto",
        background: "#fff",
        borderRadius: "1rem"
      }}
      className="bg-white rounded-2xl p-2 shadow border"
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        minZoom={0.3}
        maxZoom={2}
        fitView
        style={{ width: "100%", height: "100%", background: "#fff", borderRadius: "1rem" }}
      >
        <MiniMap />
        <Controls /> {/* Now works - allows pan/zoom/minimize */}
      </ReactFlow>
    </div>
    <button
      onClick={handleDownloadImage}
      className="bg-green-600 hover:bg-green-700 text-white rounded-xl py-2 px-4 shadow flex items-center gap-2 mt-4"
      title="Download mind map as image"
    >
      <Download className="w-5 h-5" />
      Download Image
    </button>
  </div>
)}


      {/* Placeholder */}
      {!mindMapData && !loading && pdfState.file && (
        <div className="text-gray-500 italic text-center">Mind map will appear here after generation.</div>
      )}
    </div>

    <style jsx>{`
      .animate-spin {
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

};

export default MindMapView;
