import { supabase } from './supabase';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt: string;
  lastLoginAt: string;
}

// Générer un code de connexion simple (6 chiffres)
export function generateLoginCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Sauvegarder ou mettre à jour un utilisateur
export async function saveOrUpdateUser(email: string, firstName?: string, lastName?: string): Promise<User | null> {
  try {
    if (!supabase) {
      console.warn('Supabase not configured, using localStorage only');
      const user: User = {
        id: Date.now().toString(),
        email,
        firstName,
        lastName,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };
      
      // Sauvegarder en localStorage
      localStorage.setItem('solovault_user', JSON.stringify(user));
      return user;
    }

    // Vérifier si l'utilisateur existe déjà
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      // Mettre à jour lastLoginAt
      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({
          last_login_at: new Date().toISOString(),
          first_name: firstName || existingUser.first_name,
          last_name: lastName || existingUser.last_name
        })
        .eq('email', email)
        .select()
        .single();

      if (updateError) throw updateError;

      const user: User = {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        createdAt: updatedUser.created_at,
        lastLoginAt: updatedUser.last_login_at
      };

      localStorage.setItem('solovault_user', JSON.stringify(user));
      return user;
    }

    // Créer un nouvel utilisateur
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        email,
        first_name: firstName,
        last_name: lastName,
        created_at: new Date().toISOString(),
        last_login_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) throw insertError;

    const user: User = {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.first_name,
      lastName: newUser.last_name,
      createdAt: newUser.created_at,
      lastLoginAt: newUser.last_login_at
    };

    localStorage.setItem('solovault_user', JSON.stringify(user));
    return user;

  } catch (error) {
    console.error('Error saving/updating user:', error);
    
    // Fallback: sauvegarder en localStorage uniquement
    const user: User = {
      id: Date.now().toString(),
      email,
      firstName,
      lastName,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };
    
    localStorage.setItem('solovault_user', JSON.stringify(user));
    return user;
  }
}

// Récupérer l'utilisateur actuel
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  
  const userStr = localStorage.getItem('solovault_user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

// Vérifier si l'utilisateur est connecté
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

// Déconnexion
export function logout() {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('solovault_user');
  localStorage.removeItem('solovault_email');
  localStorage.removeItem('solovault_firstName');
  localStorage.removeItem('solovault_lastName');
  localStorage.removeItem('solovault_email_submitted');
}

// Envoyer un code de connexion par email (optionnel)
export async function sendLoginCode(email: string, code: string): Promise<boolean> {
  try {
    const response = await fetch('/api/send-login-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code })
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error sending login code:', error);
    return false;
  }
}
