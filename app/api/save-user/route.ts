import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, source, page } = await request.json();

    // Validation
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Lire le fichier users.json
    const filePath = path.join(process.cwd(), 'data', 'users.json');
    let users = [];

    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      users = JSON.parse(fileContent);
    }

    // Créer le nouvel utilisateur
    const newUser = {
      id: Date.now().toString(),
      firstName,
      lastName,
      email,
      source: source || 'Unknown',
      page: page || '/',
      createdAt: new Date().toISOString()
    };

    // Ajouter au début de la liste
    users.unshift(newUser);

    // Sauvegarder
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

    return NextResponse.json({ success: true, user: newUser });

  } catch (error) {
    console.error('Error saving user:', error);
    return NextResponse.json(
      { error: 'Failed to save user' },
      { status: 500 }
    );
  }
}
