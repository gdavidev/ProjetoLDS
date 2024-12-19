import { IonIcon } from '@ionic/react';
import { enterOutline, reloadOutline } from 'ionicons/icons';
import TableDisplay from '@apps/admin/components/TableDisplay';
import { IconButton } from '@mui/material';
import useStatefulArray from '@/hooks/useStatefulArray';
import useCurrentUser from '@/hooks/useCurrentUser';
import Report, { ReportContentType } from '@models/Report';
import useRequestErrorHandler from '@/hooks/useRequestErrorHandler.ts';
import useNotification from '@/hooks/feedback/useNotification.tsx';
import { useCallback, useState } from 'react';
import DateFormatter from '@libs/DateFormatter.ts';
import { useNavigate } from 'react-router-dom';
import ReportResolveModal from '@apps/admin/components/modal/ReportResolveModal.tsx';
import { useReports } from '@/hooks/useReport.ts';
import Loading from '@shared/components/Loading.tsx';
import { AxiosError } from 'axios';

export default function ReportsView() {
    const [ reportModalData  , setReportModalData   ] = useState<Report | undefined>();
    const [ isReportModalOpen, setIsReportModalOpen ] = useState<boolean>(false);
    const { user } = useCurrentUser();
    const navigate = useNavigate();
    const { notifyError } = useNotification();
    const reports = useStatefulArray<Report>([], {
        compare: (r1: Report, r2: Report) => r1.id === r2.id,
    });

    // ---- API Calls Setup ----
    const { isReportsLoading, reloadReports } = useReports(user!.token, {
        onSuccess: (list: Report[]) => {
            reports.set(list.sort((prev, curr) => prev.id - curr.id))
        },
        onError: (error: AxiosError | Error) => handleRequestError(error)
    });

    // ---- API Calls Error Handling ----
    const { handleRequestError } = useRequestErrorHandler({
        mappings: [{ status: 'default', userMessage: "Por favor tente novamente mais tarde.", log: true }],
        onError: (message: string) => notifyError(message)
    });

    const handleResolveReport = useCallback((report: Report) => {
        setReportModalData(report)
        setIsReportModalOpen(true);
    }, [])

    const gotoReportTarget = useCallback((report: Report) => {
        if (report.contentType === ReportContentType.POST)
            navigate('/forum/post/' + report.contentId);
    }, []);

    const templateHeader: { colName: string; colWidth: string }[] = [
        { colName: 'User'      , colWidth: '10px'  },
        { colName: 'Tipo'      , colWidth: '100px' },
        { colName: 'ID'        , colWidth: '10px'  },
        { colName: 'Razão'     , colWidth: '300px' },
        { colName: 'Em'        , colWidth: '100px' },
        { colName: ''          , colWidth: '25px'  },
    ];

    if (isReportsLoading)
        return <Loading />
    return (
        <>
            <div className='flex flex-col'>
                <div className='mx-5 flex items-center justify-between text-white'>
                    <h2 className='font-rubik font-bold'>Lista de Denuncias</h2>
                    <div className='flex gap-x-2'>
                        <IconButton onClick={() => reloadReports()}>
                            <IonIcon icon={reloadOutline} />
                            Recarregar
                        </IconButton>
                    </div>
                </div>
                <TableDisplay
                    headerTemplate={templateHeader}
                    tableStyleObject={{
                        width: '100%',
                        borderSpacing: '0 3px',
                    }}
                    tableHeaderClassName='text-white font-rubik font-bold'
                >
                    {reports.all.map((report: Report, i: number) => {
                        return (
                            <ReportDataTableRow
                                key={i}
                                report={report}
                                rowClassName='bg-primary-light text-white'
                                cellClassName='first:rounded-s-md last:rounded-e-md'
                                actions={{
                                    resolve: handleResolveReport,
                                    goto: gotoReportTarget
                                }}
                            />
                        );
                    })}
                </TableDisplay>
            </div>
            <ReportResolveModal
                report={ reportModalData }
                isOpen={ isReportModalOpen }
                onCloseRequest={ () => setIsReportModalOpen(false) }
            />
        </>
    );
}

type ReportTableRowProps = {
    rowClassName?: string;
    cellClassName?: string;
    report: Report;
    actions: {
        resolve: (report: Report) => void;
        goto: (report: Report) => void
    };
};

function ReportDataTableRow(props: ReportTableRowProps) {
    return (
        <tr className={props.rowClassName}>
            <td className={props.cellClassName}>
                {props.report.reportedBy}
            </td>
            <td className={props.cellClassName}>
                {Report.serializeContentType(props.report.contentType)}
            </td>
            <td className={props.cellClassName}>
                {props.report.contentId}
            </td>
            <td className={props.cellClassName}>
                {props.report.reason}
            </td>
            <td className={props.cellClassName}>
                {DateFormatter.relativeDate(props.report.createdDate)}
            </td>
            <td className={props.cellClassName}>
                <div style={{ display: 'flex', gap: 1 }}>
                    <IconButton
                        size='small'
                        color='default'
                        onClick={() => {
                            props.actions.goto(props.report);
                        }}
                        sx={{ p: '10px' }}
                    >
                        <IonIcon style={{ color: '#FFFFFF' }} icon={enterOutline} />
                    </IconButton>
                </div>
            </td>
        </tr>
    );
}