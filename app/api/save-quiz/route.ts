import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { firstName, email, answers, result, completedAt } = await request.json();

    // Validation
    if (!firstName || !email || !answers || !result) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Lire le fichier quiz-responses.json
    const filePath = path.join(process.cwd(), 'data', 'quiz-responses.json');
    let responses = [];

    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      responses = JSON.parse(fileContent);
    }

    // Créer la nouvelle réponse
    const newResponse = {
      id: Date.now().toString(),
      firstName,
      email,
      answers,
      result,
      completedAt: completedAt || new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    // Ajouter au début de la liste
    responses.unshift(newResponse);

    // Sauvegarder
    fs.writeFileSync(filePath, JSON.stringify(responses, null, 2));

    return NextResponse.json({ success: true, response: newResponse });

  } catch (error) {
    console.error('Error saving quiz response:', error);
    return NextResponse.json(
      { error: 'Failed to save quiz response' },
      { status: 500 }
    );
  }
}
