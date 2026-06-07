import { supabase } from './supabaseClient';
import type { Database } from '../../types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export class ProfileService {
  /**
   * Get the current user's profile
   */
  static async getProfile(userId: string): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  /**
   * Update the current user's profile
   */
  static async updateProfile(userId: string, updates: ProfileUpdate): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  /**
   * Upload a new avatar and update the profile
   */
  static async updateAvatar(userId: string, file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}/avatar_${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw new Error(uploadError.message);

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    const publicUrl = data.publicUrl;

    await this.updateProfile(userId, { avatar_url: publicUrl });

    return publicUrl;
  }
}
