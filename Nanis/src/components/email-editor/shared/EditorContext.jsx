import { createContext, useContext, useState, useCallback } from 'react';
import { EMPTY_EMAIL_TEMPLATE } from './editorConfig';

const EditorContext = createContext(null);

export function EditorProvider({ children, initialDocument = EMPTY_EMAIL_TEMPLATE }) {
  const [document, setDocument] = useState(initialDocument);
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [selectedTab, setSelectedTab] = useState('editor'); // editor, preview, html, json
  const [screenSize, setScreenSize] = useState('desktop'); // desktop, mobile
  const [inspectorOpen, setInspectorOpen] = useState(true);
  const [samplesOpen, setSamplesOpen] = useState(false);
  const [history, setHistory] = useState([initialDocument]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const updateDocument = useCallback((updates) => {
    setDocument((prev) => {
      const newDoc = { ...prev, ...updates };
      // Add to history
      setHistory((h) => [...h.slice(0, historyIndex + 1), newDoc]);
      setHistoryIndex((i) => i + 1);
      return newDoc;
    });
  }, [historyIndex]);

  const resetDocument = useCallback((newDoc) => {
    setDocument(newDoc);
    setHistory([newDoc]);
    setHistoryIndex(0);
    setSelectedBlockId(null);
  }, []);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex((i) => i - 1);
      setDocument(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((i) => i + 1);
      setDocument(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  const value = {
    document,
    setDocument:  updateDocument,
    resetDocument,
    selectedBlockId,
    setSelectedBlockId,
    selectedTab,
    setSelectedTab,
    screenSize,
    setScreenSize,
    inspectorOpen,
    setInspectorOpen,
    samplesOpen,
    setSamplesOpen,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
  };

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within EditorProvider');
  }
  return context;
}

export function useDocument() {
  const { document } = useEditor();
  return document;
}

export function useSelectedBlockId() {
  const { selectedBlockId } = useEditor();
  return selectedBlockId;
}