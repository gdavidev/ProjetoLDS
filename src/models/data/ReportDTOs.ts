/* CREATE */
export type ReportCreateDTO = {
	reported_by: number,
	content_type: string,
	content_id: number,
	reason: string,
}
export type ReportCreateResponseDTO = {
	id: number,
	reported_by: number,
	content_type: string,
	content_id: number,
	reason: string,
	status: string,
	reviewed_by: number,
	resolution: string,
	created_at: number,
	updated_at: number,
}

/* DELETE */
export type ReportDeleteDTO = {
}
export type ReportDeleteResponseDTO = {}

/* GET */
export type ReportGetDTO = {
}
export type ReportGetResponseDTO = {
	id: number,
	reported_by: number,
	content_type: string,
	content_id: number,
	reason: string,
	status: string,
	reviewed_by: number,
	resolution: string,
	created_at: number,
	updated_at: number,
}