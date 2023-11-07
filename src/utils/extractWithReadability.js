// utils/extractWithReadability

import { Readability } from '@mozilla/readability'
import { DOMParser } from 'linkedom'
import { isString } from 'bellajs'

export default (html, url = '') => {
  if (!isString(html)) {
    return null
  }
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const base = doc.createElement('base')
  base.setAttribute('href', url)
  doc.head.appendChild(base)
  const reader = new Readability(doc, {
    keepClasses: true,
  })

  // Strip out as little as possible; otherwise, Readability will
  // try to remove elements with class "clearfix", which might remove
  // some real content divs
  reader._flags = 0
  // Typically, _clean will do a bunch of after-parse cleanup
  // by e.g., removing <h1> tags. This wreaks havoc with sites like Eater,
  // which puts restaurant names in <h1> tags, so we disable it for
  // certain tags
  const origClean = reader._clean.bind(reader)
  reader._clean = (content, tagName) => {
    if (tagName === 'h1') return
    origClean(content, tagName)
  }

  const result = reader.parse() ?? {}
  return result.textContent ? result.content : null
}

export function extractTitleWithReadability (html) {
  if (!isString(html)) {
    return null
  }
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const reader = new Readability(doc)
  return reader._getArticleTitle() || null
}
