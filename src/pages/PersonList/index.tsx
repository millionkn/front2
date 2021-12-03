import React, { useEffect, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { TableListItem } from './data.d';
import { queryRule } from './service';
import moment from 'moment';

const TableList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      dataIndex: 'key',
      renderText: (val, b, index) => index + 1,
      hideInSearch: true
    },
    {
      title: '闸机位置',
      dataIndex: 'deviceIdentify',
      renderText: (val: string) => val,
    },
    {
      title: '类别',
      dataIndex: 'regType',
      renderText: (val) => val === 'idcard' ? '身份证' : val === 'face' ? '刷脸' : '--',
      hideInSearch: true
    },
    {
      title: '人员编号',
      dataIndex: 'personId',
      renderText: (val) => val,
    },
    {
      title: '姓名',
      dataIndex: 'personName',
      renderText: (val) => val,
      hideInSearch: true
    },
    {
      title: '日期',
      dataIndex: 'date',
      renderText: (val) => moment(val).format('YYYY-MM-DD'),
      hideInSearch: true
    },
    {
      title: '动作',
      dataIndex: 'personAction',
      renderText: (val) => val === 'in' ? '进入' : val === 'out' ? '枪机' : '--',
      valueEnum: {
        0: { text: '进入' },
        1: { text: '枪机' },
      },
    },
  ];
  useEffect(() => {
    actionRef.current?.reload(true)
  }, [])
  return (
    <PageContainer title={false} pageHeaderRender={false}>
      <ProTable<TableListItem>
        headerTitle="进出记录"
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        pagination={{ pageSize: 10 }}
        request={async ({ pageSize, current }) => queryRule({ page: { index: current || 1, size: pageSize || 10 } })}
        columns={columns}
      />
    </PageContainer>
  );
};

export default TableList;
