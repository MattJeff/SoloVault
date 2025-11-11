import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'quiz-responses.json');

    if (!fs.existsSync(filePath)) {
      return NextResponse.json([]);
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const responses = JSON.parse(fileContent);

    return NextResponse.json(responses);
  } catch (error) {
    console.error('Error reading quiz responses:', error);
    // Retourner tableau vide au lieu d'erreur 500
    return NextResponse.json([]);
  }
}
