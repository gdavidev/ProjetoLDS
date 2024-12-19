/* CREATE */
export type ReportCreateDTO = {
	reported_by: number,
	content_type: string,
	content_id: number,
	reason: string,
}

/* RESOLVE */
export type ReportResolveDTO = {
	reported_by: number,
	content_type: string,
	content_id: number,
	reason: string,
	status: string,
	reviewed_by: number,
	resolution: string,
}

/* DELETE */
export type ReportDeleteDTO = {
	id: number,
}

/* GET */
export type ReportGetDTO = {
	id: number,
}
export type ReportGetResponseDTO = {
	id: number,
	reported_by: number,
	content_type: number,
	content_type_name: string,
	content_id: number,
	reason: string,
	status: string,
	reviewed_by: number,
	resolution: string,
	created_at: number,
	updated_at: number,
}