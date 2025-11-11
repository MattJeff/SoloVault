import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'users.json');

    if (!fs.existsSync(filePath)) {
      return NextResponse.json([]);
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const users = JSON.parse(fileContent);

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error reading users:', error);
    // Retourner tableau vide au lieu d'erreur 500
    return NextResponse.json([]);
  }
}
