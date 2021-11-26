import React, { useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { TableListItem } from './data.d';
import moment from 'moment';

const TableList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '日期',
      dataIndex: 'date',
      renderText: (val) => moment(val).format('YYYY-MM-DD'),
      hideInSearch: true
    },
    {
      title: '报警内容',
      dataIndex: 'content',
      renderText: (val) => val,
      hideInSearch: true
    },
    {
      title: '报警数值',
      dataIndex: 'warningValue',
      renderText: (val) => Number(val).toFixed(2),
      hideInSearch: true
    },
  ];

  return (
    <PageContainer title={false} pageHeaderRender={false}>
      <ProTable<TableListItem>
        headerTitle="报警信息"
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        dataSource={
          (10).times((i) => ({
            key: i,
            date: moment().add(-i, 'hour').format('YYYY-MM-DD HH:mm:ss'),
            content: `报警内容`,
            warningValue: 999,
          }))
        }
        columns={columns}
      />
    </PageContainer>
  );
};

export default TableList;
