import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const { projects } = await request.json();

    if (!projects || !Array.isArray(projects)) {
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 400 }
      );
    }

    // Créer le dossier backups s'il n'existe pas
    const backupDir = path.join(process.cwd(), 'data', 'backups');
    if (!existsSync(backupDir)) {
      await mkdir(backupDir, { recursive: true });
    }

    // 1. Backup de l'ancien fichier
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(backupDir, `projects-${timestamp}.json`);
    
    try {
      const currentData = await import('@/data/projects.json');
      await writeFile(backupPath, JSON.stringify(currentData.default, null, 2));
    } catch (error) {
      console.log('No existing file to backup');
    }

    // 2. Sauvegarder les nouvelles données
    const dataPath = path.join(process.cwd(), 'data', 'projects.json');
    await writeFile(dataPath, JSON.stringify(projects, null, 2));

    // 3. Revalider le cache Next.js
    revalidatePath('/');

    return NextResponse.json({
      success: true,
      message: `${projects.length} projects updated successfully`,
      backupFile: `projects-${timestamp}.json` 
    });

  } catch (error) {
    console.error('Error updating projects:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
