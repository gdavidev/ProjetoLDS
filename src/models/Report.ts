import * as DTO from '@models/data/ReportDTOs.ts'

export enum ReportContentType {
	POST,
	COMMENT
}

export enum ReportStatus {
	DEFERRED,
	PENDING,
	CLOSED
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

	public constructor(
			id: number,
			reportedBy: number,
			contentType: ReportContentType,
			contentId: number,
			reason: string,
			status: ReportStatus,
			reviewedBy: number,
			resolution: string,
			createdDate: Date,
			updatedDate: Date
	) {
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
				dto.id,
				dto.reported_by,
				Report.parseContentType(dto.content_type),
				dto.content_id,
				dto.reason,
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

	public static parseContentType(value: string): ReportContentType {
		if (value.toLowerCase() === 'post') return ReportContentType.POST;
		if (value.toLowerCase() === 'comment') return ReportContentType.COMMENT;
		throw new Error(`Could not parse content type: '${ value }'`);
	}

	public static serializeContentType(value: ReportContentType): string {
		if (value === ReportContentType.POST) return 'post';
		if (value === ReportContentType.COMMENT) return 'comment';
		throw new Error(`Could not serialize content type: '${ value }'`);
	}

	public static parseStatus(value: string): ReportStatus {
		if (value.toLowerCase() === 'cancelado') return ReportStatus.DEFERRED;
		if (value.toLowerCase() === 'pendente') return ReportStatus.PENDING;
		if (value.toLowerCase() === 'fechado') return ReportStatus.CLOSED;
		throw new Error(`Could not parse status: '${ value }'`);
	}

	public static serializeStatus(value: ReportStatus): string {
		if (value === ReportStatus.DEFERRED) return 'cancelado';
		if (value === ReportStatus.PENDING) return 'pendente';
		if (value === ReportStatus.CLOSED) return 'fechado';
		throw new Error(`Could not serialize status: '${ value }'`);
	}
}
