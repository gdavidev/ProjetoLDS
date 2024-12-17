import * as DTO from '@models/data/ReportDTOs.ts'

export enum ReportContentType {
	POST,
	COMMENT
}

export enum ReportStatus {
	DEFERRED,
	PENDING,
	INFERRED
}

export default class Report {
	id: number;
	reportedBy: number;
	contentType: ReportContentType;
	contentId: number;
	reason: string;
	status: ReportStatus;
	reviewedBy: number;
	resolution: string;
	createdDate: Date;
	updatedDate: Date;

	constructor(
			contentId: number,
			contentType: ReportContentType,
			reportedBy: number,
			reason: string)
	constructor(
			contentId: number,
			contentType: ReportContentType,
			reportedBy: number,
			reason: string,
			id: number,
			status: ReportStatus,
			reviewedBy: number,
			resolution: string,
			createdDate: Date,
			updatedDate: Date)
	constructor(
			contentId: number,
			contentType: ReportContentType,
			reportedBy: number,
			reason: string,
			id: number = 0,
			status: ReportStatus = ReportStatus.PENDING,
			reviewedBy: number = 0,
			resolution: string = '',
			createdDate: Date = new Date(),
			updatedDate: Date = new Date())
	{
		this.id 				 = id;
		this.reportedBy	 = reportedBy;
		this.contentType = contentType;
		this.contentId	 = contentId;
		this.reason			 = reason;
		this.status			 = status;
		this.reviewedBy	 = reviewedBy;
		this.resolution	 = resolution;
		this.createdDate = createdDate;
		this.updatedDate = updatedDate;
	}

	public static fromGetDTO(dto: DTO.ReportGetResponseDTO): Report {
		return new Report(
				dto.content_id,
				Report.parseContentType(dto.content_type_name),
				dto.reported_by,
				dto.reason,
				dto.id,
				Report.parseStatus(dto.status),
				dto.reviewed_by,
				dto.resolution,
				new Date(dto.created_at),
				new Date(dto.updated_at)
		);
	}

	public toCreateDTO(): DTO.ReportCreateDTO {
		return {
			reported_by: this.reportedBy,
			content_type: Report.serializeContentType(this.contentType),
			content_id: this.contentId,
			reason: this.reason,
		}
	}

	public toResolveDTO(): DTO.ReportResolveDTO {
		return {
			reported_by: this.reportedBy,
			content_type: Report.serializeContentType(this.contentType),
			content_id: this.contentId,
			reason: this.reason,
			status: Report.serializeStatus(this.status),
			reviewed_by: this.reviewedBy,
			resolution: this.resolution,
		}
	}

	public static parseContentType(value: string): ReportContentType {
		if (value.toLowerCase() === 'topico') return ReportContentType.POST;
		if (value.toLowerCase() === 'comentario') return ReportContentType.COMMENT;
		throw new Error(`Could not parse content type: '${ value }'`);
	}

	public static serializeContentType(value: ReportContentType): string {
		if (value === ReportContentType.POST) return 'topico';
		if (value === ReportContentType.COMMENT) return 'comentario';
		throw new Error(`Could not serialize content type: '${ value }'`);
	}

	public static parseStatus(value: string): ReportStatus {
		if (value.toLowerCase() === 'deferido') return ReportStatus.DEFERRED;
		if (value.toLowerCase() === 'pendente') return ReportStatus.PENDING;
		if (value.toLowerCase() === 'indeferido') return ReportStatus.INFERRED;
		throw new Error(`Could not parse status: '${ value }'`);
	}

	public static serializeStatus(value: ReportStatus): string {
		if (value === ReportStatus.DEFERRED) return 'deferido';
		if (value === ReportStatus.PENDING) return 'pendente';
		if (value === ReportStatus.INFERRED) return 'indeferido';
		throw new Error(`Could not serialize status: '${ value }'`);
	}
}
