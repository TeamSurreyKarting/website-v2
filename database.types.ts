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
      CompetitionEventLapTimes: {
        Row: {
          createdAt: string
          id: string
          lapNumber: number
          lapTime: number
          race: string
          racer: string
          sector1Time: number
          sector2Time: number
          sector3Time: number
        }
        Insert: {
          createdAt?: string
          id?: string
          lapNumber: number
          lapTime: number
          race: string
          racer: string
          sector1Time: number
          sector2Time: number
          sector3Time: number
        }
        Update: {
          createdAt?: string
          id?: string
          lapNumber?: number
          lapTime?: number
          race?: string
          racer?: string
          sector1Time?: number
          sector2Time?: number
          sector3Time?: number
        }
        Relationships: [
          {
            foreignKeyName: "competitioneventlaptimes_race_fkey"
            columns: ["race"]
            isOneToOne: false
            referencedRelation: "CompetitionEventRaces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "competitioneventlaptimes_racer_fkey"
            columns: ["racer"]
            isOneToOne: false
            referencedRelation: "CompetitionEventRaceEntrants"
            referencedColumns: ["id"]
          },
        ]
      }
      CompetitionEventRaceEntrants: {
        Row: {
          createdAt: string
          createdBy: string | null
          id: string
          race: string
          teamRacer: string
        }
        Insert: {
          createdAt?: string
          createdBy?: string | null
          id?: string
          race: string
          teamRacer: string
        }
        Update: {
          createdAt?: string
          createdBy?: string | null
          id?: string
          race?: string
          teamRacer?: string
        }
        Relationships: [
          {
            foreignKeyName: "CompetitionEventRaceEntrants_race_fkey"
            columns: ["race"]
            isOneToOne: false
            referencedRelation: "CompetitionEventRaces"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "CompetitionEventRaceEntrants_teamRacer_fkey"
            columns: ["teamRacer"]
            isOneToOne: false
            referencedRelation: "CompetitionEventTeamSelection"
            referencedColumns: ["id"]
          },
        ]
      }
      CompetitionEventRacerAvailability: {
        Row: {
          createdAt: string
          id: string
          isAvailable: boolean
          racer: string | null
        }
        Insert: {
          createdAt?: string
          id?: string
          isAvailable?: boolean
          racer?: string | null
        }
        Update: {
          createdAt?: string
          id?: string
          isAvailable?: boolean
          racer?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "CompetitionEventRacerAvailability_racer_fkey"
            columns: ["racer"]
            isOneToOne: false
            referencedRelation: "RacerDetails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "CompetitionEventRacerAvailability_racer_fkey"
            columns: ["racer"]
            isOneToOne: false
            referencedRelation: "Racers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "CompetitionEventRacerAvailability_racer_fkey"
            columns: ["racer"]
            isOneToOne: false
            referencedRelation: "TaskDetailsView"
            referencedColumns: ["primarily_responsible_person_id"]
          },
          {
            foreignKeyName: "CompetitionEventRacerAvailability_racer_fkey"
            columns: ["racer"]
            isOneToOne: false
            referencedRelation: "TaskDetailsView"
            referencedColumns: ["created_by_id"]
          },
        ]
      }
      CompetitionEventRaces: {
        Row: {
          createdAt: string
          createdBy: string | null
          duration: number
          event: string
          id: string
          startsAt: string
        }
        Insert: {
          createdAt?: string
          createdBy?: string | null
          duration: number
          event: string
          id?: string
          startsAt: string
        }
        Update: {
          createdAt?: string
          createdBy?: string | null
          duration?: number
          event?: string
          id?: string
          startsAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "CompetitionEventRaces_event_fkey"
            columns: ["event"]
            isOneToOne: false
            referencedRelation: "CompetitionEvents"
            referencedColumns: ["id"]
          },
        ]
      }
      CompetitionEvents: {
        Row: {
          competition: string
          createdAt: string
          createdBy: string | null
          event: string | null
          id: string
          track: string
        }
        Insert: {
          competition: string
          createdAt?: string
          createdBy?: string | null
          event?: string | null
          id?: string
          track: string
        }
        Update: {
          competition?: string
          createdAt?: string
          createdBy?: string | null
          event?: string | null
          id?: string
          track?: string
        }
        Relationships: [
          {
            foreignKeyName: "CompetitionEvents_competition_fkey"
            columns: ["competition"]
            isOneToOne: false
            referencedRelation: "Competitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "CompetitionEvents_event_fkey"
            columns: ["event"]
            isOneToOne: false
            referencedRelation: "Events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "CompetitionEvents_track_fkey"
            columns: ["track"]
            isOneToOne: false
            referencedRelation: "Tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      CompetitionEventTeams: {
        Row: {
          createdAt: string
          event: string
          id: string
          name: string
        }
        Insert: {
          createdAt?: string
          event: string
          id?: string
          name: string
        }
        Update: {
          createdAt?: string
          event?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "competitioneventteams_event_fkey"
            columns: ["event"]
            isOneToOne: false
            referencedRelation: "CompetitionEvents"
            referencedColumns: ["id"]
          },
        ]
      }
      CompetitionEventTeamSelection: {
        Row: {
          createdAt: string
          createdBy: string | null
          id: string
          racer: string | null
          team: string | null
        }
        Insert: {
          createdAt?: string
          createdBy?: string | null
          id?: string
          racer?: string | null
          team?: string | null
        }
        Update: {
          createdAt?: string
          createdBy?: string | null
          id?: string
          racer?: string | null
          team?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "CompetitionEventTeamSelection_racer_fkey"
            columns: ["racer"]
            isOneToOne: false
            referencedRelation: "RacerDetails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "CompetitionEventTeamSelection_racer_fkey"
            columns: ["racer"]
            isOneToOne: false
            referencedRelation: "Racers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "CompetitionEventTeamSelection_racer_fkey"
            columns: ["racer"]
            isOneToOne: false
            referencedRelation: "TaskDetailsView"
            referencedColumns: ["primarily_responsible_person_id"]
          },
          {
            foreignKeyName: "CompetitionEventTeamSelection_racer_fkey"
            columns: ["racer"]
            isOneToOne: false
            referencedRelation: "TaskDetailsView"
            referencedColumns: ["created_by_id"]
          },
          {
            foreignKeyName: "CompetitionEventTeamSelection_team_fkey"
            columns: ["team"]
            isOneToOne: false
            referencedRelation: "CompetitionEventTeams"
            referencedColumns: ["id"]
          },
        ]
      }
      CompetitionMembershipRequirement: {
        Row: {
          competition: string
          createdAt: string
          createdBy: string | null
          id: string
          membership: string
        }
        Insert: {
          competition: string
          createdAt?: string
          createdBy?: string | null
          id?: string
          membership: string
        }
        Update: {
          competition?: string
          createdAt?: string
          createdBy?: string | null
          id?: string
          membership?: string
        }
        Relationships: [
          {
            foreignKeyName: "CompetitionMembershipRequirement_competition_fkey"
            columns: ["competition"]
            isOneToOne: false
            referencedRelation: "Competitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "CompetitionMembershipRequirements_membership_fkey"
            columns: ["membership"]
            isOneToOne: false
            referencedRelation: "MembershipTypes"
            referencedColumns: ["id"]
          },
        ]
      }
      Competitions: {
        Row: {
          createdAt: string
          createdBy: string | null
          id: string
          name: string
        }
        Insert: {
          createdAt?: string
          createdBy?: string | null
          id?: string
          name: string
        }
        Update: {
          createdAt?: string
          createdBy?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      CompetitionSquad: {
        Row: {
          competition: string
          createdAt: string
          createdBy: string | null
          id: string
          racer: string
        }
        Insert: {
          competition: string
          createdAt?: string
          createdBy?: string | null
          id?: string
          racer?: string
        }
        Update: {
          competition?: string
          createdAt?: string
          createdBy?: string | null
          id?: string
          racer?: string
        }
        Relationships: [
          {
            foreignKeyName: "CompetitionEligibleDrivers_competition_fkey"
            columns: ["competition"]
            isOneToOne: false
            referencedRelation: "Competitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "CompetitionSquad_racer_fkey"
            columns: ["racer"]
            isOneToOne: false
            referencedRelation: "RacerDetails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "CompetitionSquad_racer_fkey"
            columns: ["racer"]
            isOneToOne: false
            referencedRelation: "Racers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "CompetitionSquad_racer_fkey"
            columns: ["racer"]
            isOneToOne: false
            referencedRelation: "TaskDetailsView"
            referencedColumns: ["primarily_responsible_person_id"]
          },
          {
            foreignKeyName: "CompetitionSquad_racer_fkey"
            columns: ["racer"]
            isOneToOne: false
            referencedRelation: "TaskDetailsView"
            referencedColumns: ["created_by_id"]
          },
        ]
      }
      EventChecklist: {
        Row: {
          assignedTo: string
          createdAt: string
          description: string | null
          event: string
          id: string
          isDone: boolean
          orderPosition: number
          title: string
        }
        Insert: {
          assignedTo: string
          createdAt?: string
          description?: string | null
          event: string
          id?: string
          isDone?: boolean
          orderPosition?: number
          title: string
        }
        Update: {
          assignedTo?: string
          createdAt?: string
          description?: string | null
          event?: string
          id?: string
          isDone?: boolean
          orderPosition?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "EventChecklist_assignedTo_fkey"
            columns: ["assignedTo"]
            isOneToOne: false
            referencedRelation: "RacerDetails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "EventChecklist_assignedTo_fkey"
            columns: ["assignedTo"]
            isOneToOne: false
            referencedRelation: "Racers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "EventChecklist_assignedTo_fkey"
            columns: ["assignedTo"]
            isOneToOne: false
            referencedRelation: "TaskDetailsView"
            referencedColumns: ["primarily_responsible_person_id"]
          },
          {
            foreignKeyName: "EventChecklist_assignedTo_fkey"
            columns: ["assignedTo"]
            isOneToOne: false
            referencedRelation: "TaskDetailsView"
            referencedColumns: ["created_by_id"]
          },
          {
            foreignKeyName: "EventChecklist_event_fkey"
            columns: ["event"]
            isOneToOne: false
            referencedRelation: "Events"
            referencedColumns: ["id"]
          },
        ]
      }
      Events: {
        Row: {
          createdAt: string
          createdBy: string
          description: string | null
          endsAt: string
          id: string
          name: string
          startsAt: string
        }
        Insert: {
          createdAt?: string
          createdBy?: string
          description?: string | null
          endsAt: string
          id?: string
          name: string
          startsAt: string
        }
        Update: {
          createdAt?: string
          createdBy?: string
          description?: string | null
          endsAt?: string
          id?: string
          name?: string
          startsAt?: string
        }
        Relationships: []
      }
      EventSchedule: {
        Row: {
          completionStatus: boolean
          createdAt: string
          createdBy: string | null
          description: string | null
          event: string | null
          id: string
          scheduledFor: string
          title: string
        }
        Insert: {
          completionStatus?: boolean
          createdAt?: string
          createdBy?: string | null
          description?: string | null
          event?: string | null
          id?: string
          scheduledFor: string
          title: string
        }
        Update: {
          completionStatus?: boolean
          createdAt?: string
          createdBy?: string | null
          description?: string | null
          event?: string | null
          id?: string
          scheduledFor?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "EventSchedule_createdBy_fkey"
            columns: ["createdBy"]
            isOneToOne: false
            referencedRelation: "RacerDetails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "EventSchedule_createdBy_fkey"
            columns: ["createdBy"]
            isOneToOne: false
            referencedRelation: "Racers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "EventSchedule_createdBy_fkey"
            columns: ["createdBy"]
            isOneToOne: false
            referencedRelation: "TaskDetailsView"
            referencedColumns: ["primarily_responsible_person_id"]
          },
          {
            foreignKeyName: "EventSchedule_createdBy_fkey"
            columns: ["createdBy"]
            isOneToOne: false
            referencedRelation: "TaskDetailsView"
            referencedColumns: ["created_by_id"]
          },
          {
            foreignKeyName: "EventSchedule_event_fkey"
            columns: ["event"]
            isOneToOne: false
            referencedRelation: "Events"
            referencedColumns: ["id"]
          },
        ]
      }
      EventTicket: {
        Row: {
          availableFrom: string
          availableUntil: string
          createdAt: string
          event: string | null
          id: string
          maxAvailable: number
          membershipType: string | null
          name: string
          price: number
        }
        Insert: {
          availableFrom?: string
          availableUntil: string
          createdAt?: string
          event?: string | null
          id?: string
          maxAvailable?: number
          membershipType?: string | null
          name: string
          price: number
        }
        Update: {
          availableFrom?: string
          availableUntil?: string
          createdAt?: string
          event?: string | null
          id?: string
          maxAvailable?: number
          membershipType?: string | null
          name?: string
          price?: number
        }
        Relationships: [
          {
            foreignKeyName: "EventTicket_event_fkey"
            columns: ["event"]
            isOneToOne: false
            referencedRelation: "Events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "EventTicket_membershipType_fkey"
            columns: ["membershipType"]
            isOneToOne: false
            referencedRelation: "MembershipTypes"
            referencedColumns: ["id"]
          },
        ]
      }
      EventTicketAllocation: {
        Row: {
          allocatedAt: string
          allocatedBy: string | null
          eventTicket: string
          id: string
          racer: string
        }
        Insert: {
          allocatedAt?: string
          allocatedBy?: string | null
          eventTicket: string
          id?: string
          racer: string
        }
        Update: {
          allocatedAt?: string
          allocatedBy?: string | null
          eventTicket?: string
          id?: string
          racer?: string
        }
        Relationships: [
          {
            foreignKeyName: "EventTicketAllocation_allocatedBy_fkey"
            columns: ["allocatedBy"]
            isOneToOne: false
            referencedRelation: "RacerDetails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "EventTicketAllocation_allocatedBy_fkey"
            columns: ["allocatedBy"]
            isOneToOne: false
            referencedRelation: "Racers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "EventTicketAllocation_allocatedBy_fkey"
            columns: ["allocatedBy"]
            isOneToOne: false
            referencedRelation: "TaskDetailsView"
            referencedColumns: ["primarily_responsible_person_id"]
          },
          {
            foreignKeyName: "EventTicketAllocation_allocatedBy_fkey"
            columns: ["allocatedBy"]
            isOneToOne: false
            referencedRelation: "TaskDetailsView"
            referencedColumns: ["created_by_id"]
          },
          {
            foreignKeyName: "EventTicketAllocation_eventTicket_fkey"
            columns: ["eventTicket"]
            isOneToOne: false
            referencedRelation: "EventTicket"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "EventTicketAllocation_racer_fkey"
            columns: ["racer"]
            isOneToOne: false
            referencedRelation: "RacerDetails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "EventTicketAllocation_racer_fkey"
            columns: ["racer"]
            isOneToOne: false
            referencedRelation: "Racers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "EventTicketAllocation_racer_fkey"
            columns: ["racer"]
            isOneToOne: false
            referencedRelation: "TaskDetailsView"
            referencedColumns: ["primarily_responsible_person_id"]
          },
          {
            foreignKeyName: "EventTicketAllocation_racer_fkey"
            columns: ["racer"]
            isOneToOne: false
            referencedRelation: "TaskDetailsView"
            referencedColumns: ["created_by_id"]
          },
        ]
      }
      EventTicketAllocationCheckIn: {
        Row: {
          createdAt: string
          createdBy: string
          id: string
        }
        Insert: {
          createdAt?: string
          createdBy?: string
          id: string
        }
        Update: {
          createdAt?: string
          createdBy?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "EventTicketAllocationCheckIn_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "EventTicketAllocation"
            referencedColumns: ["id"]
          },
        ]
      }
      EventTransport: {
        Row: {
          additionalDetails: string | null
          driver: string
          event: string
          id: string
          maxCapacity: number
        }
        Insert: {
          additionalDetails?: string | null
          driver: string
          event: string
          id?: string
          maxCapacity?: number
        }
        Update: {
          additionalDetails?: string | null
          driver?: string
          event?: string
          id?: string
          maxCapacity?: number
        }
        Relationships: [
          {
            foreignKeyName: "eventtransport_driver_fkey"
            columns: ["driver"]
            isOneToOne: false
            referencedRelation: "RacerDetails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eventtransport_driver_fkey"
            columns: ["driver"]
            isOneToOne: false
            referencedRelation: "Racers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eventtransport_driver_fkey"
            columns: ["driver"]
            isOneToOne: false
            referencedRelation: "TaskDetailsView"
            referencedColumns: ["primarily_responsible_person_id"]
          },
          {
            foreignKeyName: "eventtransport_driver_fkey"
            columns: ["driver"]
            isOneToOne: false
            referencedRelation: "TaskDetailsView"
            referencedColumns: ["created_by_id"]
          },
          {
            foreignKeyName: "eventtransport_event_fkey"
            columns: ["event"]
            isOneToOne: false
            referencedRelation: "Events"
            referencedColumns: ["id"]
          },
        ]
      }
      EventTransportAllocation: {
        Row: {
          id: string
          ticketAllocation: string
          transport: string | null
        }
        Insert: {
          id?: string
          ticketAllocation: string
          transport?: string | null
        }
        Update: {
          id?: string
          ticketAllocation?: string
          transport?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "EventTransportAllocation_ticketAllocation_fkey"
            columns: ["ticketAllocation"]
            isOneToOne: false
            referencedRelation: "EventTicketAllocation"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "EventTransportAllocation_transport_fkey"
            columns: ["transport"]
            isOneToOne: false
            referencedRelation: "EventTransport"
            referencedColumns: ["id"]
          },
        ]
      }
      Members: {
        Row: {
          addedAt: string
          addedBy: string | null
          id: string
          membership: string
          racer: string
        }
        Insert: {
          addedAt?: string
          addedBy?: string | null
          id?: string
          membership?: string
          racer: string
        }
        Update: {
          addedAt?: string
          addedBy?: string | null
          id?: string
          membership?: string
          racer?: string
        }
        Relationships: [
          {
            foreignKeyName: "Members_membership_fkey"
            columns: ["membership"]
            isOneToOne: false
            referencedRelation: "MembershipTypes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Members_racer_fkey"
            columns: ["racer"]
            isOneToOne: false
            referencedRelation: "RacerDetails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Members_racer_fkey"
            columns: ["racer"]
            isOneToOne: false
            referencedRelation: "Racers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Members_racer_fkey"
            columns: ["racer"]
            isOneToOne: false
            referencedRelation: "TaskDetailsView"
            referencedColumns: ["primarily_responsible_person_id"]
          },
          {
            foreignKeyName: "Members_racer_fkey"
            columns: ["racer"]
            isOneToOne: false
            referencedRelation: "TaskDetailsView"
            referencedColumns: ["created_by_id"]
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
      TaskAssignees: {
        Row: {
          assigned_at: string
          assigned_by: string
          assigned_to: string
          task: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string
          assigned_to: string
          task?: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string
          assigned_to?: string
          task?: string
        }
        Relationships: [
          {
            foreignKeyName: "TaskAssignments_assigned_by_fkey1"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "RacerDetails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "TaskAssignments_assigned_by_fkey1"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "Racers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "TaskAssignments_assigned_by_fkey1"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "TaskDetailsView"
            referencedColumns: ["primarily_responsible_person_id"]
          },
          {
            foreignKeyName: "TaskAssignments_assigned_by_fkey1"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "TaskDetailsView"
            referencedColumns: ["created_by_id"]
          },
          {
            foreignKeyName: "TaskAssignments_assigned_to_fkey1"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "RacerDetails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "TaskAssignments_assigned_to_fkey1"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "Racers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "TaskAssignments_assigned_to_fkey1"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "TaskDetailsView"
            referencedColumns: ["primarily_responsible_person_id"]
          },
          {
            foreignKeyName: "TaskAssignments_assigned_to_fkey1"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "TaskDetailsView"
            referencedColumns: ["created_by_id"]
          },
          {
            foreignKeyName: "TaskAssignments_task_fkey"
            columns: ["task"]
            isOneToOne: false
            referencedRelation: "TaskDetailsView"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "TaskAssignments_task_fkey"
            columns: ["task"]
            isOneToOne: false
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
          task: string
        }
        Insert: {
          authored_by?: string
          content: string
          created_at?: string
          id?: string
          task?: string
        }
        Update: {
          authored_by?: string
          content?: string
          created_at?: string
          id?: string
          task?: string
        }
        Relationships: [
          {
            foreignKeyName: "TaskComments_authored_by_fkey1"
            columns: ["authored_by"]
            isOneToOne: false
            referencedRelation: "RacerDetails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "TaskComments_authored_by_fkey1"
            columns: ["authored_by"]
            isOneToOne: false
            referencedRelation: "Racers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "TaskComments_authored_by_fkey1"
            columns: ["authored_by"]
            isOneToOne: false
            referencedRelation: "TaskDetailsView"
            referencedColumns: ["primarily_responsible_person_id"]
          },
          {
            foreignKeyName: "TaskComments_authored_by_fkey1"
            columns: ["authored_by"]
            isOneToOne: false
            referencedRelation: "TaskDetailsView"
            referencedColumns: ["created_by_id"]
          },
          {
            foreignKeyName: "TaskComments_task_fkey"
            columns: ["task"]
            isOneToOne: false
            referencedRelation: "TaskDetailsView"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "TaskComments_task_fkey"
            columns: ["task"]
            isOneToOne: false
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
          parent_task: string | null
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
          parent_task?: string | null
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
          parent_task?: string | null
          primarily_responsible_person?: string
          priority?: Database["public"]["Enums"]["task_priority"]
          status?: Database["public"]["Enums"]["task_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "Tasks_created_by_fkey1"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "RacerDetails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Tasks_created_by_fkey1"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "Racers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Tasks_created_by_fkey1"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "TaskDetailsView"
            referencedColumns: ["primarily_responsible_person_id"]
          },
          {
            foreignKeyName: "Tasks_created_by_fkey1"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "TaskDetailsView"
            referencedColumns: ["created_by_id"]
          },
          {
            foreignKeyName: "Tasks_parent_task_fkey"
            columns: ["parent_task"]
            isOneToOne: false
            referencedRelation: "TaskDetailsView"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Tasks_parent_task_fkey"
            columns: ["parent_task"]
            isOneToOne: false
            referencedRelation: "Tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Tasks_primarily_responsible_person_fkey1"
            columns: ["primarily_responsible_person"]
            isOneToOne: false
            referencedRelation: "RacerDetails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Tasks_primarily_responsible_person_fkey1"
            columns: ["primarily_responsible_person"]
            isOneToOne: false
            referencedRelation: "Racers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Tasks_primarily_responsible_person_fkey1"
            columns: ["primarily_responsible_person"]
            isOneToOne: false
            referencedRelation: "TaskDetailsView"
            referencedColumns: ["primarily_responsible_person_id"]
          },
          {
            foreignKeyName: "Tasks_primarily_responsible_person_fkey1"
            columns: ["primarily_responsible_person"]
            isOneToOne: false
            referencedRelation: "TaskDetailsView"
            referencedColumns: ["created_by_id"]
          },
        ]
      }
      Tracks: {
        Row: {
          created_at: string
          id: string
          name: string | null
          track_map_upload_path: string | null
          type: Database["public"]["Enums"]["track_type"] | null
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string | null
          track_map_upload_path?: string | null
          type?: Database["public"]["Enums"]["track_type"] | null
        }
        Update: {
          created_at?: string
          id?: string
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
            isOneToOne: false
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
      TaskDetailsView: {
        Row: {
          assignees: string[] | null
          comment_count: number | null
          created_at: string | null
          created_by_full_name: string | null
          created_by_id: string | null
          description: string | null
          due_at: string | null
          id: string | null
          parent_task: string | null
          primarily_responsible_person_full_name: string | null
          primarily_responsible_person_id: string | null
          priority: Database["public"]["Enums"]["task_priority"] | null
          status: Database["public"]["Enums"]["task_status"] | null
          subtasks_completed: number | null
          subtasks_total: number | null
          title: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Tasks_parent_task_fkey"
            columns: ["parent_task"]
            isOneToOne: false
            referencedRelation: "TaskDetailsView"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Tasks_parent_task_fkey"
            columns: ["parent_task"]
            isOneToOne: false
            referencedRelation: "Tasks"
            referencedColumns: ["id"]
          },
        ]
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
      RacePenalty:
        | "Kart Change Penalty"
        | "Excessive Weaving"
        | "Jump Start"
        | "Breaking Formation"
        | "Fuel Pipe Pinching"
        | "Adjusting Radiator Cover"
        | "Carburettor Adjustment"
        | "Contact Warning"
        | "Contact Advantage"
        | "Forcing Driver Wide"
        | "Causing Spin"
        | "Multiple Kart Contact"
        | "Deliberate Forcing Off Track"
        | "Blocking"
        | "Overtaking Under Yellow"
        | "Speeding Under Yellow"
        | "Pit Lane Speeding"
        | "Track Limits Violation"
        | "Restarting on Grass"
        | "Rolling Back Across Track"
        | "Abandoning Kart"
        | "Underweight"
        | "Deliberate Contact After Race"
        | "Multiple Severe Incidents"
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

