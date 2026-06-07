import { supabase } from './supabaseClient';
import type { Database } from '../../types/database';

type Application = Database['public']['Tables']['nova_id_applications']['Row'];
type ApplicationInsert = Database['public']['Tables']['nova_id_applications']['Insert'];

export class NovaIdService {
  /**
   * Upload the user's college ID card to the 'id_cards' bucket
   */
  static async uploadIdCard(userId: string, file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}/id_card_${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from('id-cards')
      .upload(filePath, file);

    if (error) throw new Error(error.message);

    const { data } = supabase.storage.from('id-cards').getPublicUrl(filePath);
    return data.publicUrl;
  }

  /**
   * Submit the NOVA ID Application
   */
  static async submitApplication(application: ApplicationInsert): Promise<Application> {
    // Check if an application already exists for this user (e.g. a rejected one)
    const { data: existingApp } = await supabase
      .from('nova_id_applications')
      .select('id')
      .eq('user_id', application.user_id)
      .single();

    if (existingApp) {
      const { data, error } = await supabase
        .from('nova_id_applications')
        .update({
          ...application,
          status: 'pending',
          applied_at: new Date().toISOString()
        })
        .eq('id', existingApp.id)
        .select()
        .single();
      
      if (error) throw new Error(error.message);
      return data;
    } else {
      const { data, error } = await supabase
        .from('nova_id_applications')
        .insert(application)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    }
  }

  /**
   * Get application status for the current user
   */
  static async getMyApplicationStatus(userId: string): Promise<Application | null> {
    const { data, error } = await supabase
      .from('nova_id_applications')
      .select('*')
      .eq('user_id', userId)
      .order('applied_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "No rows found"
      throw new Error(error.message);
    }
    return data || null;
  }
}
