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
	pgbouncer: {
		Tables: {
			[_ in never]: never
		}
		Views: {
			[_ in never]: never
		}
		Functions: {
			get_auth: {
				Args: {
					p_usename: string
				}
				Returns: {
					username: string
					password: string
				}[]
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
			Accounts: {
				Row: {
					endDate: string | null
					endingBalance: number
					id: string
					name: string
					startDate: string | null
					startingBalance: number
				}
				Insert: {
					endDate?: string | null
					endingBalance: number
					id?: string
					name: string
					startDate?: string | null
					startingBalance: number
				}
				Update: {
					endDate?: string | null
					endingBalance?: number
					id?: string
					name?: string
					startDate?: string | null
					startingBalance?: number
				}
				Relationships: []
			}
			Members: {
				Row: {
					addedAt: string
					addedBy: string | null
					id: string | null
					membership: string | null
					racer: string
				}
				Insert: {
					addedAt?: string
					addedBy?: string | null
					id?: string | null
					membership?: string | null
					racer: string
				}
				Update: {
					addedAt?: string
					addedBy?: string | null
					id?: string | null
					membership?: string | null
					racer?: string
				}
				Relationships: [
					{
						foreignKeyName: "Members_membership_fkey"
						columns: ["membership"]
						referencedRelation: "MembershipTypes"
						referencedColumns: ["id"]
					},
					{
						foreignKeyName: "Members_racer_fkey"
						columns: ["racer"]
						referencedRelation: "RacerDetails"
						referencedColumns: ["id"]
					},
					{
						foreignKeyName: "Members_racer_fkey"
						columns: ["racer"]
						referencedRelation: "Racers"
						referencedColumns: ["id"]
					},
				]
			}
			MembershipTypes: {
				Row: {
					id: string
					name: string
					price: number
					validFrom: string
					validUntil: string
				}
				Insert: {
					id?: string
					name: string
					price: number
					validFrom: string
					validUntil: string
				}
				Update: {
					id?: string
					name?: string
					price?: number
					validFrom?: string
					validUntil?: string
				}
				Relationships: []
			}
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
			TaskAssignments: {
				Row: {
					assigned_at: string
					assigned_by: string
					assigned_to: string
					task_id: string
				}
				Insert: {
					assigned_at?: string
					assigned_by?: string
					assigned_to: string
					task_id?: string
				}
				Update: {
					assigned_at?: string
					assigned_by?: string
					assigned_to?: string
					task_id?: string
				}
				Relationships: [
					{
						foreignKeyName: "TaskAssignments_task_id_fkey"
						columns: ["task_id"]
						referencedRelation: "Tasks"
						referencedColumns: ["id"]
					},
				]
			}
			TaskComments: {
				Row: {
					authored_by: string
					content: string
					created_at: string
					id: string
					task: string | null
				}
				Insert: {
					authored_by?: string
					content: string
					created_at?: string
					id?: string
					task?: string | null
				}
				Update: {
					authored_by?: string
					content?: string
					created_at?: string
					id?: string
					task?: string | null
				}
				Relationships: [
					{
						foreignKeyName: "TaskComments_task_fkey"
						columns: ["task"]
						referencedRelation: "Tasks"
						referencedColumns: ["id"]
					},
				]
			}
			Tasks: {
				Row: {
					created_at: string
					created_by: string
					description: string
					due_at: string
					id: string
					primarily_responsible_person: string
					priority: Database["public"]["Enums"]["task_priority"]
					status: Database["public"]["Enums"]["task_status"]
					title: string
					updated_at: string
				}
				Insert: {
					created_at?: string
					created_by?: string
					description: string
					due_at: string
					id?: string
					primarily_responsible_person: string
					priority?: Database["public"]["Enums"]["task_priority"]
					status?: Database["public"]["Enums"]["task_status"]
					title: string
					updated_at?: string
				}
				Update: {
					created_at?: string
					created_by?: string
					description?: string
					due_at?: string
					id?: string
					primarily_responsible_person?: string
					priority?: Database["public"]["Enums"]["task_priority"]
					status?: Database["public"]["Enums"]["task_status"]
					title?: string
					updated_at?: string
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
			Transactions: {
				Row: {
					account: string
					id: string
					itemDescription: string
					occurredAt: string
					value: number
				}
				Insert: {
					account: string
					id?: string
					itemDescription: string
					occurredAt?: string
					value: number
				}
				Update: {
					account?: string
					id?: string
					itemDescription?: string
					occurredAt?: string
					value?: number
				}
				Relationships: [
					{
						foreignKeyName: "Transactions_account_fkey"
						columns: ["account"]
						referencedRelation: "Accounts"
						referencedColumns: ["id"]
					},
				]
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
			task_priority: "High" | "Medium" | "Low"
			task_status:
				| "Open"
				| "In Progress"
				| "Blocked"
				| "Completed"
				| "Cancelled"
			track_type: "outdoor" | "indoor"
		}
		CompositeTypes: {
			[_ in never]: never
		}
	}
	storage: {
		Tables: {
			buckets: {
				Row: {
					allowed_mime_types: string[] | null
					avif_autodetection: boolean | null
					created_at: string | null
					file_size_limit: number | null
					id: string
					name: string
					owner: string | null
					owner_id: string | null
					public: boolean | null
					updated_at: string | null
				}
				Insert: {
					allowed_mime_types?: string[] | null
					avif_autodetection?: boolean | null
					created_at?: string | null
					file_size_limit?: number | null
					id: string
					name: string
					owner?: string | null
					owner_id?: string | null
					public?: boolean | null
					updated_at?: string | null
				}
				Update: {
					allowed_mime_types?: string[] | null
					avif_autodetection?: boolean | null
					created_at?: string | null
					file_size_limit?: number | null
					id?: string
					name?: string
					owner?: string | null
					owner_id?: string | null
					public?: boolean | null
					updated_at?: string | null
				}
				Relationships: []
			}
			migrations: {
				Row: {
					executed_at: string | null
					hash: string
					id: number
					name: string
				}
				Insert: {
					executed_at?: string | null
					hash: string
					id: number
					name: string
				}
				Update: {
					executed_at?: string | null
					hash?: string
					id?: number
					name?: string
				}
				Relationships: []
			}
			objects: {
				Row: {
					bucket_id: string | null
					created_at: string | null
					id: string
					last_accessed_at: string | null
					metadata: Json | null
					name: string | null
					owner: string | null
					owner_id: string | null
					path_tokens: string[] | null
					updated_at: string | null
					user_metadata: Json | null
					version: string | null
				}
				Insert: {
					bucket_id?: string | null
					created_at?: string | null
					id?: string
					last_accessed_at?: string | null
					metadata?: Json | null
					name?: string | null
					owner?: string | null
					owner_id?: string | null
					path_tokens?: string[] | null
					updated_at?: string | null
					user_metadata?: Json | null
					version?: string | null
				}
				Update: {
					bucket_id?: string | null
					created_at?: string | null
					id?: string
					last_accessed_at?: string | null
					metadata?: Json | null
					name?: string | null
					owner?: string | null
					owner_id?: string | null
					path_tokens?: string[] | null
					updated_at?: string | null
					user_metadata?: Json | null
					version?: string | null
				}
				Relationships: [
					{
						foreignKeyName: "objects_bucketId_fkey"
						columns: ["bucket_id"]
						referencedRelation: "buckets"
						referencedColumns: ["id"]
					},
				]
			}
			s3_multipart_uploads: {
				Row: {
					bucket_id: string
					created_at: string
					id: string
					in_progress_size: number
					key: string
					owner_id: string | null
					upload_signature: string
					user_metadata: Json | null
					version: string
				}
				Insert: {
					bucket_id: string
					created_at?: string
					id: string
					in_progress_size?: number
					key: string
					owner_id?: string | null
					upload_signature: string
					user_metadata?: Json | null
					version: string
				}
				Update: {
					bucket_id?: string
					created_at?: string
					id?: string
					in_progress_size?: number
					key?: string
					owner_id?: string | null
					upload_signature?: string
					user_metadata?: Json | null
					version?: string
				}
				Relationships: [
					{
						foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
						columns: ["bucket_id"]
						referencedRelation: "buckets"
						referencedColumns: ["id"]
					},
				]
			}
			s3_multipart_uploads_parts: {
				Row: {
					bucket_id: string
					created_at: string
					etag: string
					id: string
					key: string
					owner_id: string | null
					part_number: number
					size: number
					upload_id: string
					version: string
				}
				Insert: {
					bucket_id: string
					created_at?: string
					etag: string
					id?: string
					key: string
					owner_id?: string | null
					part_number: number
					size?: number
					upload_id: string
					version: string
				}
				Update: {
					bucket_id?: string
					created_at?: string
					etag?: string
					id?: string
					key?: string
					owner_id?: string | null
					part_number?: number
					size?: number
					upload_id?: string
					version?: string
				}
				Relationships: [
					{
						foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey"
						columns: ["bucket_id"]
						referencedRelation: "buckets"
						referencedColumns: ["id"]
					},
					{
						foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
						columns: ["upload_id"]
						referencedRelation: "s3_multipart_uploads"
						referencedColumns: ["id"]
					},
				]
			}
		}
		Views: {
			[_ in never]: never
		}
		Functions: {
			can_insert_object: {
				Args: {
					bucketid: string
					name: string
					owner: string
					metadata: Json
				}
				Returns: undefined
			}
			extension: {
				Args: {
					name: string
				}
				Returns: string
			}
			filename: {
				Args: {
					name: string
				}
				Returns: string
			}
			foldername: {
				Args: {
					name: string
				}
				Returns: string[]
			}
			get_size_by_bucket: {
				Args: Record<PropertyKey, never>
				Returns: {
					size: number
					bucket_id: string
				}[]
			}
			list_multipart_uploads_with_delimiter: {
				Args: {
					bucket_id: string
					prefix_param: string
					delimiter_param: string
					max_keys?: number
					next_key_token?: string
					next_upload_token?: string
				}
				Returns: {
					key: string
					id: string
					created_at: string
				}[]
			}
			list_objects_with_delimiter: {
				Args: {
					bucket_id: string
					prefix_param: string
					delimiter_param: string
					max_keys?: number
					start_after?: string
					next_token?: string
				}
				Returns: {
					name: string
					id: string
					metadata: Json
					updated_at: string
				}[]
			}
			operation: {
				Args: Record<PropertyKey, never>
				Returns: string
			}
			search: {
				Args: {
					prefix: string
					bucketname: string
					limits?: number
					levels?: number
					offsets?: number
					search?: string
					sortcolumn?: string
					sortorder?: string
				}
				Returns: {
					name: string
					id: string
					updated_at: string
					created_at: string
					last_accessed_at: string
					metadata: Json
				}[]
			}
		}
		Enums: {
			[_ in never]: never
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
