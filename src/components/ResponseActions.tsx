'use client'

import { useState } from 'react'
import { Document, Paragraph, TextRun } from 'docx'
import GeminiTTS, { GEMINI_VOICES, EMOTION_STYLES } from './GeminiTTS'

interface ResponseActionsProps {
  content: string
  isMarkdown?: boolean
  isStreaming?: boolean
  className?: string
}

export default function ResponseActions({ 
  content, 
  isMarkdown = true, 
  isStreaming = false,
  className = ""
}: ResponseActionsProps) {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copying' | 'success' | 'error'>('idle')
  const [wordDownloadStatus, setWordDownloadStatus] = useState<'idle' | 'generating' | 'success' | 'error'>('idle')
  const [showGeminiSettings, setShowGeminiSettings] = useState(false)
  const [selectedGeminiVoice, setSelectedGeminiVoice] = useState(GEMINI_VOICES[3]) // Kore as default
  const [selectedGeminiEmotion, setSelectedGeminiEmotion] = useState(EMOTION_STYLES[0]) // Neutraal as default

  // Convert markdown to plain text for copying
  const convertMarkdownToPlainText = (markdown: string): string => {
    return markdown
      // Remove headers
      .replace(/^#{1,6}\s+/gm, '')
      // Remove bold/italic
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/__([^_]+)__/g, '$1')
      .replace(/_([^_]+)_/g, '$1')
      // Remove links but keep text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      // Remove code blocks
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`([^`]+)`/g, '$1')
      // Remove horizontal rules
      .replace(/^---+$/gm, '')
      // Remove list markers
      .replace(/^[\s]*[-*+]\s+/gm, '')
      .replace(/^[\s]*\d+\.\s+/gm, '')
      // Clean up extra whitespace
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .trim()
  }

  // Advanced markdown to Word document converter
  const convertMarkdownToWordDocument = (markdown: string): Document => {
    const lines = markdown.split('\n')
    const paragraphs: Paragraph[] = []
    let currentBulletList: string[] = []
    let currentNumberedList: Array<{number: string, text: string}> = []
    let isInCodeBlock = false
    let codeBlockContent = ''
    let codeBlockLanguage = ''
    let isInBlockquote = false
    let blockquoteContent: string[] = []

    // Flush different types of content
    const flushBulletList = () => {
      if (currentBulletList.length > 0) {
        currentBulletList.forEach(item => {
          const formattedRuns = parseInlineFormatting(item)
          paragraphs.push(new Paragraph({
            children: [new TextRun({ text: "• " }), ...formattedRuns],
            spacing: { after: 120 },
            indent: { left: 400 }
          }))
        })
        currentBulletList = []
      }
    }

    const flushNumberedList = () => {
      if (currentNumberedList.length > 0) {
        currentNumberedList.forEach(item => {
          const formattedRuns = parseInlineFormatting(item.text)
          paragraphs.push(new Paragraph({
            children: [new TextRun({ text: `${item.number}. ` }), ...formattedRuns],
            spacing: { after: 120 },
            indent: { left: 400 }
          }))
        })
        currentNumberedList = []
      }
    }

    const flushCodeBlock = () => {
      if (codeBlockContent) {
        // Add language label if specified
        if (codeBlockLanguage) {
          paragraphs.push(new Paragraph({
            children: [new TextRun({ 
              text: `[${codeBlockLanguage.toUpperCase()}]`,
              italics: true,
              size: 18,
              color: "666666"
            })],
            spacing: { after: 80 }
          }))
        }
        
        // Split code into lines for better formatting
        const codeLines = codeBlockContent.trim().split('\n')
        codeLines.forEach(codeLine => {
          paragraphs.push(new Paragraph({
            children: [new TextRun({ 
              text: codeLine || " ", // Empty line becomes space
              font: "Consolas",
              size: 20,
              color: "000080"
            })],
            spacing: { after: 40 },
            indent: { left: 400 },
            border: {
              left: { color: "CCCCCC", space: 1, style: "single", size: 6 }
            }
          }))
        })
        
        paragraphs.push(new Paragraph({
          children: [new TextRun({ text: "" })],
          spacing: { after: 200 }
        }))
        
        codeBlockContent = ''
        codeBlockLanguage = ''
      }
    }

    const flushBlockquote = () => {
      if (blockquoteContent.length > 0) {
        blockquoteContent.forEach(line => {
          const formattedRuns = parseInlineFormatting(line)
          paragraphs.push(new Paragraph({
            children: formattedRuns,
            spacing: { after: 120 },
            indent: { left: 600 },
            border: {
              left: { color: "4472C4", space: 1, style: "single", size: 12 }
            }
          }))
        })
        blockquoteContent = []
      }
    }

    // Parse inline formatting (bold, italic, code, links, strikethrough)
    const parseInlineFormatting = (text: string): TextRun[] => {
      const runs: TextRun[] = []
      
      // Enhanced regex to handle complex combinations
      const regex = /(\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*[^*]+\*|___[^_]+___|__[^_]+__|_[^_]+_|`[^`]+`|~~[^~]+~~|\[([^\]]+)\]\(([^)]+)\))/g
      
      let lastIndex = 0
      let match
      
      while ((match = regex.exec(text)) !== null) {
        // Add regular text before the match
        if (match.index > lastIndex) {
          const beforeText = text.slice(lastIndex, match.index)
          if (beforeText) {
            runs.push(new TextRun({ text: beforeText }))
          }
        }
        
        const matchedText = match[0]
        
        if (matchedText.startsWith('***') && matchedText.endsWith('***')) {
          // Bold + Italic
          runs.push(new TextRun({ 
            text: matchedText.slice(3, -3), 
            bold: true, 
            italics: true 
          }))
        } else if (matchedText.startsWith('**') && matchedText.endsWith('**')) {
          // Bold
          runs.push(new TextRun({ 
            text: matchedText.slice(2, -2), 
            bold: true 
          }))
        } else if (matchedText.startsWith('*') && matchedText.endsWith('*')) {
          // Italic
          runs.push(new TextRun({ 
            text: matchedText.slice(1, -1), 
            italics: true 
          }))
        } else if (matchedText.startsWith('___') && matchedText.endsWith('___')) {
          // Bold + Italic (alternative)
          runs.push(new TextRun({ 
            text: matchedText.slice(3, -3), 
            bold: true, 
            italics: true 
          }))
        } else if (matchedText.startsWith('__') && matchedText.endsWith('__')) {
          // Bold (alternative)
          runs.push(new TextRun({ 
            text: matchedText.slice(2, -2), 
            bold: true 
          }))
        } else if (matchedText.startsWith('_') && matchedText.endsWith('_')) {
          // Italic (alternative)
          runs.push(new TextRun({ 
            text: matchedText.slice(1, -1), 
            italics: true 
          }))
        } else if (matchedText.startsWith('`') && matchedText.endsWith('`')) {
          // Inline code
          runs.push(new TextRun({ 
            text: matchedText.slice(1, -1), 
            font: "Consolas",
            color: "DC143C",
            highlight: "yellow"
          }))
        } else if (matchedText.startsWith('~~') && matchedText.endsWith('~~')) {
          // Strikethrough
          runs.push(new TextRun({ 
            text: matchedText.slice(2, -2), 
            strike: true 
          }))
        } else if (matchedText.startsWith('[') && match[2] && match[3]) {
          // Links [text](url)
          runs.push(new TextRun({ 
            text: match[2],
            color: "0000EE",
            underline: {}
          }))
        }
        
        lastIndex = regex.lastIndex
      }
      
      // Add remaining text
      if (lastIndex < text.length) {
        const remainingText = text.slice(lastIndex)
        if (remainingText) {
          runs.push(new TextRun({ text: remainingText }))
        }
      }
      
      return runs.length > 0 ? runs : [new TextRun({ text: text })]
    }

    // Process each line
    lines.forEach((line, index) => {
      const trimmedLine = line.trim()
      const originalLine = line

      // Handle code blocks
      const codeBlockMatch = trimmedLine.match(/^```(\w+)?/)
      if (codeBlockMatch) {
        if (isInCodeBlock) {
          flushCodeBlock()
          isInCodeBlock = false
        } else {
          flushBulletList()
          flushNumberedList()
          flushBlockquote()
          isInCodeBlock = true
          codeBlockLanguage = codeBlockMatch[1] || ''
        }
        return
      }

      if (isInCodeBlock) {
        codeBlockContent += originalLine + '\n'
        return
      }

      // Handle blockquotes
      const blockquoteMatch = trimmedLine.match(/^>\s*(.*)$/)
      if (blockquoteMatch) {
        if (!isInBlockquote) {
          flushBulletList()
          flushNumberedList()
          isInBlockquote = true
        }
        blockquoteContent.push(blockquoteMatch[1])
        return
      } else if (isInBlockquote) {
        flushBlockquote()
        isInBlockquote = false
      }

      // Handle horizontal rules
      if (trimmedLine.match(/^(-{3,}|\*{3,}|_{3,})$/)) {
        flushBulletList()
        flushNumberedList()
        paragraphs.push(new Paragraph({
          children: [new TextRun({ text: "─────────────────────────────────" })],
          spacing: { after: 200, before: 200 },
          alignment: "center"
        }))
        return
      }

      // Handle headers
      const headerMatch = trimmedLine.match(/^(#{1,6})\s+(.+)$/)
      if (headerMatch) {
        flushBulletList()
        flushNumberedList()
        const level = headerMatch[1].length
        const headerText = headerMatch[2]
        const formattedRuns = parseInlineFormatting(headerText)

        paragraphs.push(new Paragraph({
          children: formattedRuns.map(run => new TextRun({
            ...run,
            bold: true,
            size: level === 1 ? 32 : level === 2 ? 28 : level === 3 ? 24 : level === 4 ? 22 : level === 5 ? 20 : 18,
            color: level <= 2 ? "1F4E79" : "2F75B5"
          })),
          spacing: { after: 240, before: level === 1 ? 480 : 240 }
        }))
        return
      }

      // Handle bullet lists
      const bulletMatch = trimmedLine.match(/^([-*+])\s+(.+)$/)
      if (bulletMatch) {
        flushNumberedList()
        currentBulletList.push(bulletMatch[2])
        return
      }

      // Handle numbered lists
      const numberedMatch = trimmedLine.match(/^(\d+)\.\s+(.+)$/)
      if (numberedMatch) {
        flushBulletList()
        currentNumberedList.push({
          number: numberedMatch[1],
          text: numberedMatch[2]
        })
        return
      }

      // Handle regular paragraphs
      if (trimmedLine) {
        flushBulletList()
        flushNumberedList()
        
        const formattedRuns = parseInlineFormatting(trimmedLine)
        paragraphs.push(new Paragraph({
          children: formattedRuns,
          spacing: { after: 200 }
        }))
      } else {
        // Empty line
        flushBulletList()
        flushNumberedList()
        if (index < lines.length - 1) { // Don't add spacing for last empty line
          paragraphs.push(new Paragraph({
            children: [new TextRun({ text: "" })],
            spacing: { after: 120 }
          }))
        }
      }
    })

    // Flush any remaining content
    flushBulletList()
    flushNumberedList()
    flushCodeBlock()
    flushBlockquote()

    return new Document({
      creator: "Pedagogen Platform",
      title: "Pedagogisch Antwoord",
      description: "Professioneel document gegenereerd door Pedagogen Platform",
      sections: [{
        properties: {},
        children: paragraphs.length > 0 ? paragraphs : [
          new Paragraph({
            children: [new TextRun({ text: "Geen inhoud beschikbaar" })]
          })
        ]
      }]
    })
  }

  // Handle Word document download
  const handleWordDownload = async () => {
    if (isStreaming || !content.trim()) return

    setWordDownloadStatus('generating')
    
    try {
      // Import Packer dynamically to avoid SSR issues
      const { Packer } = await import('docx')
      
      const doc = convertMarkdownToWordDocument(content)
      const blob = await Packer.toBlob(doc)
      
      // Create download link
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      
      // Generate filename with timestamp
      const now = new Date()
      const timestamp = now.toISOString().slice(0, 16).replace('T', '_').replace(/:/g, '-')
      link.download = `Pedagogisch_Antwoord_${timestamp}.docx`
      
      // Trigger download
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Cleanup
      URL.revokeObjectURL(url)
      
      setWordDownloadStatus('success')
      setTimeout(() => setWordDownloadStatus('idle'), 2000)
    } catch (error) {
      console.error('Word download failed:', error)
      setWordDownloadStatus('error')
      setTimeout(() => setWordDownloadStatus('idle'), 3000)
    }
  }

  const handleCopy = async () => {
    if (isStreaming || !content.trim()) return

    setCopyStatus('copying')
    
    try {
      const textToCopy = isMarkdown ? convertMarkdownToPlainText(content) : content
      await navigator.clipboard.writeText(textToCopy)
      setCopyStatus('success')
      setTimeout(() => setCopyStatus('idle'), 2000)
    } catch (error) {
      console.error('Copy failed:', error)
      setCopyStatus('error')
      setTimeout(() => setCopyStatus('idle'), 2000)
    }
  }

  const getCopyButtonText = () => {
    switch (copyStatus) {
      case 'copying': return '⏳ Kopiëren...'
      case 'success': return '✅ Gekopieerd!'
      case 'error': return '❌ Fout'
      default: return '📋 Kopiëren'
    }
  }

  const getCopyButtonClass = () => {
    const baseClass = "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed"
    
    switch (copyStatus) {
      case 'success':
        return `${baseClass} bg-green-100 text-green-700 border border-green-200`
      case 'error':
        return `${baseClass} bg-red-100 text-red-700 border border-red-200`
      case 'copying':
        return `${baseClass} bg-blue-100 text-blue-700 border border-blue-200`
      default:
        return `${baseClass} bg-gray-100 hover:bg-purple-100 text-gray-700 hover:text-purple-700 border border-gray-200 hover:border-purple-200`
    }
  }

  const getWordDownloadButtonText = () => {
    switch (wordDownloadStatus) {
      case 'generating': return '⏳ Genereren...'
      case 'success': return '✅ Gedownload!'
      case 'error': return '❌ Fout'
      default: return '📄 Download Word'
    }
  }

  const getWordDownloadButtonClass = () => {
    const baseClass = "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed"
    
    switch (wordDownloadStatus) {
      case 'success':
        return `${baseClass} bg-green-100 text-green-700 border border-green-200`
      case 'error':
        return `${baseClass} bg-red-100 text-red-700 border border-red-200`
      case 'generating':
        return `${baseClass} bg-blue-100 text-blue-700 border border-blue-200`
      default:
        return `${baseClass} bg-gray-100 hover:bg-indigo-100 text-gray-700 hover:text-indigo-700 border border-gray-200 hover:border-indigo-200`
    }
  }

  if (!content.trim()) return null

  return (
    <div className={`mt-3 ${className}`}>
      {/* Action Buttons Row */}
      <div className="flex items-center justify-end space-x-2 relative">
        {/* Gemini TTS Component */}
        <GeminiTTS
          content={content}
          isMarkdown={isMarkdown}
          isStreaming={isStreaming}
          selectedVoice={selectedGeminiVoice}
          selectedEmotion={selectedGeminiEmotion}
          hideSettings={false}
          className=""
        />

        {/* Word Download Button */}
        <button
          onClick={handleWordDownload}
          disabled={isStreaming || wordDownloadStatus === 'generating'}
          className={getWordDownloadButtonClass()}
          title="Download als Word document"
        >
          <span>{getWordDownloadButtonText()}</span>
        </button>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          disabled={isStreaming || copyStatus === 'copying'}
          className={getCopyButtonClass()}
          title="Kopieer naar klembord"
        >
          <span>{getCopyButtonText()}</span>
        </button>
      </div>
    </div>
  )
}