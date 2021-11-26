import React, { useRef } from 'react';
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
      dataIndex: 'mechinePosition',
      renderText: (val: string) => val,
      valueEnum: {
        0: { text: '北辰工地现场西区2号南门' },
      },
    },
    {
      title: '类别',
      dataIndex: 'mechineType',
      renderText: (val) => val,
      hideInSearch: true
    },
    {
      title: '人员编号',
      dataIndex: 'personIdentifity',
      renderText: (val) => val,
    },
    {
      title: '姓名',
      dataIndex: 'personName',
      renderText: (val) => val,
      hideInSearch: true
    },
    {
      title: '手机号',
      dataIndex: 'personPhone',
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
      dataIndex: 'action',
      renderText: (val) => val,
      valueEnum: {
        0: { text: '进入' },
        1: { text: '枪机' },
      },
    },
    {
      title: '状态',
      dataIndex: 'state',
      renderText: (val) => val,
      hideInSearch: true
    },
    {
      title: '起止日期',
      dataIndex: 'dateRange',
      valueType: 'dateTimeRange',
      hideInTable: true
    },
  ];

  return (
    <PageContainer title={false} pageHeaderRender={false}>
      <ProTable<TableListItem>
        headerTitle="进出记录"
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        request={() => queryRule()}
        columns={columns}
      />
    </PageContainer>
  );
};

export default TableList;
