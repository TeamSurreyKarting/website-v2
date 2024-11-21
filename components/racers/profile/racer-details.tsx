'use client';

import {Button} from "@/components/ui/button";
import { MdEdit } from "react-icons/md";
import { FaSave } from "react-icons/fa";
import {useState} from "react";
import {Database} from "@/database.types";
import {clsx} from "clsx";
import {Spinner} from "@/components/ui/spinner";

export default function RacerDetails(details: Database['public']['Views']['RacerDetails']['Row']) {
	const [isEditing, setIsEditing] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [changesMade, setChangesMade] = useState(true);

	return (
		<div className={"my-6 rounded-lg bg-ts-blue-600 w-full h-40 border border-ts-blue-400 p-4"}>
			<div className={"flex gap-2 justify-between"}>
				<h4 className={"font-medium"}>Details</h4>
				<Button
					className={clsx(
						{
							'bg-ts-blue-400': !isEditing,
							'bg-white text-black': isEditing
						}
					)}
					variant={isEditing || isSaving ? "secondary" : "outline"}
					onClick={() => {
						if (!isEditing) {
							setIsEditing(true);
						} else {
							if (isEditing && !isSaving && changesMade) {
								setIsSaving(true);
							} else {
								setIsSaving(false);
								setIsEditing(false);
							}
						}
					}}
					disabled={isSaving}
				>
					{isSaving ? <Spinner /> : (isEditing ? <FaSave /> : <MdEdit />)}
					{isSaving ? "Saving" : (isEditing ? "Save" : "Edit")}
				</Button>
			</div>
			<div>
				Email: {details.email}
			</div>
		</div>
	);
}
