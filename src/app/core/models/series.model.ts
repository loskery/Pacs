import { Study } from './study.model';

export class Series {
    seriesId: number;
    seriesStudyId: number;
    seriesSeriesInstanceUID: string;
    seriesBodyPartExamined: string;
    seriesSeriesNumber: number;
    seriesSeriesDescription: string;
    seriesSeriesDate: Date;
    seriesModality: string;
    seriesSeriesTime: Date;
    seriesAETitle: string;
    seriesDateTime: Date;
    qnuRis_Study: Study;
}
