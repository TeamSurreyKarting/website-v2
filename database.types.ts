export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[]

export type Database = {
	graphql_public: {
		Tables: {
			[_ in never]: never
		}
		Views: {
			[_ in never]: never
		}
		Functions: {
			graphql: {
				Args: {
					operationName?: string
					query?: string
					variables?: Json
					extensions?: Json
				}
				Returns: Json
			}
		}
		Enums: {
			[_ in never]: never
		}
		CompositeTypes: {
			[_ in never]: never
		}
	}
	public: {
		Tables: {
			Racers: {
				Row: {
					firstName: string
					fullName: string | null
					graduationDate: string | null
					id: string
					lastName: string
				}
				Insert: {
					firstName: string
					fullName?: string | null
					graduationDate?: string | null
					id: string
					lastName: string
				}
				Update: {
					firstName?: string
					fullName?: string | null
					graduationDate?: string | null
					id?: string
					lastName?: string
				}
				Relationships: []
			}
			Tracks: {
				Row: {
					created_at: string
					id: number
					name: string | null
					track_map_upload_path: string | null
					type: Database["public"]["Enums"]["track_type"] | null
				}
				Insert: {
					created_at?: string
					id?: number
					name?: string | null
					track_map_upload_path?: string | null
					type?: Database["public"]["Enums"]["track_type"] | null
				}
				Update: {
					created_at?: string
					id?: number
					name?: string | null
					track_map_upload_path?: string | null
					type?: Database["public"]["Enums"]["track_type"] | null
				}
				Relationships: []
			}
		}
		Views: {
			RacerDetails: {
				Row: {
					email: string | null
					firstName: string | null
					fullName: string | null
					graduationDate: string | null
					id: string | null
					last_sign_in_at: string | null
					lastName: string | null
				}
				Relationships: []
			}
		}
		Functions: {
			get_fastest_laps: {
				Args: {
					for_event_id: number
					for_league_id: number
				}
				Returns: {
					event_session_result_id: number
					event_session_id: number
					event_id: number
					racer_id: number
					fastest_lap: number
					total_time: number
					first_name: string
					last_name: string
					experience_level: Database["public"]["Enums"]["experience_level"]
				}[]
			}
			get_types: {
				Args: {
					enum_type: string
				}
				Returns: Json
			}
			racer_exists: {
				Args: {
					user_email: string
				}
				Returns: boolean
			}
			racer_exists_by_email: {
				Args: {
					email_input: string
				}
				Returns: boolean
			}
			racers_not_league_entrants: {
				Args: {
					requested_league_id: number
				}
				Returns: {
					id: number
					user_id: string
					first_name: string
					last_name: string
					created_at: string
					student_id_expiry: string
					experience_level: Database["public"]["Enums"]["experience_level"]
				}[]
			}
		}
		Enums: {
			experience_level: "rookie" | "experienced" | "graduate"
			license_type: "bukc_test" | "bukc_full"
			points_allocations: "formula1_top10" | "linear_top10"
			race_format: "practice" | "sprint" | "endurance"
			track_type: "outdoor" | "indoor"
		}
		CompositeTypes: {
			[_ in never]: never
		}
	}
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
	PublicTableNameOrOptions extends
			| keyof (PublicSchema["Tables"] & PublicSchema["Views"])
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
			Database[PublicTableNameOrOptions["schema"]]["Views"])
		: never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
		Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
			Row: infer R
		}
		? R
		: never
	: PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
			PublicSchema["Views"])
		? (PublicSchema["Tables"] &
			PublicSchema["Views"])[PublicTableNameOrOptions] extends {
				Row: infer R
			}
			? R
			: never
		: never

export type TablesInsert<
	PublicTableNameOrOptions extends
			| keyof PublicSchema["Tables"]
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Insert: infer I
		}
		? I
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
		? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
				Insert: infer I
			}
			? I
			: never
		: never

export type TablesUpdate<
	PublicTableNameOrOptions extends
			| keyof PublicSchema["Tables"]
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Update: infer U
		}
		? U
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
		? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
				Update: infer U
			}
			? U
			: never
		: never

export type Enums<
	PublicEnumNameOrOptions extends
			| keyof PublicSchema["Enums"]
		| { schema: keyof Database },
	EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
		: never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
	? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
	: PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
		? PublicSchema["Enums"][PublicEnumNameOrOptions]
		: never

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
			| keyof PublicSchema["CompositeTypes"]
		| { schema: keyof Database },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
			schema: keyof Database
		}
		? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
		: never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
	? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
		? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
		: never
