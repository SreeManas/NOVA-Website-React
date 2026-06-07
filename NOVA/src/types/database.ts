export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          department: 'CSE' | 'IT' | 'ECE' | 'EEE' | 'MECH' | 'CIVIL' | 'AIDS' | 'AIML' | null
          year_of_study: '1st' | '2nd' | '3rd' | '4th' | null
          college_email: string | null
          role: 'guest' | 'verified' | 'core' | 'admin'
          level: string
          points_total: number
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          full_name: string
          department?: 'CSE' | 'IT' | 'ECE' | 'EEE' | 'MECH' | 'CIVIL' | 'AIDS' | 'AIML' | null
          year_of_study?: '1st' | '2nd' | '3rd' | '4th' | null
          college_email?: string | null
          role?: 'guest' | 'verified' | 'core' | 'admin'
          level?: string
          points_total?: number
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          department?: 'CSE' | 'IT' | 'ECE' | 'EEE' | 'MECH' | 'CIVIL' | 'AIDS' | 'AIML' | null
          year_of_study?: '1st' | '2nd' | '3rd' | '4th' | null
          college_email?: string | null
          role?: 'guest' | 'verified' | 'core' | 'admin'
          level?: string
          points_total?: number
          avatar_url?: string | null
          created_at?: string
        }
      }
      nova_id_applications: {
        Row: {
          id: string
          user_id: string
          full_name: string
          roll_number: string
          department: 'CSE' | 'IT' | 'ECE' | 'EEE' | 'MECH' | 'CIVIL' | 'AIDS' | 'AIML'
          year_of_study: '1st' | '2nd' | '3rd' | '4th'
          college_email: string
          id_card_url: string
          motivation: string | null
          status: 'idle' | 'submitting' | 'pending' | 'approved' | 'rejected'
          applied_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name: string
          roll_number: string
          department: 'CSE' | 'IT' | 'ECE' | 'EEE' | 'MECH' | 'CIVIL' | 'AIDS' | 'AIML'
          year_of_study: '1st' | '2nd' | '3rd' | '4th'
          college_email: string
          id_card_url: string
          motivation?: string | null
          status?: 'idle' | 'submitting' | 'pending' | 'approved' | 'rejected'
          applied_at?: string
        }
        Update: {
          status?: 'idle' | 'submitting' | 'pending' | 'approved' | 'rejected'
        }
      }
      discussions: {
        Row: {
          id: string
          author_id: string
          title: string
          content: string
          category: 'general' | 'hackathons' | 'placements' | 'ai-ml' | 'web-development' | 'cybersecurity' | 'projects' | 'open-source'
          likes_count: number
          is_pinned: boolean
          created_at: string
        }
        Insert: {
          id?: string
          author_id: string
          title: string
          content: string
          category: 'general' | 'hackathons' | 'placements' | 'ai-ml' | 'web-development' | 'cybersecurity' | 'projects' | 'open-source'
        }
        Update: {
          likes_count?: number
        }
      }
      discussion_replies: {
        Row: {
          id: string
          discussion_id: string
          author_id: string
          content: string
          likes_count: number
          created_at: string
        }
        Insert: {
          id?: string
          discussion_id: string
          author_id: string
          content: string
          likes_count?: number
          created_at?: string
        }
        Update: {
          likes_count?: number
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string
          event_type: 'study-circle' | 'tech-meetup' | 'resume-review' | 'mock-interview' | 'hackathon-prep' | 'open-source-sprint'
          date: string
          time: string
          host_id: string
          max_participants: number
          status: 'upcoming' | 'live' | 'completed'
          tags: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          event_type: 'study-circle' | 'tech-meetup' | 'resume-review' | 'mock-interview' | 'hackathon-prep' | 'open-source-sprint'
          date: string
          time: string
          host_id: string
          max_participants: number
          status?: 'upcoming' | 'live' | 'completed'
          tags?: string[] | null
          created_at?: string
        }
        Update: {
          title?: string
          description?: string
          event_type?: 'study-circle' | 'tech-meetup' | 'resume-review' | 'mock-interview' | 'hackathon-prep' | 'open-source-sprint'
          date?: string
          time?: string
          host_id?: string
          max_participants?: number
          status?: 'upcoming' | 'live' | 'completed'
          tags?: string[] | null
        }
      }
      opportunities: {
        Row: {
          id: string
          author_id: string
          title: string
          organizer: string
          category: 'hackathon' | 'internship' | 'workshop' | 'conference' | 'scholarship' | 'open-source'
          description: string
          deadline: string
          apply_url: string
          location: string
          eligibility: string
          tags: string[] | null
          is_featured: boolean
          created_at: string
        }
        Insert: {
          id?: string
          author_id: string
          title: string
          organizer: string
          category: 'hackathon' | 'internship' | 'workshop' | 'conference' | 'scholarship' | 'open-source'
          description: string
          deadline: string
          apply_url: string
          location: string
          eligibility: string
          tags?: string[] | null
          is_featured?: boolean
          created_at?: string
        }
        Update: {
          title?: string
          organizer?: string
          category?: 'hackathon' | 'internship' | 'workshop' | 'conference' | 'scholarship' | 'open-source'
          description?: string
          deadline?: string
          apply_url?: string
          location?: string
          eligibility?: string
          tags?: string[] | null
          is_featured?: boolean
        }
      }
      event_participants: {
        Row: {
          event_id: string
          user_id: string
          joined_at: string
        }
        Insert: {
          event_id: string
          user_id: string
          joined_at?: string
        }
        Update: {
          event_id?: string
          user_id?: string
          joined_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string
          is_read: boolean
          action_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          message: string
          is_read?: boolean
          action_url?: string | null
          created_at?: string
        }
        Update: {
          is_read?: boolean
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      user_role: 'guest' | 'verified' | 'core' | 'admin'
      department: 'CSE' | 'IT' | 'ECE' | 'EEE' | 'MECH' | 'CIVIL' | 'AIDS' | 'AIML'
      year_of_study: '1st' | '2nd' | '3rd' | '4th'
      opportunity_category: 'hackathon' | 'internship' | 'workshop' | 'conference' | 'scholarship' | 'open-source'
    }
    CompositeTypes: Record<string, never>
  }
}
