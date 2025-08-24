// Auto-typed from Supabase migrations (concise hand-crafted model)
// If you later generate types via the Supabase CLI, replace this file.

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          user_id: string;
          role: Database['public']['Enums']['user_role'];
          full_name: string | null;
          company_name: string | null;
          home_base_geo: object | null; // geography(Point, 4326)
          subscription_status: Database['public']['Enums']['subscription_status'];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          role?: Database['public']['Enums']['user_role'];
          full_name?: string | null;
          company_name?: string | null;
          home_base_geo?: object | null;
          subscription_status?: Database['public']['Enums']['subscription_status'];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          role?: Database['public']['Enums']['user_role'];
          full_name?: string | null;
          company_name?: string | null;
          home_base_geo?: object | null;
          subscription_status?: Database['public']['Enums']['subscription_status'];
          updated_at?: string;
        };
      };
      loads: {
        Row: {
          id: string;
          created_by: string | null;
          title: string;
          description: string | null;
          pickup_location_geo: object; // geography(Point, 4326)
          delivery_location_geo: object; // geography(Point, 4326)
          weight_kg: string | null; // numeric
          volume_m3: string | null; // numeric
          vehicle_type: string | null;
          status: Database['public']['Enums']['load_status'];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          created_by?: string | null;
          title: string;
          description?: string | null;
          pickup_location_geo: object;
          delivery_location_geo: object;
          weight_kg?: string | null;
          volume_m3?: string | null;
          vehicle_type?: string | null;
          status?: Database['public']['Enums']['load_status'];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          created_by?: string | null;
          title?: string;
          description?: string | null;
          pickup_location_geo?: object;
          delivery_location_geo?: object;
          weight_kg?: string | null;
          volume_m3?: string | null;
          vehicle_type?: string | null;
          status?: Database['public']['Enums']['load_status'];
          updated_at?: string;
        };
      };
      bids: {
        Row: {
          id: string;
          load_id: string;
          bidder_id: string;
          amount: string; // numeric
          currency: string; // char(3)
          status: Database['public']['Enums']['bid_status'];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          load_id: string;
          bidder_id: string;
          amount: string;
          currency?: string;
          status?: Database['public']['Enums']['bid_status'];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          amount?: string;
          currency?: string;
          status?: Database['public']['Enums']['bid_status'];
          updated_at?: string;
        };
      };
      deals: {
        Row: {
          id: string;
          load_id: string;
          bid_id: string;
          carrier_id: string | null;
          price: string;
          currency: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          load_id: string;
          bid_id: string;
          carrier_id?: string | null;
          price: string;
          currency?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          carrier_id?: string | null;
          price?: string;
          currency?: string;
          updated_at?: string;
        };
      };
      chat_messages: {
        Row: {
          id: number;
          deal_id: string;
          sender_id: string;
          message: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          deal_id: string;
          sender_id: string;
          message: string;
          created_at?: string;
        };
        Update: {
          message?: string;
        };
      };
      geocoding_cache: {
        Row: {
          id: number;
          query_text: string;
          provider: string | null;
          lat: number | null;
          lng: number | null;
          geo: object | null; // geography(Point, 4326)
          created_at: string;
        };
        Insert: {
          id?: number;
          query_text: string;
          provider?: string | null;
          lat?: number | null;
          lng?: number | null;
          geo?: object | null;
          created_at?: string;
        };
        Update: {
          provider?: string | null;
          lat?: number | null;
          lng?: number | null;
          geo?: object | null;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: 'admin' | 'shipper' | 'carrier';
      load_status: 'posted' | 'accepted' | 'in_transit' | 'delivered' | 'canceled';
      bid_status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
      subscription_status: 'free' | 'trialing' | 'active' | 'past_due' | 'canceled';
    };
  };
};

// Helper generic to pick table row types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];


