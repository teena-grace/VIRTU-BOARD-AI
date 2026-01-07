import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { text, targetLang } = await request.json()

    if (!text || !targetLang) {
      return NextResponse.json(
        { error: 'Missing text or target language' },
        { status: 400 }
      )
    }

    // Use MyMemory Translation API (Free, no key required)
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`
    )

    if (!response.ok) {
      throw new Error('Translation service unavailable')
    }

    const data = await response.json()
    
    if (data.responseStatus !== 200) {
      throw new Error(data.responseDetails || 'Translation failed')
    }

    return NextResponse.json({
      translatedText: data.responseData.translatedText,
      success: true
    })

  } catch (error) {
    console.error('Translation error:', error)
    return NextResponse.json(
      { error: `Translation failed: ${(error as Error).message}` },
      { status: 500 }
    )
  }
}