import { supabase } from './supabaseClient';
import type { Database } from '../../types/database';

type Discussion = Database['public']['Tables']['discussions']['Row'];
type DiscussionInsert = Database['public']['Tables']['discussions']['Insert'];

export class DiscussionService {
  /**
   * Fetch all discussions, ordered by creation date
   */
  static async getDiscussions(): Promise<any[]> {
    const { data, error } = await supabase
      .from('discussions')
      .select(`
        *,
        profiles (full_name),
        discussion_replies (
          *,
          profiles (full_name)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  }

  /**
   * Create a new discussion
   */
  static async createDiscussion(discussion: DiscussionInsert): Promise<Discussion> {
    const { data, error } = await supabase
      .from('discussions')
      .insert(discussion)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  /**
   * Like a discussion (optimistic approach: increments directly via rpc or reads/updates)
   */
  static async likeDiscussion(id: string, currentLikes: number): Promise<void> {
    const { error } = await supabase
      .from('discussions')
      .update({ likes_count: currentLikes + 1 })
      .eq('id', id);

    if (error) throw new Error(error.message);
  }

  /**
   * Delete a discussion (Admins/Core members)
   */
  static async deleteDiscussion(id: string): Promise<void> {
    const { error } = await supabase
      .from('discussions')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }

  /**
   * Add a reply to a discussion
   */
  static async addReply(reply: any): Promise<any> {
    const { data, error } = await supabase
      .from('discussion_replies')
      .insert(reply)
      .select(`*, profiles (full_name)`)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  /**
   * Like a reply
   */
  static async likeReply(id: string, currentLikes: number): Promise<void> {
    const { error } = await supabase
      .from('discussion_replies')
      .update({ likes_count: currentLikes + 1 })
      .eq('id', id);

    if (error) throw new Error(error.message);
  }
}
