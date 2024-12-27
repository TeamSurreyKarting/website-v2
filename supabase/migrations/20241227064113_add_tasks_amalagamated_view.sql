create or replace view "public"."TaskDetailsView" as  SELECT t.id,
															 t.created_at,
															 t.updated_at,
															 cb.id AS created_by_id,
															 cb."fullName" AS created_by_full_name,
															 prp.id AS primarily_responsible_person_id,
															 prp."fullName" AS primarily_responsible_person_full_name,
															 t.parent_task,
															 t.title,
															 t.description,
															 t.due_at,
															 t.status,
															 t.priority,
															 ARRAY( SELECT ra.id
           FROM "RacerDetails" ra
          WHERE (ra.id IN ( SELECT ta.assigned_to
                   FROM "TaskAssignments" ta
                  WHERE (ta.task = t.id)))) AS assignees,
															 ( SELECT count(*) AS count
													  FROM "TaskComments" tc
													  WHERE (tc.task = t.id)) AS comment_count
													  FROM (("Tasks" t
														  LEFT JOIN "RacerDetails" cb ON ((t.created_by = cb.id)))
														  LEFT JOIN "RacerDetails" prp ON ((t.primarily_responsible_person = prp.id)))
													  ORDER BY t.created_at DESC;
