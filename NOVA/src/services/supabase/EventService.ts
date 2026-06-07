import { supabase } from './supabaseClient';
import type { Database } from '../../types/database';

type CommunityEvent = Database['public']['Tables']['events']['Row'];

export class EventService {
  /**
   * Fetch all events
   */
  static async getEvents(): Promise<any[]> {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        profiles!events_host_id_fkey (full_name),
        event_participants (user_id)
      `)
      .order('date', { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  }

  /**
   * Join an event as a participant
   */
  static async joinEvent(eventId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('event_participants')
      .insert({ event_id: eventId, user_id: userId });

    if (error) throw new Error(error.message);
  }

  /**
   * Leave an event
   */
  static async leaveEvent(eventId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('event_participants')
      .delete()
      .eq('event_id', eventId)
      .eq('user_id', userId);

    if (error) throw new Error(error.message);
  }
}
